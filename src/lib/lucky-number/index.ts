/**
 * เครื่องคำนวณเลขมงคล: หลักเดียวทั้งเว็บ (spec ข้อ 3.4)
 * หลัก: Numerology แบบพีทาโกรัส (เจ้าของเลือก 2026-10-11)
 * - Life Path: ทอนเดือน วัน ปี (ค.ศ.) แยกกันเป็นเลขหลักเดียว แล้วรวมและทอนอีกครั้ง
 * - Birthday: ทอนวันที่เกิด
 * - เก็บเลขพิเศษ (master number) 11, 22, 33 ไว้ไม่ทอน
 * เปลี่ยนหลักคำนวณในอนาคต: แก้เฉพาะไฟล์ในโฟลเดอร์นี้ หน้าเว็บอ่านชื่อหลักจาก LUCKY_NUMBER_METHOD
 */
import type { GoalSlug } from '@/lib/goals';
import { GOAL_NUMBERS, NUMBER_MEANINGS } from './meanings';

export const LUCKY_NUMBER_METHOD = {
  name: 'Numerology (พีทาโกรัส)',
  short: 'Numerology',
  description:
    'นำวัน เดือน ปีเกิด (ค.ศ.) มาบวกเลขทีละหลักจนเหลือเลขหลักเดียว เรียกว่าเลขเส้นทางชีวิต (Life Path) และเลขวันเกิด ถ้าได้ 11, 22 หรือ 33 จะถือเป็นเลขพิเศษไม่ทอนต่อ',
} as const;

const MASTER_NUMBERS = new Set([11, 22, 33]);

export const digitSum = (n: number) =>
  String(Math.abs(n))
    .split('')
    .reduce((sum, d) => sum + Number(d), 0);

/** ทอนเลขจนเหลือหลักเดียว (หรือเลขพิเศษ) พร้อมขั้นตอน เช่น 1990 -> 19 -> 10 -> 1 */
export function reduceNumber(n: number, keepMaster = true): { value: number; steps: number[] } {
  const steps = [n];
  let value = n;
  while (value > 9 && !(keepMaster && MASTER_NUMBERS.has(value))) {
    value = digitSum(value);
    steps.push(value);
  }
  return { value, steps };
}

export const rootDigit = (n: number) => reduceNumber(n, false).value;

export interface BirthDate {
  year: number; // ค.ศ.
  month: number; // 1-12
  day: number;
}

export function isValidBirthDate({ year, month, day }: BirthDate): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (year < 1900 || year > 2100) return false;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

export interface LuckyNumberResult {
  lifePath: number;
  lifePathParts: { month: number[]; day: number[]; year: number[]; total: number[] };
  birthday: number;
  /** เลขที่ผูกกับเป้าหมาย */
  goalNumbers: number[];
  /** เลขมงคลที่แนะนำ: เลขส่วนตัว (หลักเดียว) + เลขของเป้าหมาย ไม่ซ้ำ */
  luckyNumbers: number[];
}

export function calculateLuckyNumbers(birth: BirthDate, goal: GoalSlug): LuckyNumberResult {
  if (!isValidBirthDate(birth)) throw new Error('Invalid birth date');
  const month = reduceNumber(birth.month);
  const day = reduceNumber(birth.day);
  const year = reduceNumber(birth.year);
  const total = reduceNumber(month.value + day.value + year.value);
  const birthday = reduceNumber(birth.day).value;
  const goalNumbers = GOAL_NUMBERS[goal];
  const personal = [rootDigit(total.value), rootDigit(birthday)];
  const luckyNumbers = [...new Set([...personal, ...goalNumbers])];

  return {
    lifePath: total.value,
    lifePathParts: { month: month.steps, day: day.steps, year: year.steps, total: total.steps },
    birthday,
    goalNumbers,
    luckyNumbers,
  };
}

export { GOAL_NUMBERS, NUMBER_MEANINGS };
