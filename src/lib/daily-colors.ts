import {
  GOAL_ROLE,
  PLANET_COLOR,
  TAKSA_ORDER,
  TAKSA_ROLES,
  type Planet,
  type ShirtColor,
  type TaksaRole,
} from '@/data/daily-colors';
import type { GoalSlug } from '@/lib/goals';
import type { Weekday } from '@/lib/thai-date';

/** วันในสัปดาห์ -> ดาวประจำวัน (พุธใช้พุธกลางวัน) */
const WEEKDAY_PLANET: Record<Weekday, Planet> = {
  0: 'sun',
  1: 'moon',
  2: 'mars',
  3: 'mercury',
  4: 'jupiter',
  5: 'venus',
  6: 'saturn',
};

export interface TaksaSlot {
  role: TaksaRole;
  planet: Planet;
  color: ShirtColor;
}

/** ตำแหน่งทักษาทั้ง 8 ของวัน เรียงตาม TAKSA_ROLES */
export function taksaOfDay(weekday: Weekday): TaksaSlot[] {
  return taksaOfPlanet(WEEKDAY_PLANET[weekday]);
}

/** ตำแหน่งทักษาทั้ง 8 นับจากดาวที่กำหนด (ใช้กับวันเกิด ซึ่งพุธกลางคืน = ราหู) */
export function taksaOfPlanet(planet: Planet): TaksaSlot[] {
  const start = TAKSA_ORDER.indexOf(planet);
  return TAKSA_ROLES.map((role, i) => {
    const planet = TAKSA_ORDER[(start + i) % TAKSA_ORDER.length];
    return { role, planet, color: PLANET_COLOR[planet] };
  });
}

export interface ShirtColorResult {
  lucky: TaksaSlot;
  avoid: TaksaSlot;
}

export function getShirtColor(weekday: Weekday, goal: GoalSlug): ShirtColorResult {
  const slots = taksaOfDay(weekday);
  return {
    lucky: slots.find((s) => s.role === GOAL_ROLE[goal])!,
    avoid: slots.find((s) => s.role === 'กาลกิณี')!,
  };
}

/** "สีฟ้า น้ำเงิน" */
export const colorLabel = (c: ShirtColor) => [c.name, ...c.alt].join(' ');

/** "ฟ้า น้ำเงิน" (ไม่มีคำว่าสี) */
export const colorShort = (c: ShirtColor) => [c.name.replace(/^สี/, ''), ...c.alt].join(' ');
