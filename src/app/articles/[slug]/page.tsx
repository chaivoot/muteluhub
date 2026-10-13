import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ComingSoon';
import { CreditBadge } from '@/components/CreditBadge';
import { GoalTag } from '@/components/GoalTag';
import { TextSizeToggle } from '@/components/TextSizeToggle';
import { SiteHeader } from '@/components/SiteHeader';
import { getFestival } from '@/lib/festivals';
import { getGoal } from '@/lib/goals';
import { listPublishedArticles } from '@/lib/articles-repo';
import { Markdown } from '@/lib/markdown';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { parseIsoDay, TH_MONTHS, toBuddhistYear } from '@/lib/thai-date';

// บทความมาจากฐานข้อมูล (เขียนที่ /admin/articles) ไม่ตั้ง dynamicParams = false
export const revalidate = 600;

type Params = Promise<{ slug: string }>;

async function findArticle(slug: string) {
  return (await listPublishedArticles()).find((a) => a.slug === slug);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = await findArticle(slug);
  if (!a) return {};
  return {
    alternates: { canonical: `/articles/${a.slug}` },
    title: a.seoTitle ?? a.title,
    description: a.excerpt.slice(0, 160),
    openGraph: {
      type: 'article',
      title: a.title,
      description: a.excerpt,
      images: a.cover ? [{ url: `${SITE_URL}${a.cover.src}`, alt: a.cover.alt }] : undefined,
    },
  };
}

const thaiDate = (iso: string) => {
  const d = parseIsoDay(new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }));
  return `${d.day} ${TH_MONTHS[d.month - 1]} ${toBuddhistYear(d.year)}`;
};

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const a = await findArticle(slug);
  if (!a) notFound();
  const festival = a.festival ? getFestival(a.festival) : undefined;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.excerpt,
    image: a.cover ? `${SITE_URL}${a.cover.src}` : undefined,
    datePublished: a.publishedAt ?? undefined,
    dateModified: a.updatedAt,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/articles/${a.slug}`,
  };

  return (
    <main className="place">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <div className="fest-hero">
        {a.cover ? (
          <img src={a.cover.src} alt={a.cover.alt} className="festival-card__img" />
        ) : (
          <span className="festival-card__art" aria-hidden="true" />
        )}
        <span className="fest-hero__scrim" aria-hidden="true" />
        {a.cover && <CreditBadge credit={a.cover.credit} position="top-right" />}
        <div className="fest-hero__text">
          <h1 className="place-hero__name">{a.title}</h1>
        </div>
      </div>
      <div className="container place__body">
        <Breadcrumbs items={[{ href: '/festival', label: 'เทศกาลและบทความ' }]} />
        <p className="note">{a.publishedAt ? `เผยแพร่ ${thaiDate(a.publishedAt)}` : null}</p>
        {a.goals.length > 0 && (
          <div className="tag-row">
            {a.goals.map((g) => (
              <GoalTag key={g} goal={getGoal(g)} />
            ))}
          </div>
        )}
        <TextSizeToggle />
        <div className="reading">
          <Markdown source={a.body} />
        </div>
        {festival && (
          <p>
            <Link href={`/festival/${festival.slug}`} className="btn btn--outline">
              ดูหน้า{festival.name}
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
