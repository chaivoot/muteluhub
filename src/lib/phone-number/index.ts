/**
 * เช็กเบอร์มงคล: หลักเดียวทั้งเว็บ (เจ้าของเลือก 2026-10-13: ผลรวม + คู่เลข)
 * - ผลรวม: บวกเลขทุกหลักของเบอร์
 * - คู่เลข: อ่านเลขติดกันทีละคู่ (เลื่อนทีละหลัก) ตั้งแต่หลักที่ PHONE_METHOD.pairsFrom
 * ความหมายคู่เลขและผลรวมอยู่ที่ src/data/phone-pairs.ts (รวบรวมจากหลายแหล่ง เป็นความเชื่อ)
 * คำนวณฝั่ง client เท่านั้น เบอร์ไม่ถูกส่งขึ้น server
 */
import { PHONE_METHOD_NOTES, PHONE_PAIRS, PHONE_SUMS, type PhoneMeaning } from '@/data/phone-pairs';
import type { GoalSlug } from '@/lib/goals';

export const PHONE_METHOD = {
  name: 'ผลรวม + คู่เลข',
  /** index ของหลักแรกที่เริ่มอ่านคู่ (1 = ข้ามเลข 0 ตัวแรก) */
  pairsFrom: 1,
  description:
    'บวกเลขทุกหลักของเบอร์เป็นผลรวม แล้วอ่านเลขที่ติดกันทีละคู่ (ไม่นับเลข 0 ตัวแรก) แต่ละคู่มีความหมายตามความเชื่อเรื่องเลขมงคลของไทย ความหมายรวบรวมจากหลายแหล่งที่ตรงกันเป็นส่วนใหญ่',
  notes: PHONE_METHOD_NOTES,
} as const;

/** แปลงสิ่งที่ผู้ใช้พิมพ์เป็นเลขล้วน รองรับ +66 / 66 นำหน้า ขีด เว้นวรรค */
export function normalizePhone(input: string): string {
  let d = input.replace(/\D/g, '');
  if (d.startsWith('66') && (d.length === 11 || d.length === 10)) d = `0${d.slice(2)}`;
  return d;
}

export type PhoneCheck = { ok: true; digits: string } | { ok: false; reason: 'empty' | 'short' | 'long' | 'prefix' };

/** เบอร์มือถือไทย 10 หลัก (06/08/09) หรือเบอร์บ้าน 9 หลัก (0X) */
export function checkPhone(input: string): PhoneCheck {
  const d = normalizePhone(input);
  if (!d) return { ok: false, reason: 'empty' };
  if (!d.startsWith('0')) return { ok: false, reason: 'prefix' };
  if (d.length < 9) return { ok: false, reason: 'short' };
  if (d.length > 10) return { ok: false, reason: 'long' };
  if (d.length === 10 && !/^0[689]/.test(d)) return { ok: false, reason: 'prefix' };
  return { ok: true, digits: d };
}

export interface PairResult extends PhoneMeaning {
  pair: string;
  /** ตำแหน่งหลักแรกของคู่ในเบอร์ (0-based) */
  index: number;
}

export interface PhoneResult {
  digits: string;
  sum: number;
  sumMeaning: PhoneMeaning | null;
  pairs: PairResult[];
  counts: { good: number; neutral: number; bad: number };
  /** เป้าหมายที่เบอร์นี้เด่น เรียงตามจำนวนคู่ดีที่ส่ง */
  strengths: { goal: GoalSlug; count: number }[];
  /** สำหรับเป้าหมายที่เลือก */
  goal: { slug: GoalSlug; support: PairResult[]; sumSupports: boolean } | null;
}

export function analyzePhone(digits: string, goal: GoalSlug | null = null): PhoneResult {
  const sum = digits.split('').reduce((s, c) => s + Number(c), 0);
  const pairs: PairResult[] = [];
  for (let i = PHONE_METHOD.pairsFrom; i < digits.length - 1; i++) {
    const pair = digits.slice(i, i + 2);
    pairs.push({ pair, index: i, ...PHONE_PAIRS[pair] });
  }
  const counts = { good: 0, neutral: 0, bad: 0 };
  for (const p of pairs) counts[p.level]++;

  const byGoal = new Map<GoalSlug, number>();
  for (const p of pairs) if (p.level === 'good') for (const g of p.goals) byGoal.set(g, (byGoal.get(g) ?? 0) + 1);
  const strengths = [...byGoal.entries()]
    .map(([g, count]) => ({ goal: g, count }))
    .sort((a, b) => b.count - a.count);

  const sumMeaning = PHONE_SUMS[sum] ?? null;
  return {
    digits,
    sum,
    sumMeaning,
    pairs,
    counts,
    strengths,
    goal: goal
      ? {
          slug: goal,
          support: pairs.filter((p) => p.level === 'good' && p.goals.includes(goal)),
          sumSupports: !!sumMeaning && sumMeaning.level === 'good' && sumMeaning.goals.includes(goal),
        }
      : null,
  };
}

/** คู่เลขดีที่ส่งเรื่องนั้น (ใช้แนะนำตอนหาเบอร์ใหม่) เรียงตามความเห็นตรงกันของแหล่ง */
export function goodPairsFor(goal: GoalSlug, limit = 8): string[] {
  const rank = { high: 0, medium: 1, low: 2 } as const;
  return Object.entries(PHONE_PAIRS)
    .filter(([, m]) => m.level === 'good' && m.goals.includes(goal))
    .sort(([, a], [, b]) => rank[a.agreement] - rank[b.agreement])
    .slice(0, limit)
    .map(([p]) => p);
}

/** แสดงเบอร์แบบเว้นวรรค 0XX XXX XXXX */
export const formatPhone = (d: string) =>
  d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
