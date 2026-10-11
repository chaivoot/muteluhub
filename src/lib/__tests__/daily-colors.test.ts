import { describe, expect, it } from 'vitest';
import { colorLabel, getShirtColor, taksaOfDay } from '@/lib/daily-colors';
import { GOALS } from '@/lib/goals';

describe('taksaOfDay', () => {
  it('Sunday matches the classic table (and the mockup sample)', () => {
    const names = taksaOfDay(0).map((s) => `${s.role}:${s.color.name}`);
    expect(names).toEqual([
      'บริวาร:สีแดง',
      'อายุ:สีเหลือง',
      'เดช:สีชมพู',
      'ศรี:สีเขียว',
      'มูละ:สีม่วง',
      'อุตสาหะ:สีส้ม',
      'มนตรี:สีเทา',
      'กาลกิณี:สีฟ้า',
    ]);
  });

  it('follows the taksa cycle, not the calendar order', () => {
    // พฤหัสบดี: บริวาร พฤหัส, อายุ ราหู, เดช ศุกร์, ศรี อาทิตย์, ..., กาลกิณี เสาร์
    const thu = taksaOfDay(4);
    expect(thu[0].planet).toBe('jupiter');
    expect(thu[3].planet).toBe('sun');
    expect(thu[7].planet).toBe('saturn');
    // พุธ (กลางวัน): กาลกิณี อังคาร (ชมพู)
    expect(taksaOfDay(3)[7].planet).toBe('mars');
  });

  it('uses every planet exactly once per day', () => {
    for (let d = 0; d < 7; d++) {
      expect(new Set(taksaOfDay(d as 0).map((s) => s.planet)).size).toBe(8);
    }
  });
});

describe('getShirtColor', () => {
  it('maps goals to roles', () => {
    expect(colorLabel(getShirtColor(0, 'money').lucky.color)).toBe('สีเขียว');
    expect(colorLabel(getShirtColor(0, 'money').avoid.color)).toBe('สีฟ้า น้ำเงิน');
    expect(getShirtColor(0, 'career').lucky.role).toBe('เดช');
    expect(getShirtColor(0, 'protection').lucky.role).toBe('มนตรี');
  });

  it('never recommends the avoid color', () => {
    for (let d = 0; d < 7; d++) {
      for (const g of GOALS) {
        const r = getShirtColor(d as 0, g.slug);
        expect(r.lucky.planet).not.toBe(r.avoid.planet);
      }
    }
  });
});
