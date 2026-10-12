import { describe, expect, it } from 'vitest';
import type { Place } from '@/data/places';
import { agodaLink, showsLodging } from '@/lib/agoda';
import { deitiesOf, deitySuggestions, filterPlaces, mapLink, provincesWithPlaces, relatedPlaces } from '@/lib/places';

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

  it('only uses Agoda overrides and only outside Bangkok', () => {
    expect(agodaLink(c)).toBeNull();
    expect(agodaLink({ ...c, agodaLinkOverride: 'https://example.com' })).toBe('https://example.com');
    expect(showsLodging(a)).toBe(false);
    expect(showsLodging(c)).toBe(true);
  });
});

