import { z } from 'zod';
import { PLANET_COLOR, TAKSA_ORDER, type Planet } from '@/data/daily-colors';
import type { Product } from '@/data/products';
import { isoDate, noEmDash, notesField, parseImport, slugField, toNotes } from './common';

/** ลิงก์ affiliate ของ Shopee ไทย (ลิงก์หน้าสินค้าตรง ๆ ไม่นับยอดให้) */
const AFFILIATE_HOSTS = ['s.shopee.co.th', 'shope.ee'];
const BLOCKED_IMAGE_HOSTS = /(^|\.)(googleusercontent\.com|ggpht\.com|maps\.google\.com|maps\.gstatic\.com)$/;

/** "เขียว" / "สีเขียว" / "ครีม" -> ดาว + เฉด */
export function colorFromThai(input: string): { planet: Planet; shade?: string } | null {
  const name = input.trim().replace(/^สี/, '');
  for (const planet of TAKSA_ORDER) {
    const c = PLANET_COLOR[planet];
    if (c.name.replace(/^สี/, '') === name) return { planet };
    if (c.alt.includes(name)) return { planet, shade: name };
  }
  return null;
}

const colorNames = TAKSA_ORDER.flatMap((p) => [PLANET_COLOR[p].name.replace(/^สี/, ''), ...PLANET_COLOR[p].alt]);

export const productImportSchema = z.object({
  name: z.string().min(1),
  slug: slugField,
  brand: z.string().optional(),
  url: z
    .string()
    .url()
    .refine((u) => AFFILIATE_HOSTS.includes(new URL(u).hostname), 'ใช้ลิงก์ affiliate จากหน้า Shopee Affiliate (ขึ้นต้น https://s.shopee.co.th/)'),
  image: z.object({
    src: z
      .string()
      .min(1)
      .refine((s) => s.startsWith('/images/') || s.startsWith('https://'), 'รูปต้องเป็น https หรือไฟล์ในเว็บ /images/...')
      .refine((s) => !s.startsWith('https://') || !BLOCKED_IMAGE_HOSTS.test(new URL(s).hostname), 'ห้ามใช้รูปจาก Google'),
    alt: z.string().min(1, 'ต้องมี alt ภาษาไทย'),
  }),
  color: z
    .string()
    .optional()
    .refine((c) => c == null || colorFromThai(c) != null, `สีต้องเป็นหนึ่งใน: ${colorNames.join(' ')}`),
  checkedAt: isoDate,
  published: z.boolean().default(false),
  notes: notesField,
});

export type ProductImport = z.input<typeof productImportSchema>;

export function toProduct(v: z.output<typeof productImportSchema>): Product {
  const color = v.color ? colorFromThai(v.color) : null;
  return {
    slug: v.slug,
    name: noEmDash(v.name),
    brand: v.brand,
    url: v.url,
    image: { src: v.image.src, alt: v.image.alt },
    shirtColor: color?.planet,
    shade: color?.shade,
    checkedAt: v.checkedAt,
    published: v.published,
    notes: toNotes(v.notes),
  };
}

export function parseProductImport(text: string) {
  return parseImport(text, productImportSchema, toProduct);
}
