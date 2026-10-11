import goalsJson from '@data/goals.json';

export type GoalSlug =
  | 'love'
  | 'career'
  | 'money'
  | 'business'
  | 'health'
  | 'study'
  | 'family'
  | 'protection';

export interface Goal {
  slug: GoalSlug;
  name: string;
  short: string;
  color: string;
  chipText: string;
  chipBg: string;
  chipBorder: string;
  order: number;
}

/** เป้าหมาย 8 อย่าง จาก data/goals.json (แหล่งความจริงเดียว) เรียงตาม order */
export const GOALS: readonly Goal[] = (goalsJson as Goal[])
  .slice()
  .sort((a, b) => a.order - b.order);

const bySlug = new Map(GOALS.map((g) => [g.slug, g]));

export function isGoalSlug(value: unknown): value is GoalSlug {
  return typeof value === 'string' && bySlug.has(value as GoalSlug);
}

export function getGoal(slug: GoalSlug): Goal {
  const goal = bySlug.get(slug);
  if (!goal) throw new Error(`Unknown goal: ${slug}`);
  return goal;
}
