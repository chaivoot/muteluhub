import { describe, expect, it } from 'vitest';

import { colorLabel, getShirtColor } from '@/lib/daily-colors';
import { calculateLuckyNumbers } from '@/lib/lucky-number';
import { derivedValues, luckyNumbersText, parseWeekday } from '@/lib/prompt-derive';
import { getPromptTemplate, missingFields, renderPrompt } from '@/lib/prompts';

describe('derived prompt fields', () => {
  it('fills lucky numbers from the birth date alone', () => {
    const t = getPromptTemplate('lucky-number-money')!;
    expect(derivedValues(t, {}).lucky_numbers).toBeUndefined();
    const d = derivedValues(t, { birth_date: '1976-03-21' });
    expect(d.method).toContain('Numerology');
    expect(d.lucky_numbers).toBe(luckyNumbersText(calculateLuckyNumbers({ year: 1976, month: 3, day: 21 }, 'money')));
    const all = { birth_date: '1976-03-21', ...d };
    expect(missingFields(t, all)).toEqual([]);
    expect(renderPrompt(t, all)).not.toContain('[หลักคำนวณ]');
  });

  it('ignores an invalid birth date', () => {
    const t = getPromptTemplate('lucky-number-love')!;
    expect(derivedValues(t, { birth_date: '1976-02-31' }).lucky_numbers).toBeUndefined();
  });

  it('fills colors from the weekday', () => {
    const t = getPromptTemplate('color-today-career')!;
    const d = derivedValues(t, { weekday: 'จันทร์' });
    const { lucky, avoid } = getShirtColor(1, 'career');
    expect(d).toMatchObject({ color: colorLabel(lucky.color), avoid_color: colorLabel(avoid.color) });
    expect(parseWeekday('วันพุธ')).toBe(3);
    expect(parseWeekday('xyz')).toBeNull();
  });
});
