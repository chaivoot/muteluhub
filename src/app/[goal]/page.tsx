import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';
import { GoalIcon } from '@/components/icons';
import { PlacesForGoal } from '@/components/PlacesForGoal';
import { PromptCard } from '@/components/PromptCard';
import { SectionHeader } from '@/components/SectionHeader';
import { GOALS, getGoal, isGoalSlug } from '@/lib/goals';
import { thaiPlaces } from '@/lib/places';
import { listPublishedPlaces } from '@/lib/places-repo';
import { filterTellers } from '@/lib/tellers';
import { listPublishedTellers } from '@/lib/tellers-repo';
import { TellerCard } from '@/components/TellerCard';
import { recommendedForGoal } from '@/lib/prompts';

// ไม่ตั้ง dynamicParams = false: หลัง revalidateTag (นำเข้าข้อมูล) Next 15 จะตอบ 404 กับหน้าที่ prerender ไว้
// slug ที่ไม่ใช่เป้าหมายจะถูก notFound() ด้านล่างแทน
export const revalidate = 3600;

export function generateStaticParams() {
  return GOALS.map((g) => ({ goal: g.slug }));
}

type Params = Promise<{ goal: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { goal } = await params;
  if (!isGoalSlug(goal)) return {};
  const g = getGoal(goal);
  return {
    alternates: { canonical: `/${goal}` },
    title: `เสริม${g.short}`,
    description: `รวมสีเสื้อ เลขมงคล สถานที่ หมอดู และของเสริมด้าน${g.name}`,
  };
}

export default async function GoalPage({ params }: { params: Params }) {
  const { goal } = await params;
  if (!isGoalSlug(goal)) notFound();
  const g = getGoal(goal);
  const [places, tellers] = await Promise.all([listPublishedPlaces(), listPublishedTellers()]);
  const goalTellers = filterTellers({ goal: g.slug }, tellers).slice(0, 3);

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
        <p>หน้านี้จะรวมสีเสื้อมงคลด้าน{g.short} ของเสริม และฤกษ์ที่เกี่ยวข้อง</p>
      </ComingSoon>
      <PlacesForGoal places={thaiPlaces(places)} goal={g.slug} />
      {goalTellers.length > 0 && (
        <section>
          <SectionHeader title={`หมอดูที่ถนัดเรื่อง${g.short}`} href={`/fortune-tellers?goal=${g.slug}`} />
          <div className="stack container">
            {goalTellers.map((t) => (
              <TellerCard key={t.slug} teller={t} />
            ))}
          </div>
        </section>
      )}
      <SectionHeader title={`ถาม AI เรื่อง${g.short}`} href={`/ai-prompts/${g.slug}`} />
      <div className="stack container">
        {recommendedForGoal(g.slug).map((t) => (
          <PromptCard key={t.slug} template={t} />
        ))}
      </div>
    </main>
  );
}
