import { describe, expect, it } from 'vitest';
import type { Place } from '@/data/places';
import { agodaLink, showsLodging } from '@/lib/agoda';
import { filterPlaces, mapLink, provincesWithPlaces, relatedPlaces } from '@/lib/places';

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
    expect(filterPlaces({ deity: 'เจ้าพ่อเสือ' }, list).map((p) => p.slug)).toEqual(['b']);
    expect(filterPlaces({}, list)).toHaveLength(3);
  });
});

describe('helpers', () => {
  it('counts provinces', () => {
    expect(provincesWithPlaces(list)[0]).toEqual({ slug: 'bangkok', name: 'กรุงเทพมหานคร', count: 2 });
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

