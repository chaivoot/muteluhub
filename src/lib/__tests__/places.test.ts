import { describe, expect, it } from 'vitest';
import type { Place } from '@/data/places';
import { agodaLink } from '@/lib/agoda';
import { deitiesOf, deitySuggestions, featuredPlaces, filterPlaces, mapLink, provincesWithPlaces, relatedPlaces } from '@/lib/places';

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

describe('deity groups', () => {
  it('groups spelling variants of the same deity', () => {
    const variants = ['กวนอู', 'เทพเจ้ากวนอู', 'เจ้าพ่อกวนอู'].map((d, i) => ({ ...b, slug: `g${i}`, deities: [d] }));
    expect(filterPlaces({ deity: 'guan-yu', province: 'bangkok' }, [...list, ...variants])).toHaveLength(3);
    expect(deitiesOf(variants)).toEqual([expect.objectContaining({ slug: 'guan-yu', count: 3 })]);
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

  it('builds Agoda partner links from env CID, poi or province city', () => {
    expect(agodaLink(c, undefined)).toBeNull();
    expect(agodaLink({ ...c, agodaLinkOverride: 'https://example.com' }, undefined)).toBe('https://example.com');
    // ไม่มี poi: ค้นทั้งจังหวัด
    const city = new URL(agodaLink(c, '123')!);
    expect(city.origin + city.pathname).toBe('https://www.agoda.com/partners/partnersearch.aspx');
    expect(city.searchParams.get('cid')).toBe('123');
    expect(city.searchParams.get('city')).toBe('7401');
    expect(city.searchParams.get('poi')).toBeNull();
    // มี poi: ที่พักรอบสถานที่ ใช้ city ของ poi
    const near = new URL(agodaLink({ ...c, slug: 'chao-mae-soi-dok-mak-ayutthaya' }, '123')!);
    expect(near.searchParams.get('poi')).toBe('57001');
    expect(near.searchParams.get('city')).toBe('17704');
    expect(agodaLink(a, '1')).toContain('city=9395');
    expect(agodaLink({ ...c, country: 'JP', provinceSlug: undefined, city: 'เกียวโต' }, '1')).toContain('city=1784');
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
