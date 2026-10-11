'use client';

import { useEffect, useMemo, useState } from 'react';
import { PROMPT_TEMPLATES } from '@/data/prompt-templates';
import { getDiscipline } from '@/lib/disciplines';
import type { GoalSlug } from '@/lib/goals';
import { filterTemplates } from '@/lib/prompts';
import { GoalChips } from './GoalChips';
import { PromptCard } from './PromptCard';
import { useGoal } from './goal-context';

const DISCIPLINE_OPTIONS = [
  ...new Set(PROMPT_TEMPLATES.map((t) => t.discipline).filter((d): d is string => d !== null)),
].map((slug) => ({ value: slug, label: getDiscipline(slug)?.name ?? slug }));

/** คลัง prompt กรองตามเป้าหมาย (บนสุด) + ศาสตร์ เริ่มจากเป้าหมายที่ผู้ใช้เลือกไว้ */
export function PromptLibrary() {
  const { goal: remembered } = useGoal();
  const [goal, setGoal] = useState<GoalSlug | null>(null);
  const [touched, setTouched] = useState(false);
  const [discipline, setDiscipline] = useState('');

  useEffect(() => {
    if (!touched && remembered) setGoal(remembered);
  }, [remembered, touched]);

  const results = useMemo(() => filterTemplates({ goal, discipline: discipline || null }), [goal, discipline]);

  return (
    <>
      <GoalChips
        value={goal}
        onChange={(g) => {
          setTouched(true);
          setGoal(g);
        }}
      />
      <div className="filter-bar container">
        <span className="filter-bar__count">{results.length} prompt</span>
        <label className="select-wrap">
          <span className="visually-hidden">ศาสตร์</span>
          <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="select">
            <option value="">ทุกศาสตร์</option>
            <option value="general">ทั่วไป (ไม่ผูกศาสตร์)</option>
            {DISCIPLINE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="stack container">
        {results.map((t) => (
          <PromptCard key={t.slug} template={t} />
        ))}
        {results.length === 0 && <p className="note">ยังไม่มี prompt ตามตัวกรองนี้</p>}
      </div>
    </>
  );
}
