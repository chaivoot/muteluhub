/** วันที่แบบไทย (พ.ศ.) ตามเวลาไทย Asia/Bangkok (UTC+7 ไม่มี DST) */

export const TH_WEEKDAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'] as const;

export const TH_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
] as const;

export const TH_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
] as const;

/** 0 = อาทิตย์ ... 6 = เสาร์ */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ThaiDay {
  /** YYYY-MM-DD (ค.ศ.) ใช้เทียบกับข้อมูล */
  iso: string;
  year: number;
  month: number; // 1-12
  day: number;
  weekday: Weekday;
}

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

export function bangkokDay(now: Date = new Date()): ThaiDay {
  const shifted = new Date(now.getTime() + BANGKOK_OFFSET_MS);
  return fromUtcDate(shifted);
}

export function parseIsoDay(iso: string): ThaiDay {
  const [y, m, d] = iso.split('-').map(Number);
  return fromUtcDate(new Date(Date.UTC(y, m - 1, d)));
}

export function addDays(iso: string, days: number): string {
  const { year, month, day } = parseIsoDay(iso);
  return fromUtcDate(new Date(Date.UTC(year, month - 1, day + days))).iso;
}

function fromUtcDate(d: Date): ThaiDay {
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return {
    iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    year,
    month,
    day,
    weekday: d.getUTCDay() as Weekday,
  };
}

export const toBuddhistYear = (year: number) => year + 543;

/** "วันอาทิตย์ 11 ตุลาคม 2569" */
export function formatThaiFullDate(d: ThaiDay): string {
  return `วัน${TH_WEEKDAYS[d.weekday]} ${d.day} ${TH_MONTHS[d.month - 1]} ${toBuddhistYear(d.year)}`;
}

/** "10-18 ต.ค." / "28 ก.ย. - 3 ต.ค." (ใส่ปีเมื่อ withYear) */
export function formatThaiRange(startIso: string, endIso: string, withYear = false): string {
  const s = parseIsoDay(startIso);
  const e = parseIsoDay(endIso);
  const year = withYear ? ` ${toBuddhistYear(e.year)}` : '';
  if (s.iso === e.iso) return `${s.day} ${TH_MONTHS_SHORT[s.month - 1]}${year}`;
  if (s.year === e.year && s.month === e.month) {
    return `${s.day}-${e.day} ${TH_MONTHS_SHORT[e.month - 1]}${year}`;
  }
  const sYear = withYear && s.year !== e.year ? ` ${toBuddhistYear(s.year)}` : '';
  return `${s.day} ${TH_MONTHS_SHORT[s.month - 1]}${sYear} - ${e.day} ${TH_MONTHS_SHORT[e.month - 1]}${year}`;
}
