import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ComingSoon';
import { PromptBuilder } from '@/components/PromptBuilder';
import { PROMPT_TEMPLATES } from '@/data/prompt-templates';
import { getPromptTemplate } from '@/lib/prompts';

export const dynamicParams = false;

export function generateStaticParams() {
  return PROMPT_TEMPLATES.map((t) => ({ slug: t.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const t = getPromptTemplate(slug);
  return t ? { title: t.title, description: t.description } : {};
}

export default async function PromptPage({ params }: { params: Params }) {
  const { slug } = await params;
  const template = getPromptTemplate(slug);
  if (!template) notFound();

  return (
    <main>
      <PageHeader title={template.title} backHref="/ai-prompts" />
      <div className="prose intro">
        <p>{template.description}</p>
      </div>
      {/* ค่าที่เติมจาก query string อ่านฝั่ง client เท่านั้น */}
      <Suspense>
        <PromptBuilder template={template} />
      </Suspense>
    </main>
  );
}
