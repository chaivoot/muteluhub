import { describe, expect, it } from 'vitest';
import type { Place } from '@/data/places';
import { bookingLink, lodgingLink } from '@/lib/booking';
import { TRAVELOKA_ABROAD_CITY, TRAVELOKA_PLACE, TRAVELOKA_PROVINCE } from '@/data/traveloka-urls';
import { PROVINCES } from '@/data/provinces';
import { cityPillarsByProvince, deitiesOf, deitySuggestions, featuredPlaces, filterPlaces, mapLink, provincesWithPlaces, relatedPlaces } from '@/lib/places';

const base: Omit<Place, 'slug' | 'provinceSlug' | 'goals' | 'deities'> = {
  name: 'x',
  type: 'temple',
  country: 'TH',
  lat: 13.7,
  lng: 100.5,
  openingHours: null,
  summary: '',
  offerings: [],
  howToPray: [],
  howToRepayVow: [],
  images: [],
  sources: [],
  checkedAt: '2026-10-11',
  published: true,
  notes: [],
};
const a: Place = { ...base, slug: 'a', provinceSlug: 'bangkok', goals: ['money', 'love'], deities: ['ท้าวมหาพรหม'] };
const b: Place = { ...base, slug: 'b', provinceSlug: 'bangkok', goals: ['career'], deities: ['เจ้าพ่อเสือ'] };
const c: Place = { ...base, slug: 'c', provinceSlug: 'chiang-mai', goals: ['money'], deities: ['พระธาตุ'] };
const list = [a, b, c];

describe('filterPlaces', () => {
  it('filters by goal, deity and province together', () => {
    expect(filterPlaces({ goal: 'money' }, list).map((p) => p.slug)).toEqual(['a', 'c']);
    expect(filterPlaces({ goal: 'money', province: 'bangkok' }, list).map((p) => p.slug)).toEqual(['a']);
    expect(filterPlaces({ deity: 'tua-lao-ia' }, list).map((p) => p.slug)).toEqual(['b']);
    expect(filterPlaces({ deity: 'brahma' }, list).map((p) => p.slug)).toEqual(['a']);
    expect(filterPlaces({}, list)).toHaveLength(3);
  });
});

describe('text search', () => {
  it('matches name, deity and province, every word must hit', () => {
    const d: Place = { ...c, slug: 'd', name: 'วัดพระธาตุดอยสุเทพ', nameEn: 'Wat Phra That Doi Suthep' };
    expect(filterPlaces({ q: 'ดอยสุเทพ' }, [...list, d]).map((p) => p.slug)).toEqual(['d']);
    expect(filterPlaces({ q: 'doi suthep' }, [...list, d]).map((p) => p.slug)).toEqual(['d']);
    expect(filterPlaces({ q: 'เจ้าพ่อเสือ' }, list).map((p) => p.slug)).toEqual(['b']);
    expect(filterPlaces({ q: 'วัด เชียงใหม่' }, [...list, d]).map((p) => p.slug)).toEqual(['d']);
    expect(filterPlaces({ q: 'วัด ภูเก็ต' }, [...list, d])).toEqual([]);
  });
});

describe('deity groups', () => {
  it('groups spelling variants of the same deity', () => {
    const variants = ['กวนอู', 'เทพเจ้ากวนอู', 'เจ้าพ่อกวนอู'].map((d, i) => ({ ...b, slug: `g${i}`, deities: [d] }));
    expect(filterPlaces({ deity: 'guan-yu', province: 'bangkok' }, [...list, ...variants])).toHaveLength(3);
    expect(deitiesOf(variants)).toEqual([expect.objectContaining({ slug: 'guan-yu', count: 3 })]);
  });

  it('counts a place in a group by deity name or by the group slug list', () => {
    const named: Place = { ...b, slug: 'named', deities: ['ไท้ส่วยเอี๊ยะ'] };
    const listed: Place = { ...b, slug: 'chao-pho-suea-shrine', deities: ['เจ้าพ่อเสือ'] };
    expect(filterPlaces({ deity: 'tai-sui' }, [...list, named, listed]).map((p) => p.slug)).toEqual(['named', 'chao-pho-suea-shrine']);
    expect(deitySuggestions([named, listed], 'ไท้ส่วย')).toEqual([expect.objectContaining({ kind: 'group', slug: 'tai-sui', count: 2 })]);
  });

  it('suggests groups and loose deity names for typed text', () => {
    const d: Place = { ...b, slug: 'd', deities: ['เจ้าพ่อพระกาฬ', 'เทพเจ้ากวนอู'] };
    expect(deitySuggestions([...list, d], '').map((s) => s.label)).toContain('เทพเจ้ากวนอู');
    expect(deitySuggestions([...list, d], 'กวน')).toEqual([expect.objectContaining({ kind: 'group', slug: 'guan-yu' })]);
    expect(deitySuggestions([...list, d], 'พระกาฬ')).toEqual([{ kind: 'text', label: 'เจ้าพ่อพระกาฬ', count: 1 }]);
    expect(filterPlaces({ deityText: 'พระ กาฬ' }, [...list, d]).map((p) => p.slug)).toEqual(['d']);
  });

  it('searches by family: เทพจีน / เทพพราหมณ์ / เทพอินเดีย (typos too)', () => {
    const gy: Place = { ...b, slug: 'gy', type: 'chinese-shrine', deities: ['เทพเจ้ากวนอู'] };
    const sh: Place = { ...b, slug: 'sh', type: 'chinese-shrine', deities: ['เจ้าพ่อพระกาฬ'] };
    const ga: Place = { ...b, slug: 'ga', type: 'devalai', deities: ['พระพิฆเนศ'] };
    const br: Place = { ...b, slug: 'br', type: 'temple', deities: ['ท้าวมหาพรหม'] };
    const all = [gy, sh, ga, br];
    // หมวดจีนนับทั้งเทพจีนและสถานที่ประเภทศาลเจ้าจีน
    expect(filterPlaces({ deity: 'family:chinese' }, all).map((p) => p.slug)).toEqual(['gy', 'sh']);
    expect(filterPlaces({ deity: 'family:hindu' }, all).map((p) => p.slug)).toEqual(['ga', 'br']);
    for (const q of ['เทพพราหมณ์', 'เทพพราหม์', 'เทพอินเดีย', 'ฮินดู']) {
      expect(deitySuggestions(all, q)[0]).toMatchObject({ slug: 'family:hindu', count: 2 });
      expect(filterPlaces({ deityText: q }, all).map((p) => p.slug)).toEqual(['ga', 'br']);
    }
    const chinese = deitySuggestions(all, 'เทพจีน');
    expect(chinese[0]).toMatchObject({ slug: 'family:chinese', count: 2 });
    expect(chinese.map((s) => s.label)).toContain('เทพเจ้ากวนอู');
    expect(deitySuggestions(all, '').slice(0, 2).map((s) => s.label)).toEqual(['เทพจีนทั้งหมด', 'เทพฮินดู / พราหมณ์ทั้งหมด']);
  });

  it('ignores an unknown deity slug', () => {
    expect(filterPlaces({ deity: 'nope' }, list)).toHaveLength(0);
  });
});

describe('helpers', () => {
  it('counts provinces and sorts them alphabetically', () => {
    expect(provincesWithPlaces(list)[0]).toEqual({ slug: 'bangkok', name: 'กรุงเทพมหานคร', count: 2 });
    const names = provincesWithPlaces([
      { ...c, slug: 'x', provinceSlug: 'phuket' },
      { ...c, slug: 'y', provinceSlug: 'chiang-mai' },
      { ...c, slug: 'z', provinceSlug: 'nakhon-ratchasima' },
    ]).map((p) => p.name);
    expect(names).toEqual(['เชียงใหม่', 'นครราชสีมา', 'ภูเก็ต']);
  });

  it('ranks related places: same province first, then shared goals', () => {
    expect(relatedPlaces(a, 4, list).map((p) => p.slug)).toEqual(['b', 'c']);
  });

  it('builds map links only with coordinates', () => {
    expect(mapLink(a)).toContain('query=13.7,100.5');
    expect(mapLink({ ...a, lat: null })).toBeNull();
    expect(mapLink({ ...a, mapsUrl: 'https://maps.example/x' })).toBe('https://maps.example/x');
  });

  it('builds Traveloka deeplinks through the Involve Asia base link', () => {
    const page = 'https://www.traveloka.com/th-th/hotel/thailand/landmark/wat-arun-123';
    const base = 'https://invl.me/abc';
    expect(bookingLink(page, null)).toBeNull();
    expect(bookingLink('https://example.com/x', base)).toBeNull();
    expect(bookingLink(page, base)).toBe(`${base}?url=${encodeURIComponent(page)}`);
    expect(lodgingLink({ ...c, travelokaUrl: page }, base)).toEqual({ href: `${base}?url=${encodeURIComponent(page)}`, near: true });
    expect(lodgingLink({ ...c, slug: 'no-such-place', provinceSlug: 'no-such-province' }, base)).toBeNull();
  });
});


describe('traveloka pages', () => {
  it('has a clean th-th page for every province and place entry', () => {
    const ok = /^https:\/\/www\.traveloka\.com\/th-th\/hotel\/[a-z-]+\/(landmark|area|city|region)\/[a-z0-9-]+-\d+$/;
    for (const p of [...Object.values(TRAVELOKA_PROVINCE), ...Object.values(TRAVELOKA_PLACE), ...Object.values(TRAVELOKA_ABROAD_CITY)])
      expect(p.url).toMatch(ok);
    expect(Object.keys(PROVINCES).filter((s) => !TRAVELOKA_PROVINCE[s])).toEqual([]);
  });
});

describe('featuredPlaces', () => {
  const img = [{ src: '/x.webp', alt: '', author: 'a', license: 'CC BY', sourceUrl: '' }];
  const mk = (slug: string, withImage: boolean, pinnedIn: string[] = []): Place => ({
    ...base,
    slug,
    provinceSlug: 'bangkok',
    goals: ['money'],
    deities: [],
    images: withImage ? img : [],
    pinnedIn,
  });
  it('ไม่เอาที่ไม่มีภาพ ปักหมุดหน้าแรกก่อน แล้วยอดนิยม แล้วที่เหลือตามลำดับเดิม', () => {
    const list = [mk('zzz', true), mk('erawan-shrine', true), mk('no-photo', false), mk('wat-khaek-silom', true), mk('mine', true, ['home'])];
    expect(featuredPlaces(list).map((p) => p.slug)).toEqual(['mine', 'erawan-shrine', 'wat-khaek-silom', 'zzz']);
  });
});

describe('city pillar shrines hub', () => {
  it('groups by province, Bangkok first, provincial seat first', () => {
    const mk = (slug: string, name: string, provinceSlug: string, district: string): Place => ({ ...a, slug, name, provinceSlug, district });
    const groups = cityPillarsByProvince([
      mk('x1', 'ศาลหลักเมืองกันทรลักษ์', 'si-sa-ket', 'กันทรลักษ์'),
      mk('x2', 'ศาลหลักเมืองศรีสะเกษ', 'si-sa-ket', 'เมืองศรีสะเกษ'),
      mk('x3', 'ศาลหลักเมืองกรุงเทพมหานคร', 'bangkok', 'เขตพระนคร'),
      mk('x4', 'วัดพระแก้ว', 'bangkok', 'เขตพระนคร'),
    ]);
    expect(groups.map((g) => g.slug)).toEqual(['bangkok', 'si-sa-ket']);
    expect(groups[0].places.map((p) => p.slug)).toEqual(['x3']);
    expect(groups[1].places.map((p) => p.slug)).toEqual(['x2', 'x1']);
  });
});
