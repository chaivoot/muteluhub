/**
 * คู่เลขแนะนำตามพื้นดวง: ใช้ทักษาจากวันเกิด (หลักเดียวกับสีเสื้อมงคล src/data/daily-colors.ts)
 * - เลขประจำดาว: อาทิตย์ 1 จันทร์ 2 อังคาร 3 พุธ 4 พฤหัสบดี 5 ศุกร์ 6 เสาร์ 7 ราหู 8
 * - เลขเสริมเรื่องที่เลือก = เลขของดาวในตำแหน่งทักษาที่จับคู่กับเป้าหมาย (การเงิน/ความรัก = ศรี ฯลฯ)
 * - เลขที่ควรเลี่ยง = เลขของดาวตำแหน่งกาลกิณี
 */
import { GOAL_ROLE, PLANET_NAME, type Planet, type TaksaRole } from '@/data/daily-colors';
import { PHONE_PAIRS } from '@/data/phone-pairs';
import { taksaOfPlanet } from '@/lib/daily-colors';
import type { GoalSlug } from '@/lib/goals';
import type { PairResult } from './index';

export const PLANET_DIGIT: Record<Planet, number> = {
  sun: 1,
  moon: 2,
  mars: 3,
  mercury: 4,
  jupiter: 5,
  venus: 6,
  saturn: 7,
  rahu: 8,
};

/** วันเกิด 8 แบบตามทักษา (พุธแยกกลางวัน/กลางคืน) */
export const BIRTH_DAYS: { slug: string; label: string; planet: Planet }[] = [
  { slug: 'sun', label: 'วันอาทิตย์', planet: 'sun' },
  { slug: 'mon', label: 'วันจันทร์', planet: 'moon' },
  { slug: 'tue', label: 'วันอังคาร', planet: 'mars' },
  { slug: 'wed', label: 'วันพุธ (กลางวัน)', planet: 'mercury' },
  { slug: 'wed-night', label: 'วันพุธ (กลางคืน)', planet: 'rahu' },
  { slug: 'thu', label: 'วันพฤหัสบดี', planet: 'jupiter' },
  { slug: 'fri', label: 'วันศุกร์', planet: 'venus' },
  { slug: 'sat', label: 'วันเสาร์', planet: 'saturn' },
];

/** วันในสัปดาห์จากวันที่ (0 = อาทิตย์) -> slug วันเกิด พุธถือเป็นกลางวัน */
export const birthDaySlugFromWeekday = (w: number) => ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][w];

export interface PersonalNumbers {
  birthLabel: string;
  role: TaksaRole;
  /** เลขเสริมเรื่องที่เลือก */
  goalDigit: number;
  goalPlanet: string;
  /** เลขกาลกิณี ควรเลี่ยง */
  avoidDigit: number;
  avoidPlanet: string;
  /** คู่เลขดีตามตาราง ที่ส่งเรื่องนี้และไม่มีเลขกาลกิณี (มีเลขเสริมก่อน) */
  recommended: string[];
}

export function personalNumbers(birthSlug: string, goal: GoalSlug, limit = 8): PersonalNumbers | null {
  const birth = BIRTH_DAYS.find((b) => b.slug === birthSlug);
  if (!birth) return null;
  const slots = taksaOfPlanet(birth.planet);
  const role = GOAL_ROLE[goal];
  const goalSlot = slots.find((s) => s.role === role)!;
  const avoidSlot = slots.find((s) => s.role === 'กาลกิณี')!;
  const goalDigit = PLANET_DIGIT[goalSlot.planet];
  const avoidDigit = PLANET_DIGIT[avoidSlot.planet];
  const rank = { high: 0, medium: 1, low: 2 } as const;
  const recommended = Object.entries(PHONE_PAIRS)
    .filter(([p, m]) => m.level === 'good' && !p.includes(String(avoidDigit)) && (m.goals.includes(goal) || p.includes(String(goalDigit))))
    .sort(([pa, a], [pb, b]) => {
      const score = (p: string, m: typeof a) =>
        (p.includes(String(goalDigit)) ? 0 : 4) + (m.goals.includes(goal) ? 0 : 2) + rank[m.agreement];
      return score(pa, a) - score(pb, b);
    })
    .slice(0, limit)
    .map(([p]) => p);
  return {
    birthLabel: birth.label,
    role,
    goalDigit,
    goalPlanet: PLANET_NAME[goalSlot.planet],
    avoidDigit,
    avoidPlanet: PLANET_NAME[avoidSlot.planet],
    recommended,
  };
}

/** คู่เลขในเบอร์ที่มีเลขกาลกิณีของผู้ใช้ */
export const pairsWithAvoid = (pairs: PairResult[], avoidDigit: number) =>
  pairs.filter((p) => p.pair.includes(String(avoidDigit)));
