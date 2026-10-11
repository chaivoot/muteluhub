import { describe, expect, it } from 'vitest';
import type { DailyColor } from '@/data/daily-colors';
import { getShirtColor } from '@/lib/daily-colors';
import { GOALS } from '@/lib/goals';

const colors: DailyColor[] = [
  { weekday: 0, goal: 'money', colorName: 'สีเขียว', hex: '#2F8A5B', avoid: false, source: 'test' },
  { weekday: 0, colorName: 'สีฟ้า', hex: '#7FB3E0', avoid: true, source: 'test' },
  { weekday: 0, goal: 'love', colorName: 'สีดำ', hex: '#000000', avoid: true, source: 'test' },
];

describe('getShirtColor', () => {
  it('returns the lucky color for the goal and avoid colors for everyone', () => {
    const r = getShirtColor(0, 'money', colors);
    expect(r.lucky?.colorName).toBe('สีเขียว');
    expect(r.avoid.map((c) => c.colorName)).toEqual(['สีฟ้า']);
  });

  it('includes goal-specific avoid colors', () => {
    expect(getShirtColor(0, 'love', colors).avoid).toHaveLength(2);
  });

  it('returns nothing when no data exists for the day', () => {
    const r = getShirtColor(1, 'money', colors);
    expect(r.lucky).toBeUndefined();
    expect(r.avoid).toEqual([]);
  });
});

describe('GOALS', () => {
  it('has the 8 goals from the spec in order', () => {
    expect(GOALS.map((g) => g.slug)).toEqual([
      'love', 'career', 'money', 'business', 'health', 'study', 'family', 'protection',
    ]);
  });
});
