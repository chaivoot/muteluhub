import { z } from 'zod';
import { CHANNELS, type Channel, type FortuneTeller } from '@/data/fortune-tellers';
import { PROVINCES } from '@/data/provinces';
import { DISCIPLINES } from '@/lib/disciplines';
import {
  checkProvince,
  GOAL_SLUGS,
  isoDate,
  noEmDash,
  notesField,
  parseImport,
  resolveProvince,
  slugField,
  toNotes,
} from './common';

/**
 * รูปแบบ JSON สำหรับนำเข้าหมอดู (วางที่ /admin/import เลือก "หมอดู")
 * ช่องติดต่อวางระดับบนสุดแบบ directory อื่นของเจ้าของ (phone, line, facebook, ...)
 * เอกสาร: docs/import-format.md
 */
const DISCIPLINE_SLUGS = new Set(DISCIPLINES.map((d) => d.slug));
const CONTACT_KEYS = ['phone', 'line', 'facebook', 'instagram', 'tiktok', 'youtube', 'website'] as const;

const url = z.string().url();

export const tellerImportSchema = z
  .object({
    name: z.string().min(1),
    slug: slugField
      .refine((s) => !DISCIPLINE_SLUGS.has(s), 'slug ซ้ำกับชื่อศาสตร์')
      .refine((s) => !(s in PROVINCES), 'slug ซ้ำกับชื่อจังหวัด'),
    disciplines: z
      .array(z.string().refine((s) => DISCIPLINE_SLUGS.has(s), (s) => ({ message: `ไม่รู้จักศาสตร์ "${s}"` })))
      .min(1, 'ต้องมีศาสตร์อย่างน้อย 1 (ตัวแรกคือศาสตร์หลัก)'),
    goals: z.array(z.enum(GOAL_SLUGS)).min(1, 'ต้องมีเป้าหมายอย่างน้อย 1'),
    channels: z.array(z.enum(CHANNELS as [Channel, ...Channel[]])).min(1, 'ต้องมีช่องทางอย่างน้อย 1'),
    province: z.string().optional(),
    provinceSlug: z.string().optional(),
    district: z.string().optional(),
    description: z.string().min(1),
    hours: z.string().optional(),
    priceFrom: z.number().nonnegative().nullable().optional(),
    priceNote: z.string().optional(),
    phone: z.string().optional(),
    line: z.string().optional(),
    facebook: url.optional(),
    instagram: url.optional(),
    tiktok: url.optional(),
    youtube: url.optional(),
    website: url.optional(),
    mapsUrl: url.optional(),
    claimed: z.boolean().default(false),
    published: z.boolean().default(false),
    checkedAt: isoDate,
    notes: notesField,
    sources: z.array(url).min(1, 'ต้องมีแหล่งอ้างอิงอย่างน้อย 1'),
  })
  .superRefine((v, ctx) => {
    checkProvince(v, ctx);
    if (v.channels.includes('shop') && !v.province && !v.provinceSlug)
      ctx.addIssue({ code: 'custom', message: 'มีหน้าร้านต้องระบุจังหวัด' });
    if (!CONTACT_KEYS.some((k) => v[k]))
      ctx.addIssue({ code: 'custom', message: 'ต้องมีช่องทางติดต่ออย่างน้อย 1 (phone, line, facebook, ...)' });
    if (v.channels.includes('line') && !v.line) ctx.addIssue({ code: 'custom', message: 'ช่องทาง LINE ต้องใส่ line' });
    if (v.channels.includes('phone') && !v.phone) ctx.addIssue({ code: 'custom', message: 'ช่องทางโทรต้องใส่ phone' });
  });

export function toTeller(v: z.output<typeof tellerImportSchema>): FortuneTeller {
  const contact = Object.fromEntries(CONTACT_KEYS.filter((k) => v[k]).map((k) => [k, v[k]]));
  return {
    slug: v.slug,
    name: v.name,
    disciplines: [...new Set(v.disciplines)],
    goals: [...new Set(v.goals)],
    channels: [...new Set(v.channels)],
    provinceSlug: resolveProvince(v),
    district: v.district,
    bio: noEmDash(v.description),
    hours: v.hours,
    priceFrom: v.priceFrom ?? undefined,
    priceNote: v.priceNote,
    contact,
    mapsUrl: v.mapsUrl,
    claimed: v.claimed,
    checkedAt: v.checkedAt,
    published: v.published,
    notes: toNotes(v.notes),
    sources: v.sources,
  };
}

export function parseTellerImport(text: string) {
  return parseImport(text, tellerImportSchema, toTeller);
}
