import { describe, expect, it } from 'vitest';
import { formatLunar, isBuddhistHolyDay, lunarDate, type LunarMonth } from '@/lib/lunar';

// ข้อมูลทดสอบสมมติ (ไม่ใช่ปฏิทินจริง)
const months: LunarMonth[] = [
  { month: 11, start: '2026-09-11', days: 29 },
  { month: 12, start: '2026-10-10', days: 30 },
];

describe('lunarDate', () => {
  it('maps waxing and waning days', () => {
    expect(lunarDate('2026-10-10', months)).toMatchObject({ month: 12, waxing: true, day: 1 });
    expect(lunarDate('2026-10-24', months)).toMatchObject({ month: 12, waxing: true, day: 15 });
    expect(lunarDate('2026-10-25', months)).toMatchObject({ month: 12, waxing: false, day: 1 });
    expect(lunarDate('2026-11-08', months)).toMatchObject({ month: 12, waxing: false, day: 15 });
    expect(lunarDate('2026-10-09', months)).toMatchObject({ month: 11, waxing: false, day: 14 });
    expect(lunarDate('2026-12-31', months)).toBeNull();
  });

  it('formats with Thai digits', () => {
    expect(formatLunar(lunarDate('2026-10-30', months)!)).toBe('แรม ๖ ค่ำ เดือน ๑๒');
    expect(formatLunar({ month: 1, second8: false, waxing: true, day: 3, monthDays: 29 })).toBe('ขึ้น ๓ ค่ำ เดือนอ้าย');
    expect(formatLunar({ month: 8, second8: true, waxing: true, day: 15, monthDays: 30 })).toBe('ขึ้น ๑๕ ค่ำ เดือน ๘๘');
  });

  it('finds holy days, including the last waning day of short months', () => {
    expect(isBuddhistHolyDay(lunarDate('2026-09-18', months)!)).toBe(true); // ขึ้น 8
    expect(isBuddhistHolyDay(lunarDate('2026-10-09', months)!)).toBe(true); // แรม 14 เดือนขาด
    expect(isBuddhistHolyDay(lunarDate('2026-11-08', months)!)).toBe(true); // แรม 15 เดือนเต็ม
    expect(isBuddhistHolyDay(lunarDate('2026-11-07', months)!)).toBe(false);
  });
});
