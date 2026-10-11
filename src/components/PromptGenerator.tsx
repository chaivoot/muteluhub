'use client';

import { useEffect, useMemo, useState } from 'react';
import { getDiscipline } from '@/lib/disciplines';
import type { GoalSlug } from '@/lib/goals';
import { filterTemplates } from '@/lib/prompts';
import { GoalChips } from './GoalChips';
import { PromptBuilder } from './PromptBuilder';
import { useGoal } from './goal-context';

/** เลือกเป้าหมาย > ศาสตร์ > กรอกข้อมูล > ได้ prompt */
export function PromptGenerator() {
  const { goal: remembered, setGoal: remember } = useGoal();
  const [goal, setGoal] = useState<GoalSlug | null>(null);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    if (!goal && remembered) setGoal(remembered);
  }, [remembered, goal]);

  const options = useMemo(() => (goal ? filterTemplates({ goal }) : []), [goal]);
  const template = options.find((t) => t.slug === slug) ?? options[0];

  return (
    <>
      <h2 className="step-title container">1. อยากเสริมเรื่องอะไร</h2>
      <GoalChips
        value={goal}
        allowAll={false}
        onChange={(g) => {
          if (!g) return;
          setGoal(g);
          remember(g);
          setSlug('');
        }}
      />
      {goal && (
        <>
          <h2 className="step-title container">2. ใช้ศาสตร์ไหน</h2>
          <div className="chip-row chip-row--wrap container" role="radiogroup" aria-label="ศาสตร์">
            {options.map((t) => (
              <button
                key={t.slug}
                type="button"
                role="radio"
                aria-checked={t.slug === template?.slug}
                className="chip"
                onClick={() => setSlug(t.slug)}
              >
                {t.discipline ? getDiscipline(t.discipline)?.name : t.title}
              </button>
            ))}
          </div>
        </>
      )}
      {template && (
        <>
          <h2 className="step-title container">3. กรอกข้อมูล</h2>
          <p className="container note">{template.description}</p>
          <PromptBuilder key={`${goal}-${template.slug}`} template={template} />
        </>
      )}
    </>
  );
}
