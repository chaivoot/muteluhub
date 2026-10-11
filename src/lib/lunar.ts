import { toThaiDigits } from '@/lib/thai-digits';

/**
 * ปฏิทินจันทรคติไทย จากข้อมูลวันขึ้น 1 ค่ำของแต่ละเดือน (src/data/lunar-calendar.ts)
 * ข้างขึ้น 15 วันเสมอ ข้างแรม 14 วัน (เดือนขาด 29 วัน) หรือ 15 วัน (เดือนเต็ม 30 วัน)
 */
export interface LunarMonth {
  /** 1-12 */
  month: number;
  /** เดือน 8 หลัง ในปีอธิกมาส */
  second8?: boolean;
  /** วันขึ้น 1 ค่ำ (YYYY-MM-DD) */
  start: string;
  days: 29 | 30;
}

export interface LunarDate {
  month: number;
  second8: boolean;
  waxing: boolean;
  /** ค่ำที่ (1-15) */
  day: number;
  monthDays: 29 | 30;
}

const dayNumber = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86_400_000;

/** วันจันทรคติของวันที่ หรือ null ถ้าอยู่นอกช่วงข้อมูล */
export function lunarDate(iso: string, months: LunarMonth[]): LunarDate | null {
  const d = dayNumber(iso);
  for (const m of months) {
    const offset = d - dayNumber(m.start);
    if (offset < 0 || offset >= m.days) continue;
    const waxing = offset < 15;
    return {
      month: m.month,
      second8: !!m.second8,
      waxing,
      day: waxing ? offset + 1 : offset - 14,
      monthDays: m.days,
    };
  }
  return null;
}

const MONTH_NAME: Record<number, string> = { 1: 'อ้าย', 2: 'ยี่' };

/** "แรม ๖ ค่ำ เดือน ๑๒" (เลขไทย ตามกติกาเนื้อหาโหราศาสตร์ไทย) */
export function formatLunar(l: LunarDate): string {
  const month = MONTH_NAME[l.month] ?? toThaiDigits(l.month);
  const m = l.second8 ? `${toThaiDigits(8)}๘` : month;
  return `${l.waxing ? 'ขึ้น' : 'แรม'} ${toThaiDigits(l.day)} ค่ำ เดือน${MONTH_NAME[l.month] ? '' : ' '}${m}`;
}

/** วันพระ: ขึ้น/แรม ๘ ค่ำ, ขึ้น ๑๕ ค่ำ, แรมค่ำสุดท้ายของเดือน */
export function isBuddhistHolyDay(l: LunarDate): boolean {
  if (l.day === 8) return true;
  if (l.waxing) return l.day === 15;
  return l.day === l.monthDays - 15;
}
