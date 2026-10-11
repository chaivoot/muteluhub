import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ComingSoon';
import { PromptCard } from '@/components/PromptCard';
import { GOALS, getGoal, isGoalSlug } from '@/lib/goals';
import { filterTemplates } from '@/lib/prompts';

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
    title: `prompt ดูดวง${g.short}ด้วย AI`,
    description: `prompt ดูดวงเรื่อง${g.name} สำหรับ ChatGPT, Claude, Gemini คัดลอกไปใช้ได้ทันที`,
  };
}

export default async function AiPromptsGoalPage({ params }: { params: Params }) {
  const { goal } = await params;
  if (!isGoalSlug(goal)) notFound();
  const g = getGoal(goal);
  const templates = filterTemplates({ goal });

  return (
    <main>
      <PageHeader title={`ดูดวง${g.short}ด้วย AI`} backHref="/ai-prompts" />
      <div className="prose intro">
        <p>prompt สำหรับเรื่อง{g.name} คัดลอกไปใช้กับ AI ที่คุณใช้อยู่ได้เลย</p>
      </div>
      <div className="stack container">
        {templates.map((t) => (
          <PromptCard key={t.slug} template={t} />
        ))}
      </div>
      <div className="prose intro">
        <p>
          <Link href="/ai-prompts">ดู prompt ทั้งหมด</Link>
        </p>
      </div>
    </main>
  );
}
