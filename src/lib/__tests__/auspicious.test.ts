import { describe, expect, it } from 'vitest';
import { getEventType } from '@/data/auspicious';
import { LUNAR_MONTHS } from '@/data/lunar-calendar';
import { dayInfo, rateDay } from '@/lib/auspicious';
import { formatLunar, lunarDate } from '@/lib/lunar';

const lunar = (iso: string) => formatLunar(lunarDate(iso, LUNAR_MONTHS)!);

describe('lunar calendar data matches known dates', () => {
  it.each([
    ['2026-03-03', 'ขึ้น ๑๕ ค่ำ เดือน ๔'], // มาฆบูชา 2569 (ปีอธิกมาส)
    ['2026-04-14', 'แรม ๑๒ ค่ำ เดือน ๕'], // มหาสงกรานต์ 2569
    ['2026-05-31', 'ขึ้น ๑๕ ค่ำ เดือน ๗'], // วิสาขบูชา 2569
    ['2026-07-29', 'ขึ้น ๑๕ ค่ำ เดือน ๘๘'], // อาสาฬหบูชา 2569 (เดือน ๘ หลัง)
    ['2026-07-30', 'แรม ๑ ค่ำ เดือน ๘๘'], // เข้าพรรษา 2569
    ['2026-10-26', 'ขึ้น ๑๕ ค่ำ เดือน ๑๑'], // ออกพรรษา 2569
    ['2026-11-24', 'ขึ้น ๑๕ ค่ำ เดือน ๑๒'], // ลอยกระทง 2569
    ['2027-02-21', 'ขึ้น ๑๕ ค่ำ เดือน ๓'],
    ['2027-11-13', 'ขึ้น ๑๕ ค่ำ เดือน ๑๒'],
  ])('%s = %s', (iso, expected) => expect(lunar(iso)).toBe(expected));

  it('has contiguous months', () => {
    for (let i = 1; i < LUNAR_MONTHS.length; i++) {
      const prev = LUNAR_MONTHS[i - 1];
      const next = new Date(Date.UTC(+prev.start.slice(0, 4), +prev.start.slice(5, 7) - 1, +prev.start.slice(8, 10) + prev.days));
      expect(next.toISOString().slice(0, 10)).toBe(LUNAR_MONTHS[i].start);
    }
  });
});

describe('rateDay (กาลโยค 2569: ธงชัย จันทร์, อธิบดี เสาร์, อุบาทว์ อาทิตย์, โลกาวินาศ จันทร์)', () => {
  const wedding = getEventType('wedding')!;
  const car = getEventType('new-car')!;

  it('Monday is both ธงชัย and โลกาวินาศ, so it is avoided', () => {
    const info = dayInfo('2026-11-16'); // จันทร์
    expect(info.special).toEqual(['thongchai', 'lokawinat']);
    expect(rateDay(info, car).level).toBe('avoid');
  });

  it('Saturday (อธิบดี) is good for a car but not popular for weddings', () => {
    const sat = dayInfo('2026-11-14');
    expect(rateDay(sat, car)).toEqual({ level: 'good', reasons: ['วันอธิบดี'] });
    expect(rateDay(sat, wedding).level).toBe('caution');
  });

  it('Sunday is อุบาทว์', () => {
    expect(rateDay(dayInfo('2026-11-15'), car).level).toBe('avoid');
  });

  it('wedding avoids ดิถีมหาสูญ and likes preferred months', () => {
    // เดือน ๑๒ ค่ำที่ ๑๐ = มหาสูญ: ขึ้น ๑๐ ค่ำ เดือน ๑๒ = 2026-11-19 (พฤหัส)
    expect(dayInfo('2026-11-19').mahasun).toBe(true);
    // ศุกร์ 2027-01-15 = เดือนยี่ ขึ้น ๘ ค่ำ: เดือนนิยม ไม่ติดข้อห้าม
    expect(rateDay(dayInfo('2027-01-15'), wedding)).toEqual({ level: 'good', reasons: ['เดือนที่นิยมแต่งงาน'] });
  });

  it('does not rate days after the last announced period', () => {
    expect(rateDay(dayInfo('2027-05-01'), car).level).toBe('unknown');
  });
});
