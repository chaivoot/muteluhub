import { describe, expect, it } from 'vitest';
import type { FortuneTeller } from '@/data/fortune-tellers';
import { ALL_ART_FILES, artVariantFor, disciplineArtSvg, tellerArtPath } from '@/lib/art/discipline-art';
import { DISCIPLINES } from '@/lib/disciplines';
import { parseTellerImport } from '@/lib/import/teller-schema';
import { activeFilterCount, filterTellers, lineLabel, lineUrl, similarTellers, sortPinned, telUrl } from '@/lib/tellers';

// ข้อมูลทดสอบใช้ชื่อสมมติเท่านั้น (CLAUDE.md)
const base: FortuneTeller = {
  slug: 'x',
  name: 'หมอสมมติ',
  disciplines: ['tarot'],
  goals: ['love'],
  channels: ['online', 'line'],
  bio: '',
  contact: { line: '@x' },
  claimed: false,
  checkedAt: '2026-10-11',
  published: true,
  notes: [],
  sources: [],
};
const a: FortuneTeller = { ...base, slug: 'a', priceFrom: 300 };
const b: FortuneTeller = { ...base, slug: 'b', disciplines: ['palmistry'], goals: ['money'], channels: ['shop'], provinceSlug: 'chiang-mai', priceFrom: 1500 };
const c: FortuneTeller = { ...base, slug: 'c', disciplines: ['tarot', 'oracle'], goals: ['love', 'career'] };
const all = [a, b, c];

describe('filterTellers', () => {
  it('filters by every facet', () => {
    expect(filterTellers({ goal: 'love' }, all).map((t) => t.slug)).toEqual(['a', 'c']);
    expect(filterTellers({ discipline: 'oracle' }, all).map((t) => t.slug)).toEqual(['c']);
    expect(filterTellers({ channel: 'shop' }, all).map((t) => t.slug)).toEqual(['b']);
    expect(filterTellers({ province: 'chiang-mai' }, all).map((t) => t.slug)).toEqual(['b']);
    expect(filterTellers({ price: 'under-500' }, all).map((t) => t.slug)).toEqual(['a']);
    expect(filterTellers({ price: '1000-3000' }, all).map((t) => t.slug)).toEqual(['b']);
  });

  it('counts sheet filters only', () => {
    expect(activeFilterCount({ goal: 'love', channel: 'shop', price: 'under-500' })).toBe(2);
  });

  it('ranks similar tellers by shared discipline', () => {
    expect(similarTellers(a, all).map((t) => t.slug)).toEqual(['c']);
  });
});

describe('contact links', () => {
  it('builds LINE links for official and personal IDs', () => {
    expect(lineUrl('@shop')).toBe('https://line.me/R/ti/p/%40shop');
    expect(lineUrl('someone')).toBe('https://line.me/ti/p/~someone');
    expect(lineLabel('https://lin.ee/nHOSTTx')).toBe('แอด LINE');
    expect(lineLabel('https://line.me/R/ti/p/%40shop')).toBe('LINE @shop');
    expect(lineLabel('@shop')).toBe('LINE @shop');
    expect(lineUrl('https://lin.ee/abc')).toBe('https://lin.ee/abc');
    expect(telUrl('081-234-5678')).toBe('tel:0812345678');
  });
});

describe('discipline art', () => {
  it('has 3 variants for every discipline and a stable pick per teller', () => {
    expect(ALL_ART_FILES).toHaveLength(DISCIPLINES.length * 3);
    expect(artVariantFor('abc')).toBe(artVariantFor('abc'));
    expect(tellerArtPath(c)).toMatch(/^\/art\/tarot-[0-2]\.svg$/);
    expect(disciplineArtSvg('tarot', 0)).toContain('<svg');
  });

  it('spreads tellers across variants', () => {
    const seen = new Set(Array.from({ length: 30 }, (_, i) => artVariantFor(`teller-${i}`)));
    expect(seen.size).toBe(3);
  });
});

const valid = {
  name: 'หมอทดสอบ (สมมติ)',
  slug: 'mor-test',
  disciplines: ['tarot', 'oracle'],
  goals: ['love'],
  channels: ['online', 'line'],
  description: 'ดูไพ่ออนไลน์ — ทาง LINE',
  line: '@mortest',
  priceFrom: 299,
  published: false,
  checkedAt: '2026-10-11',
  notes: ['ยังไม่ได้เช็กราคาล่าสุด'],
  sources: ['https://example.com/mortest'],
};

describe('parseTellerImport', () => {
  it('converts the owner format', () => {
    const r = parseTellerImport(JSON.stringify([valid]));
    expect(r.items[0].ok).toBe(true);
    expect(r.items[0].item).toMatchObject({
      slug: 'mor-test',
      contact: { line: '@mortest' },
      bio: 'ดูไพ่ออนไลน์ - ทาง LINE',
      provinceSlug: undefined,
      priceFrom: 299,
      claimed: false,
    });
  });

  it('enforces disciplines, contact and channel rules', () => {
    const r = parseTellerImport(
      JSON.stringify([
        { ...valid, slug: 'tarot' },
        { ...valid, disciplines: ['astro-magic'] },
        { ...valid, line: undefined },
        { ...valid, channels: ['shop'] },
        { ...valid, channels: ['phone'], line: undefined, facebook: 'https://facebook.com/x' },
      ]),
    );
    expect(r.items.map((i) => i.ok)).toEqual([false, false, false, false, false]);
    expect(r.items[0].errors.join()).toMatch(/ศาสตร์/);
    expect(r.items[1].errors.join()).toMatch(/astro-magic/);
    expect(r.items[2].errors.join()).toMatch(/ติดต่อ|LINE/);
    expect(r.items[3].errors.join()).toMatch(/จังหวัด/);
    expect(r.items[4].errors.join()).toMatch(/phone/);
  });
});

describe('sortPinned', () => {
  it('puts tellers pinned in the given category first and keeps order', () => {
    const t = (slug: string, pinnedIn?: string[]) => ({ slug, pinnedIn }) as unknown as FortuneTeller;
    const list = [t('a'), t('b', ['tarot']), t('c', ['all']), t('d', ['tarot', 'all'])];
    expect(sortPinned(list, 'tarot').map((x) => x.slug)).toEqual(['b', 'd', 'a', 'c']);
    expect(sortPinned(list, 'all').map((x) => x.slug)).toEqual(['c', 'd', 'a', 'b']);
    expect(sortPinned(list, 'palmistry').map((x) => x.slug)).toEqual(['a', 'b', 'c', 'd']);
  });
});
