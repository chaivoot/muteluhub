import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parsePlaceImport } from '@/lib/import/place-schema';
import { parseProductImport } from '@/lib/import/product-schema';
import { parseTellerImport } from '@/lib/import/teller-schema';
import { SEED_BATCHES } from '@/lib/seed-batches';

// ชุดข้อมูลใน repo ต้องนำเข้าได้ทั้งหมด (หลังบ้านไม่นำเข้าบางส่วน)
describe('seed batches', () => {
  it.each(SEED_BATCHES.map((b) => [b.id, b] as const))('%s parses cleanly', (_, batch) => {
    const text = JSON.stringify(batch.data);
    const parse = { places: parsePlaceImport, fortune_tellers: parseTellerImport, products: parseProductImport }[batch.kind];
    const r = parse(text);
    expect(r.error).toBeUndefined();
    expect(r.items.filter((i) => !i.ok).map((i) => `${i.slug}: ${i.errors.join('; ')}`)).toEqual([]);
  });

  it('points every product image at a file in public/', () => {
    const missing = SEED_BATCHES.filter((b) => b.kind === 'products')
      .flatMap((b) => b.data as { image: { src: string } }[])
      .map((p) => p.image.src)
      .filter((src) => src.startsWith('/') && !existsSync(join('public', src)));
    expect(missing).toEqual([]);
  });

  it('has no slug shared between place batches', () => {
    const slugs = SEED_BATCHES.filter((b) => b.kind === 'places').flatMap((b) => (b.data as { slug: string }[]).map((x) => x.slug));
    expect(slugs.length).toBe(new Set(slugs).size);
  });
});
