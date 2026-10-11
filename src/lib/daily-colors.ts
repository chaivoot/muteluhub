import { DAILY_COLORS, DAILY_COLORS_STATUS, type DailyColor } from '@/data/daily-colors';
import type { GoalSlug } from '@/lib/goals';
import type { Weekday } from '@/lib/thai-date';

export interface ShirtColorResult {
  lucky: DailyColor | undefined;
  avoid: DailyColor[];
  isSample: boolean;
}

export function getShirtColor(
  weekday: Weekday,
  goal: GoalSlug,
  colors: DailyColor[] = DAILY_COLORS,
): ShirtColorResult {
  const ofDay = colors.filter((c) => c.weekday === weekday);
  return {
    lucky: ofDay.find((c) => !c.avoid && c.goal === goal),
    avoid: ofDay.filter((c) => c.avoid && (!c.goal || c.goal === goal)),
    isSample: DAILY_COLORS_STATUS === 'sample',
  };
}
