import { describe, expect, it } from 'vitest';
import { GOALS } from '@/lib/goals';
import {
  GOAL_NUMBERS,
  NUMBER_MEANINGS,
  calculateLuckyNumbers,
  isValidBirthDate,
  reduceNumber,
} from '@/lib/lucky-number';

describe('reduceNumber', () => {
  it('reduces to a single digit and records steps', () => {
    expect(reduceNumber(1990)).toEqual({ value: 1, steps: [1990, 19, 10, 1] });
  });

  it('keeps master numbers unless asked not to', () => {
    expect(reduceNumber(29).value).toBe(11);
    expect(reduceNumber(29, false).value).toBe(2);
    expect(reduceNumber(22).value).toBe(22);
  });
});

describe('calculateLuckyNumbers', () => {
  it('computes Life Path by reducing month, day and year separately', () => {
    // 5 มี.ค. 1990: 3 + 5 + 1 = 9
    const r = calculateLuckyNumbers({ year: 1990, month: 3, day: 5 }, 'money');
    expect(r.lifePath).toBe(9);
    expect(r.birthday).toBe(5);
    expect(r.goalNumbers).toEqual([8, 5]);
    expect(r.luckyNumbers).toEqual([9, 5, 8]);
  });

  it('keeps master numbers in parts and totals', () => {
    // 9 ส.ค. 2003: 8 + 9 + 5 = 22 (เลขพิเศษ ไม่ทอน)
    // 29 พ.ย. 1980: 11 + 11 + 9 = 31 -> 4
    expect(calculateLuckyNumbers({ year: 2003, month: 8, day: 9 }, 'love').lifePath).toBe(22);
    expect(calculateLuckyNumbers({ year: 1980, month: 11, day: 29 }, 'love').lifePath).toBe(4);
  });

  it('uses single digits in the lucky numbers list', () => {
    const r = calculateLuckyNumbers({ year: 2003, month: 8, day: 9 }, 'love');
    expect(r.luckyNumbers.every((n) => n >= 1 && n <= 9)).toBe(true);
    expect(r.luckyNumbers[0]).toBe(4); // 22 -> 4
  });

  it('rejects impossible dates', () => {
    expect(isValidBirthDate({ year: 2001, month: 2, day: 29 })).toBe(false);
    expect(isValidBirthDate({ year: 2000, month: 2, day: 29 })).toBe(true);
    expect(() => calculateLuckyNumbers({ year: 2001, month: 2, day: 29 }, 'money')).toThrow();
  });
});

describe('meanings data', () => {
  it('maps every goal to numbers that have meanings', () => {
    for (const g of GOALS) {
      expect(GOAL_NUMBERS[g.slug].length).toBeGreaterThan(0);
      for (const n of GOAL_NUMBERS[g.slug]) expect(NUMBER_MEANINGS[n]).toBeDefined();
    }
  });
});
