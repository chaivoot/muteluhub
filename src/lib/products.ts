import type { Planet } from '@/data/daily-colors';
import type { Product, ShirtOffer } from '@/data/products';

/** เลือกเสื้อสีละ 1 ตัว: สีหลักก่อนเฉดรอง แล้วเรียงตาม slug ให้ผลคงที่ */
export function shirtOffers(products: Product[]): Partial<Record<Planet, ShirtOffer>> {
  const out: Partial<Record<Planet, ShirtOffer>> = {};
  const sorted = products
    .filter((p) => p.shirtColor)
    .sort((a, b) => Number(!!a.shade) - Number(!!b.shade) || a.slug.localeCompare(b.slug));
  for (const p of sorted) {
    const key = p.shirtColor!;
    if (!out[key]) out[key] = { slug: p.slug, name: p.name, url: p.url, image: p.image };
  }
  return out;
}
