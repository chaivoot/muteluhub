import { describe, expect, it } from 'vitest';
import { parseCoords, parsePlaceImport } from '@/lib/import/place-schema';

const valid = {
  name: 'ศาลทดสอบ',
  slug: 'test-shrine',
  type: 'shrine',
  deities: ['ท้าวมหาพรหม'],
  goals: ['money', 'love'],
  province: 'กรุงเทพมหานคร',
  district: 'เขตปทุมวัน',
  coords: '13.7441312, 100.5409123',
  description: 'คำอธิบาย — มี em dash',
  hours: 'ทุกวัน 06.00-22.00 น.',
  images: [
    {
      src: 'https://upload.wikimedia.org/a.jpg',
      alt: 'ภาพศาล',
      author: 'Someone',
      license: 'CC BY 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:A.jpg',
    },
  ],
  published: false,
  checkedAt: '2026-10-11',
  notes: 'บันทึกภายใน',
  sources: ['https://th.wikipedia.org/wiki/x'],
};

describe('parsePlaceImport', () => {
  it('converts the owner format into a Place', () => {
    const r = parsePlaceImport(JSON.stringify([valid]));
    expect(r.error).toBeUndefined();
    const item = r.items[0];
    expect(item.ok).toBe(true);
    expect(item.item).toMatchObject({
      slug: 'test-shrine',
      provinceSlug: 'bangkok',
      lat: 13.74413,
      lng: 100.54091,
      openingHours: 'ทุกวัน 06.00-22.00 น.',
      summary: 'คำอธิบาย - มี em dash',
      offerings: [],
      published: false,
      notes: ['บันทึกภายใน'],
    });
  });

  it('accepts a single object and provinceSlug', () => {
    const { province, ...rest } = valid;
    void province;
    const r = parsePlaceImport(JSON.stringify({ ...rest, provinceSlug: 'chiang-mai' }));
    expect(r.items[0].item?.provinceSlug).toBe('chiang-mai');
  });

  it('reports every problem per item', () => {
    const r = parsePlaceImport(
      JSON.stringify([
        { ...valid, slug: 'Bad Slug', goals: ['luck'], sources: [] },
        { ...valid, slug: 'bangkok' },
        { ...valid, province: 'แอตแลนติส' },
      ]),
    );
    expect(r.items.map((i) => i.ok)).toEqual([false, false, false]);
    expect(r.items[0].errors.join(' ')).toMatch(/slug/);
    expect(r.items[0].errors.join(' ')).toMatch(/goals/);
    expect(r.items[0].errors.join(' ')).toMatch(/แหล่งอ้างอิง/);
    expect(r.items[1].errors.join(' ')).toMatch(/จังหวัด/);
    expect(r.items[2].errors.join(' ')).toMatch(/แอตแลนติส/);
  });

  it('blocks Google Maps images and missing credits', () => {
    const r = parsePlaceImport(
      JSON.stringify({
        ...valid,
        images: [{ ...valid.images[0], src: 'https://lh3.googleusercontent.com/p/abc', author: '' }],
      }),
    );
    expect(r.items[0].ok).toBe(false);
    expect(r.items[0].errors.join(' ')).toMatch(/Google Maps/);
    expect(r.items[0].errors.join(' ')).toMatch(/เจ้าของภาพ/);
  });

  it('rejects duplicate slugs in one paste and bad JSON', () => {
    expect(parsePlaceImport(JSON.stringify([valid, valid])).items[1].ok).toBe(false);
    expect(parsePlaceImport('{oops').error).toMatch(/JSON/);
    expect(parsePlaceImport('[]').error).toBeDefined();
  });
});

describe('parseCoords', () => {
  it('parses "lat, lng"', () => {
    expect(parseCoords('13.7698911, 100.7219096')).toEqual({ lat: 13.7698911, lng: 100.7219096 });
    expect(parseCoords('abc')).toBeNull();
    expect(parseCoords('100, 200')).toBeNull();
  });
});
