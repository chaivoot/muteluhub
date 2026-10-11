'use client';

import type { CSSProperties } from 'react';
import { GOALS } from '@/lib/goals';
import { GoalIcon } from './icons';
import { useGoal } from './goal-context';

export function GoalPicker() {
  const { goal, setGoal } = useGoal();
  return (
    <div className="goal-picker" role="group" aria-label="เลือกเรื่องที่อยากเสริม">
      {GOALS.map((g) => {
        const selected = goal === g.slug;
        return (
          <button
            key={g.slug}
            type="button"
            className="goal-picker__item"
            aria-pressed={selected}
            onClick={() => setGoal(g.slug)}
            style={{ '--goal': g.color, '--goal-bg': g.chipBg, '--goal-border': g.chipBorder } as CSSProperties}
          >
            <span className="goal-picker__circle">
              <GoalIcon slug={g.slug} strokeWidth={selected ? 1.9 : 1.7} />
            </span>
            {g.short}
          </button>
        );
      })}
    </div>
  );
}
