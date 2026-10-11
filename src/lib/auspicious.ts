import { EVENT_TYPES, KALAYOK, MAHASUN, SPECIAL_LABEL, type EventType, type KalayokPeriod, type SpecialKind } from '@/data/auspicious';
import { LUNAR_MONTHS } from '@/data/lunar-calendar';
import { isBuddhistHolyDay, lunarDate, type LunarDate, type LunarMonth } from '@/lib/lunar';
import { parseIsoDay, TH_WEEKDAYS } from '@/lib/thai-date';

export type DayLevel = 'good' | 'ok' | 'caution' | 'avoid' | 'unknown';

export interface DayInfo {
  iso: string;
  lunar: LunarDate | null;
  holyDay: boolean;
  special: SpecialKind[];
  mahasun: boolean;
  /** อยู่ในช่วงที่มีประกาศกาลโยคแล้ว */
  rated: boolean;
}

export interface DayRating {
  level: DayLevel;
  reasons: string[];
}

const kalayokFor = (iso: string, periods: KalayokPeriod[]) => periods.find((p) => iso >= p.from && iso <= p.to);

export function dayInfo(iso: string, months: LunarMonth[] = LUNAR_MONTHS, periods: KalayokPeriod[] = KALAYOK): DayInfo {
  const lunar = lunarDate(iso, months);
  const weekday = parseIsoDay(iso).weekday;
  const k = kalayokFor(iso, periods);
  const special = k
    ? (['thongchai', 'athibodi', 'ubat', 'lokawinat'] as SpecialKind[]).filter((kind) => k[kind].includes(weekday))
    : [];
  return {
    iso,
    lunar,
    holyDay: lunar ? isBuddhistHolyDay(lunar) : false,
    special,
    mahasun: lunar ? MAHASUN[lunar.month] === lunar.day : false,
    rated: !!k && !!lunar,
  };
}

/** ประเมินวันสำหรับประเภทงาน: เลี่ยง (อุบาทว์ โลกาวินาศ ...) > ไม่นิยม > ดี (ธงชัย อธิบดี เดือนนิยม) > ทั่วไป */
export function rateDay(info: DayInfo, event: EventType): DayRating {
  if (!info.rated || !info.lunar) return { level: 'unknown', reasons: ['ยังไม่มีประกาศกาลโยคของช่วงนี้'] };
  const weekday = parseIsoDay(info.iso).weekday;
  const avoid: string[] = [];
  const caution: string[] = [];
  const good: string[] = [];

  if (info.special.includes('ubat')) avoid.push(SPECIAL_LABEL.ubat);
  if (info.special.includes('lokawinat')) avoid.push(SPECIAL_LABEL.lokawinat);
  if (event.avoidMahasun && info.mahasun) avoid.push('ดิถีมหาสูญ');
  if (event.cautionWeekdays?.includes(weekday)) caution.push(`ไม่นิยม${event.name}วัน${TH_WEEKDAYS[weekday]}`);
  if (event.cautionMonths?.includes(info.lunar.month)) caution.push(`ไม่นิยม${event.name}เดือนนี้`);
  if (info.special.includes('thongchai')) good.push(SPECIAL_LABEL.thongchai);
  if (info.special.includes('athibodi')) good.push(SPECIAL_LABEL.athibodi);
  if (event.preferredMonths?.includes(info.lunar.month)) good.push(`เดือนที่นิยม${event.name}`);

  if (avoid.length) return { level: 'avoid', reasons: avoid };
  if (caution.length) return { level: 'caution', reasons: caution };
  if (good.length) return { level: 'good', reasons: good };
  return { level: 'ok', reasons: [] };
}

/** ช่วงวันที่ที่มีข้อมูล (สำหรับเลื่อนเดือน) */
export const CALENDAR_RANGE = {
  from: LUNAR_MONTHS[0].start,
  to: KALAYOK[KALAYOK.length - 1].to,
};

export { EVENT_TYPES };
