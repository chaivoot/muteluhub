import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';
import { GoalIcon } from '@/components/icons';
import { PromptCard } from '@/components/PromptCard';
import { SectionHeader } from '@/components/SectionHeader';
import { GOALS, getGoal, isGoalSlug } from '@/lib/goals';
import { recommendedForGoal } from '@/lib/prompts';

export const dynamicParams = false;

export function generateStaticParams() {
  return GOALS.map((g) => ({ goal: g.slug }));
}

type Params = Promise<{ goal: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { goal } = await params;
  if (!isGoalSlug(goal)) return {};
  const g = getGoal(goal);
  return {
    title: `เสริม${g.short}`,
    description: `รวมสีเสื้อ เลขมงคล สถานที่ หมอดู และของเสริมด้าน${g.name}`,
  };
}

export default async function GoalPage({ params }: { params: Params }) {
  const { goal } = await params;
  if (!isGoalSlug(goal)) notFound();
  const g = getGoal(goal);

  return (
    <main>
      <PageHeader title={`เสริม${g.short}`} />
      <div
        className="goal-hero"
        style={{ '--goal': g.color, '--goal-bg': g.chipBg, '--goal-border': g.chipBorder } as CSSProperties}
      >
        <span className="goal-hero__icon">
          <GoalIcon slug={g.slug} size={28} />
        </span>
        <h2 className="goal-hero__title">{g.name}</h2>
      </div>
      <ComingSoon>
        <p>หน้านี้จะรวมสีเสื้อและเลขมงคลด้าน{g.short} สถานที่ขอพร หมอดูที่ถนัด ของเสริม และฤกษ์ที่เกี่ยวข้อง</p>
      </ComingSoon>
      <SectionHeader title={`ถาม AI เรื่อง${g.short}`} href={`/ai-prompts/${g.slug}`} />
      <div className="stack container">
        {recommendedForGoal(g.slug).map((t) => (
          <PromptCard key={t.slug} template={t} />
        ))}
      </div>
    </main>
  );
}
