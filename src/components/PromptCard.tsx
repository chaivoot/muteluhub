import Link from 'next/link';
import type { PromptTemplate } from '@/data/prompt-templates';
import { getDiscipline } from '@/lib/disciplines';
import { GOALS, getGoal } from '@/lib/goals';
import { GoalTag } from './GoalTag';

export function PromptCard({ template }: { template: PromptTemplate }) {
  const discipline = template.discipline ? getDiscipline(template.discipline) : undefined;
  const allGoals = template.goals.length === GOALS.length;
  return (
    <Link href={`/ai-prompts/p/${template.slug}`} className="prompt-card">
      <span className="prompt-card__title">{template.title}</span>
      <span className="tag-row">
        <span className="tag tag--discipline">{discipline?.name ?? 'ทั่วไป'}</span>
        {allGoals ? (
          <span className="tag">ทุกเป้าหมาย</span>
        ) : (
          template.goals.map((g) => <GoalTag key={g} goal={getGoal(g)} />)
        )}
      </span>
      <span className="prompt-card__desc">{template.description}</span>
    </Link>
  );
}
