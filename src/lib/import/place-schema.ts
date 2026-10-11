import { z } from 'zod';
import type { Place } from '@/data/places';
import { PROVINCES, provinceSlugFromThai } from '@/data/provinces';
import { GOALS, type GoalSlug } from '@/lib/goals';

/**
 * รูปแบบ JSON สำหรับนำเข้าสถานที่ (วางที่ /admin/import)
 * ตามแบบ directory อื่นของเจ้าของ: name, slug, province, district, coords, mapsUrl,
 * description, hours, published, checkedAt, notes, sources + ช่องเฉพาะสายมู
 * เอกสาร: docs/import-format.md
 */
const GOAL_SLUGS = GOALS.map((g) => g.slug) as [GoalSlug, ...GoalSlug[]];

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

const stringList = z.array(z.string().min(1)).default([]);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ต้องเป็น YYYY-MM-DD');

export const placeImportSchema = z
  .object({
    name: z.string().min(1),
    nameEn: z.string().optional(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug ใช้ a-z 0-9 และ - เท่านั้น')
      .refine((s) => !(s in PROVINCES), 'slug ซ้ำกับชื่อจังหวัด'),
    type: z.enum(['temple', 'shrine', 'devalai', 'chinese-shrine']),
    deities: z.array(z.string().min(1)).min(1, 'ต้องมีองค์เทพอย่างน้อย 1'),
    goals: z.array(z.enum(GOAL_SLUGS)).min(1, 'ต้องมีเป้าหมายอย่างน้อย 1'),
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
    notes: z.union([z.string(), z.array(z.string())]).optional(),
    sources: z.array(z.string().url()).min(1, 'ต้องมีแหล่งอ้างอิงอย่างน้อย 1'),
  })
  .superRefine((v, ctx) => {
    if (!v.provinceSlug && !v.province) ctx.addIssue({ code: 'custom', message: 'ต้องมี province หรือ provinceSlug' });
    if (v.provinceSlug && !PROVINCES[v.provinceSlug]) ctx.addIssue({ code: 'custom', message: `ไม่รู้จัก provinceSlug "${v.provinceSlug}"` });
    if (!v.provinceSlug && v.province && !provinceSlugFromThai(v.province))
      ctx.addIssue({ code: 'custom', message: `ไม่รู้จักจังหวัด "${v.province}"` });
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
    country: 'TH',
    provinceSlug: v.provinceSlug ?? provinceSlugFromThai(v.province ?? '')!,
    district: v.district,
    lat: lat == null ? null : round(lat),
    lng: lng == null ? null : round(lng),
    openingHours: v.hours ?? null,
    // กติกาข้อความในเว็บ: ไม่ใช้ em dash
    summary: v.description.replace(/\s*—\s*/g, ' - '),
    offerings: v.offerings,
    howToPray: v.howToPray,
    howToRepayVow: v.howToRepayVow,
    images: v.images,
    sources: v.sources,
    agodaLinkOverride: v.agodaLinkOverride,
    mapsUrl: v.mapsUrl,
    checkedAt: v.checkedAt,
    published: v.published,
    notes: v.notes == null ? [] : Array.isArray(v.notes) ? v.notes : [v.notes],
  };
}

export interface ImportItemResult {
  index: number;
  slug?: string;
  name?: string;
  ok: boolean;
  errors: string[];
  place?: Place;
}

export interface ParseResult {
  error?: string;
  items: ImportItemResult[];
}

const MAX_ITEMS = 500;

/** แปลงข้อความ JSON ที่วางมา: รับได้ทั้ง array และ object เดี่ยว */
export function parsePlaceImport(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (err) {
    return { error: `JSON ไม่ถูกต้อง: ${(err as Error).message}`, items: [] };
  }
  const list = Array.isArray(raw) ? raw : [raw];
  if (list.length === 0) return { error: 'ไม่มีข้อมูล', items: [] };
  if (list.length > MAX_ITEMS) return { error: `นำเข้าได้ครั้งละไม่เกิน ${MAX_ITEMS} รายการ`, items: [] };

  const seen = new Set<string>();
  const items = list.map((entry, index): ImportItemResult => {
    const r = placeImportSchema.safeParse(entry);
    const rawObj = (entry ?? {}) as Record<string, unknown>;
    const base = {
      index,
      slug: typeof rawObj.slug === 'string' ? rawObj.slug : undefined,
      name: typeof rawObj.name === 'string' ? rawObj.name : undefined,
    };
    if (!r.success) {
      return {
        ...base,
        ok: false,
        errors: r.error.issues.map((i) => (i.path.length ? `${i.path.join('.')}: ${i.message}` : i.message)),
      };
    }
    if (seen.has(r.data.slug)) return { ...base, ok: false, errors: [`slug "${r.data.slug}" ซ้ำในชุดที่วาง`] };
    seen.add(r.data.slug);
    return { ...base, ok: true, errors: [], place: toPlace(r.data) };
  });
  return { items };
}
