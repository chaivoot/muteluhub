import { z } from 'zod';
import type { Place } from '@/data/places';
import { countryByCode } from '@/data/countries';
import { PROVINCES } from '@/data/provinces';
import { checkProvince, GOAL_SLUGS, isoDate, noEmDash, notesField, parseImport, resolveProvince, slugField, stringList, toNotes } from './common';

/**
 * รูปแบบ JSON สำหรับนำเข้าสถานที่ (วางที่ /admin/import)
 * ตามแบบ directory อื่นของเจ้าของ: name, slug, province, district, coords, mapsUrl,
 * description, hours, published, checkedAt, notes, sources + ช่องเฉพาะสายมู
 * เอกสาร: docs/import-format.md
 */

// ห้ามรูปจาก Google Maps / Google user content (spec ข้อ 3.2)
const BLOCKED_IMAGE_HOSTS = /(^|\.)(googleusercontent\.com|ggpht\.com|maps\.googleapis\.com|gstatic\.com|google\.[a-z.]+)$/i;

const imageSchema = z.object({
  src: z
    .string()
    .url()
    .refine((u) => u.startsWith('https://'), 'รูปต้องเป็น https')
    .refine((u) => !BLOCKED_IMAGE_HOSTS.test(new URL(u).hostname), 'ห้ามใช้รูปจาก Google Maps'),
  alt: z.string().min(1, 'ต้องมี alt ภาษาไทย'),
  author: z.string().min(1, 'ต้องมีชื่อเจ้าของภาพ'),
  license: z.string().min(1, 'ต้องระบุ license'),
  sourceUrl: z.string().url('ต้องมีลิงก์หน้าต้นฉบับของภาพ'),
});


export const placeImportSchema = z
  .object({
    name: z.string().min(1),
    nameEn: z.string().optional(),
    slug: slugField.refine((s) => !(s in PROVINCES), 'slug ซ้ำกับชื่อจังหวัด'),
    type: z.enum(['temple', 'shrine', 'devalai', 'chinese-shrine']),
    deities: z.array(z.string().min(1)).min(1, 'ต้องมีองค์เทพอย่างน้อย 1'),
    goals: z.array(z.enum(GOAL_SLUGS)).min(1, 'ต้องมีเป้าหมายอย่างน้อย 1'),
    /** ISO 3166-1 ค่าเริ่มต้น TH */
    country: z.string().default('TH'),
    city: z.string().optional(),
    province: z.string().optional(),
    provinceSlug: z.string().optional(),
    district: z.string().optional(),
    coords: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    mapsUrl: z.string().url().optional(),
    description: z.string().min(1),
    hours: z.string().nullable().optional(),
    offerings: stringList,
    howToPray: stringList,
    howToRepayVow: stringList,
    images: z.array(imageSchema).default([]),
    agodaLinkOverride: z.string().url().optional(),
    published: z.boolean().default(false),
    checkedAt: isoDate,
    notes: notesField,
    sources: z.array(z.string().url()).min(1, 'ต้องมีแหล่งอ้างอิงอย่างน้อย 1'),
  })
  .superRefine((v, ctx) => {
    if (v.country === 'TH') {
      if (!v.provinceSlug && !v.province) ctx.addIssue({ code: 'custom', message: 'ต้องมี province หรือ provinceSlug' });
      checkProvince(v, ctx);
    } else {
      if (!countryByCode(v.country)) ctx.addIssue({ code: 'custom', message: `ยังไม่รองรับประเทศ "${v.country}" (เพิ่มใน src/data/countries.ts)` });
      if (!v.city) ctx.addIssue({ code: 'custom', message: 'สถานที่ต่างประเทศต้องมี city' });
    }
    if (v.coords && !parseCoords(v.coords)) ctx.addIssue({ code: 'custom', message: 'coords ต้องเป็น "lat, lng"' });
  });

export type PlaceImport = z.input<typeof placeImportSchema>;

export function parseCoords(coords: string): { lat: number; lng: number } | null {
  const m = coords.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

const round = (n: number) => Math.round(n * 1e5) / 1e5;

export function toPlace(v: z.output<typeof placeImportSchema>): Place {
  const coords = v.coords ? parseCoords(v.coords) : null;
  const lat = coords?.lat ?? v.lat ?? null;
  const lng = coords?.lng ?? v.lng ?? null;
  return {
    slug: v.slug,
    name: v.name,
    nameEn: v.nameEn,
    type: v.type,
    deities: v.deities,
    goals: [...new Set(v.goals)],
    country: v.country,
    provinceSlug: v.country === 'TH' ? resolveProvince(v) : undefined,
    city: v.country === 'TH' ? undefined : v.city,
    district: v.district,
    lat: lat == null ? null : round(lat),
    lng: lng == null ? null : round(lng),
    openingHours: v.hours ?? null,
    summary: noEmDash(v.description),
    offerings: v.offerings,
    howToPray: v.howToPray,
    howToRepayVow: v.howToRepayVow,
    images: v.images,
    sources: v.sources,
    agodaLinkOverride: v.agodaLinkOverride,
    mapsUrl: v.mapsUrl,
    checkedAt: v.checkedAt,
    published: v.published,
    notes: toNotes(v.notes),
  };
}

export function parsePlaceImport(text: string) {
  return parseImport(text, placeImportSchema, toPlace);
}
