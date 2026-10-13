/**
 * เช็กทะเบียนรถมงคล: ผลรวม (ค่าอักษร + ตัวเลข) + คู่เลขในชุดตัวเลข
 * ข้อมูลอยู่ที่ src/data/plate-letters.ts ความหมายคู่เลขใช้ตารางเดียวกับเบอร์โทร (PHONE_PAIRS)
 * คู่เลขตามวันเกิดใช้ทักษา หลักเดียวกับสีเสื้อและเช็กเบอร์ (src/lib/phone-number/personal.ts)
 * คำนวณฝั่ง client เท่านั้น
 */
import { GOAL_ROLE, type Planet } from '@/data/daily-colors';
import { PHONE_PAIRS, type PhoneMeaning } from '@/data/phone-pairs';
import { LETTER_VALUES, PLANET_LETTERS, PLATE_PAIR_GROUPS, PLATE_SUMS } from '@/data/plate-letters';
import { taksaOfPlanet } from '@/lib/daily-colors';
import type { GoalSlug } from '@/lib/goals';
import { BIRTH_DAYS, PLANET_DIGIT } from '@/lib/phone-number/personal';

export const PLATE_METHOD = {
  name: 'ผลรวมทะเบียน (อักษร + ตัวเลข) + คู่เลข',
  description:
    'แปลงตัวอักษรในหมวดเป็นตัวเลขตามตารางเลขศาสตร์อักษรไทย แล้วบวกกับตัวเลขทุกตัว (รวมเลขหน้าหมวด ไม่นับชื่อจังหวัด) ได้ผลรวมทะเบียน และอ่านคู่เลขที่ติดกันในชุดตัวเลข ความหมายรวบรวมจากหลายแหล่งในไทยที่ตรงกันเป็นส่วนใหญ่',
} as const;

export interface PlateParts {
  /** เลขหน้าหมวด เช่น 1 ใน 1กข (ถ้ามี) */
  prefix: string;
  letters: string;
  number: string;
}

export type PlateCheck =
  | { ok: true; plate: PlateParts }
  | { ok: false; reason: 'empty' | 'letters' | 'number' | 'format' };

/** รับ "1กข 1234", "กข1234", "1 กข-1234" ตัดชื่อจังหวัดและช่องว่างทิ้ง */
export function parsePlate(input: string): PlateCheck {
  const s = input.replace(/[\s\-.]/g, '');
  if (!s) return { ok: false, reason: 'empty' };
  const m = /^(\d?)([ก-ฮ]{1,3})(\d{0,4})/.exec(s);
  if (!m) return { ok: false, reason: 'format' };
  const [, prefix, letters, number] = m;
  if (letters.split('').some((c) => LETTER_VALUES[c] === undefined)) return { ok: false, reason: 'letters' };
  if (!number) return { ok: false, reason: 'number' };
  return { ok: true, plate: { prefix, letters, number } };
}

export interface PlatePair extends PhoneMeaning {
  pair: string;
  index: number;
  groups: { label: string; good: boolean }[];
}

export interface PlateResult {
  plate: PlateParts;
  letterValues: { letter: string; value: number }[];
  letterSum: number;
  digitSum: number;
  total: number;
  totalMeaning: PhoneMeaning | null;
  /** บวกเฉพาะตัวเลขแล้วย่อเหลือหลักเดียว (อีกสายที่นิยม) */
  digitRoot: number;
  pairs: PlatePair[];
  goal: { slug: GoalSlug; totalSupports: boolean; support: PlatePair[] } | null;
}

const digits = (s: string) => s.split('').reduce((a, c) => a + Number(c), 0);
const root = (n: number) => (n === 0 ? 0 : 1 + ((n - 1) % 9));

export function analyzePlate(plate: PlateParts, goal: GoalSlug | null = null): PlateResult {
  const letterValues = plate.letters.split('').map((letter) => ({ letter, value: LETTER_VALUES[letter] }));
  const letterSum = letterValues.reduce((a, l) => a + l.value, 0);
  const digitSum = digits(plate.prefix + plate.number);
  const total = letterSum + digitSum;
  const pairs: PlatePair[] = [];
  for (let i = 0; i < plate.number.length - 1; i++) {
    const pair = plate.number.slice(i, i + 2);
    pairs.push({
      pair,
      index: i,
      ...PHONE_PAIRS[pair],
      groups: PLATE_PAIR_GROUPS.filter((g) => g.pairs.includes(pair)).map((g) => ({ label: g.label, good: g.good })),
    });
  }
  const totalMeaning = PLATE_SUMS[total] ?? null;
  return {
    plate,
    letterValues,
    letterSum,
    digitSum,
    total,
    totalMeaning,
    digitRoot: root(digits(plate.number)),
    pairs,
    goal: goal
      ? {
          slug: goal,
          totalSupports: !!totalMeaning && totalMeaning.level === 'good' && totalMeaning.goals.includes(goal),
          support: pairs.filter((p) => p.level === 'good' && p.goals.includes(goal)),
        }
      : null,
  };
}

export interface PlatePersonal {
  birthLabel: string;
  goalLetters: string[];
  goalDigit: number;
  avoidLetters: string[];
  avoidDigit: number;
  avoidPlanet: Planet;
  /** ผลรวมดีที่ส่งเรื่องนี้ (ใช้ตอนจองหรือประมูล) */
  goodTotals: number[];
}

export function platePersonal(birthSlug: string, goal: GoalSlug): PlatePersonal | null {
  const birth = BIRTH_DAYS.find((b) => b.slug === birthSlug);
  if (!birth) return null;
  const slots = taksaOfPlanet(birth.planet);
  const goalSlot = slots.find((s) => s.role === GOAL_ROLE[goal])!;
  const avoidSlot = slots.find((s) => s.role === 'กาลกิณี')!;
  const rank = { high: 0, medium: 1, low: 2 } as const;
  const goodTotals = Object.entries(PLATE_SUMS)
    .filter(([, m]) => m.level === 'good' && m.goals.includes(goal))
    .sort(([a, ma], [b, mb]) => rank[ma.agreement] - rank[mb.agreement] || Number(a) - Number(b))
    .slice(0, 10)
    .map(([n]) => Number(n))
    .sort((a, b) => a - b);
  return {
    birthLabel: birth.label,
    goalLetters: PLANET_LETTERS[goalSlot.planet],
    goalDigit: PLANET_DIGIT[goalSlot.planet],
    avoidLetters: PLANET_LETTERS[avoidSlot.planet],
    avoidDigit: PLANET_DIGIT[avoidSlot.planet],
    avoidPlanet: avoidSlot.planet,
    goodTotals,
  };
}

/** ส่วนของทะเบียนที่ตรงกับกาลกิณีของผู้ใช้ */
export function plateWarnings(r: PlateResult, p: PlatePersonal) {
  return {
    letters: r.plate.letters.split('').filter((c) => p.avoidLetters.includes(c)),
    digitCount: (r.plate.prefix + r.plate.number).split('').filter((c) => c === String(p.avoidDigit)).length,
    lastIsAvoid: r.plate.number.endsWith(String(p.avoidDigit)),
  };
}
