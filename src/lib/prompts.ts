import { PROMPT_TEMPLATES, type PromptField, type PromptTemplate } from '@/data/prompt-templates';
import { DISCIPLINES } from '@/lib/disciplines';
import { GOALS, getGoal, isGoalSlug, type GoalSlug } from '@/lib/goals';

/** ต่อท้ายทุก prompt เสมอ (addendum 01 ข้อ 5) เก็บไว้ที่เดียว ห้ามใส่ซ้ำใน template */
export const GUARD_BLOCK = `ข้อกำหนดในการตอบ:
- ใช้เฉพาะข้อมูลที่ฉันให้ ถ้าต้องใช้ข้อมูลที่ไม่มี เช่น ตำแหน่งดาวที่ไม่ได้ให้มา ให้บอกตรง ๆ ว่าไม่มีข้อมูล ห้ามเดา
- แยกให้ชัดว่าส่วนไหนคือหลักของศาสตร์ ส่วนไหนคือการตีความ
- ไม่ทำนายเรื่องโรคหรือการรักษา ถ้าเกี่ยวกับสุขภาพให้แนะนำปรึกษาแพทย์
- ไม่แนะนำการลงทุน หุ้น หรือการพนันแบบเจาะจง
- ตอบเป็นภาษาไทย อ่านง่าย ปิดท้ายด้วยสิ่งที่ลงมือทำได้จริง 2-3 ข้อ`;

export type PromptValues = Record<string, string>;

const PLACEHOLDER = /\{\{(\w+)\}\}/g;

/** key ทั้งหมดที่ template ใช้ */
export function placeholderKeys(template: string): string[] {
  return [...new Set([...template.matchAll(PLACEHOLDER)].map((m) => m[1]))];
}

/**
 * ประกอบ prompt ฝั่ง client เท่านั้น (ห้ามส่งข้อมูลผู้ใช้ขึ้น server)
 * ช่องที่ยังไม่กรอกแสดงเป็น [label] ให้ผู้ใช้เห็นว่ายังขาดอะไร
 */
export function renderPrompt(t: PromptTemplate, values: PromptValues): string {
  const labels = new Map(t.requiredFields.map((f) => [f.key, f.label]));
  const body = t.template.replace(PLACEHOLDER, (_, key: string) => {
    const value = displayValue(key, values[key] ?? '').trim();
    return value || `[${labels.get(key) ?? key}]`;
  });
  return `${body}\n\n${GUARD_BLOCK}`;
}

/** แปลงค่าที่เก็บในฟอร์มเป็นข้อความใน prompt (เช่น slug เป้าหมาย -> ชื่อไทย) */
function displayValue(key: string, value: string): string {
  if (key === 'goal' && isGoalSlug(value)) return getGoal(value).name;
  if (key === 'discipline') return DISCIPLINES.find((d) => d.slug === value)?.name ?? value;
  if (key === 'birth_date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return formatBirthDate(value);
  return value;
}

const MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

function formatBirthDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y + 543}`;
}

export function missingFields(t: PromptTemplate, values: PromptValues): PromptField[] {
  return t.requiredFields.filter((f) => !(values[f.key] ?? '').trim());
}

/** ตัวเลือกของช่อง select ที่ดึงจาก taxonomy */
export function fieldOptions(field: PromptField): { value: string; label: string }[] {
  if (field.key === 'goal') return GOALS.map((g) => ({ value: g.slug, label: g.name }));
  if (field.key === 'discipline') return DISCIPLINES.map((d) => ({ value: d.slug, label: d.name }));
  return (field.options ?? []).map((o) => ({ value: o, label: o }));
}

/** ค่าที่เติมมาจากภายนอก (query string / handoff) รับเฉพาะ key ที่ template ประกาศไว้ */
export function valuesFromRecord(t: PromptTemplate, source: Record<string, unknown>): PromptValues {
  const values: PromptValues = {};
  for (const f of t.requiredFields) {
    const v = source[f.key];
    if (typeof v === 'string' && v) values[f.key] = v.slice(0, 2000);
  }
  return values;
}

export function valuesFromParams(t: PromptTemplate, params: URLSearchParams): PromptValues {
  return valuesFromRecord(t, Object.fromEntries(params));
}

export const sortedTemplates = (list: PromptTemplate[] = PROMPT_TEMPLATES) =>
  list.slice().sort((a, b) => a.sortOrder - b.sortOrder);

export function getPromptTemplate(slug: string): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.slug === slug);
}

export function filterTemplates(
  opts: { goal?: GoalSlug | null; discipline?: string | null },
  list: PromptTemplate[] = PROMPT_TEMPLATES,
): PromptTemplate[] {
  return sortedTemplates(list).filter(
    (t) =>
      (!opts.goal || t.goals.includes(opts.goal)) &&
      // 'general' = เฉพาะ prompt ทั่วไป (ไม่ผูกศาสตร์)
      (!opts.discipline || (opts.discipline === 'general' ? t.discipline === null : t.discipline === opts.discipline)),
  );
}

/** prompt แนะนำสำหรับ landing เป้าหมาย: เจาะจงเป้าหมายก่อน แล้วค่อย featured ทั่วไป */
export function recommendedForGoal(goal: GoalSlug, limit = 3): PromptTemplate[] {
  return filterTemplates({ goal })
    .sort((a, b) => a.goals.length - b.goals.length || Number(b.isFeatured) - Number(a.isFeatured))
    .slice(0, limit);
}
