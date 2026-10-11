import { z } from 'zod';
import { PROVINCES, provinceSlugFromThai } from '@/data/provinces';
import { GOALS, type GoalSlug } from '@/lib/goals';

export const GOAL_SLUGS = GOALS.map((g) => g.slug) as [GoalSlug, ...GoalSlug[]];
export const stringList = z.array(z.string().min(1)).default([]);
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ต้องเป็น YYYY-MM-DD');
export const notesField = z.union([z.string(), z.array(z.string())]).optional();
export const slugField = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug ใช้ a-z 0-9 และ - เท่านั้น');

export const toNotes = (n: string | string[] | undefined): string[] => (n == null ? [] : Array.isArray(n) ? n : [n]);

/** ข้อความในเว็บ: ไม่ใช้ em dash */
export const noEmDash = (s: string) => s.replace(/\s*—\s*/g, ' - ');

/** ตรวจ province / provinceSlug แล้วคืน slug (undefined = ไม่ได้ระบุ) */
export function checkProvince(
  v: { province?: string; provinceSlug?: string },
  ctx: z.RefinementCtx,
): void {
  if (v.provinceSlug && !PROVINCES[v.provinceSlug]) ctx.addIssue({ code: 'custom', message: `ไม่รู้จัก provinceSlug "${v.provinceSlug}"` });
  if (!v.provinceSlug && v.province && !provinceSlugFromThai(v.province))
    ctx.addIssue({ code: 'custom', message: `ไม่รู้จักจังหวัด "${v.province}"` });
}

export const resolveProvince = (v: { province?: string; provinceSlug?: string }) =>
  v.provinceSlug ?? (v.province ? provinceSlugFromThai(v.province) : undefined);

export interface ImportItemResult<T> {
  index: number;
  slug?: string;
  name?: string;
  ok: boolean;
  errors: string[];
  item?: T;
}

export interface ParseResult<T> {
  error?: string;
  items: ImportItemResult<T>[];
}

const MAX_ITEMS = 500;

/** แปลงข้อความ JSON ที่วางมา: รับได้ทั้ง array และ object เดี่ยว ตรวจทุกรายการ */
export function parseImport<S extends z.ZodTypeAny, T extends { slug: string }>(
  text: string,
  schema: S,
  convert: (v: z.output<S>) => T,
): ParseResult<T> {
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
  const items = list.map((entry, index): ImportItemResult<T> => {
    const rawObj = (entry ?? {}) as Record<string, unknown>;
    const base = {
      index,
      slug: typeof rawObj.slug === 'string' ? rawObj.slug : undefined,
      name: typeof rawObj.name === 'string' ? rawObj.name : undefined,
    };
    const r = schema.safeParse(entry);
    if (!r.success) {
      return {
        ...base,
        ok: false,
        errors: r.error.issues.map((i) => (i.path.length ? `${i.path.join('.')}: ${i.message}` : i.message)),
      };
    }
    const item = convert(r.data);
    if (seen.has(item.slug)) return { ...base, ok: false, errors: [`slug "${item.slug}" ซ้ำในชุดที่วาง`] };
    seen.add(item.slug);
    return { ...base, ok: true, errors: [], item };
  });
  return { items };
}
