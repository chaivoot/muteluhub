import { describe, expect, it } from 'vitest';
import { addDays, bangkokDay, formatThaiFullDate, formatThaiRange } from '@/lib/thai-date';

describe('bangkokDay', () => {
  it('uses Bangkok time (UTC+7)', () => {
    // 2026-10-10 18:30 UTC = 2026-10-11 01:30 ที่ไทย
    expect(bangkokDay(new Date('2026-10-10T18:30:00Z')).iso).toBe('2026-10-11');
    expect(bangkokDay(new Date('2026-10-10T16:59:00Z')).iso).toBe('2026-10-10');
  });

  it('formats like the mockup', () => {
    expect(formatThaiFullDate(bangkokDay(new Date('2026-10-11T03:00:00Z')))).toBe('วันอาทิตย์ 11 ตุลาคม 2569');
  });
});

describe('formatThaiRange', () => {
  it('same month', () => expect(formatThaiRange('2026-10-10', '2026-10-18')).toBe('10-18 ต.ค.'));
  it('with year', () => expect(formatThaiRange('2026-10-10', '2026-10-18', true)).toBe('10-18 ต.ค. 2569'));
  it('across months', () => expect(formatThaiRange('2026-09-28', '2026-10-03')).toBe('28 ก.ย. - 3 ต.ค.'));
  it('across years', () =>
    expect(formatThaiRange('2026-12-30', '2027-01-02', true)).toBe('30 ธ.ค. 2569 - 2 ม.ค. 2570'));
  it('single day', () => expect(formatThaiRange('2026-10-10', '2026-10-10')).toBe('10 ต.ค.'));
});

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});
