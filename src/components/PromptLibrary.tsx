'use client';

import { useMemo, useState } from 'react';
import { PROMPT_TEMPLATES } from '@/data/prompt-templates';
import { getDiscipline } from '@/lib/disciplines';
import type { GoalSlug } from '@/lib/goals';
import { filterTemplates } from '@/lib/prompts';
import { GoalChips } from './GoalChips';
import { PromptCard } from './PromptCard';

const DISCIPLINE_OPTIONS = [
  ...new Set(PROMPT_TEMPLATES.map((t) => t.discipline).filter((d): d is string => d !== null)),
].map((slug) => ({ value: slug, label: getDiscipline(slug)?.name ?? slug }));

/** คลัง prompt กรองตามเป้าหมาย (บนสุด) + ศาสตร์ เริ่มที่ทั้งหมดเสมอ (ไม่ใช้เป้าหมายที่จำไว้ กันกดพลาดแล้วติดตัวกรอง) */
export function PromptLibrary() {
  const [goal, setGoal] = useState<GoalSlug | null>(null);
  const [discipline, setDiscipline] = useState('');

  const results = useMemo(() => filterTemplates({ goal, discipline: discipline || null }), [goal, discipline]);

  return (
    <>
      <GoalChips
        value={goal}
        onChange={(g) => {
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
