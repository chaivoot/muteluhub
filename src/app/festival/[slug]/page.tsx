import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';
import { FESTIVALS } from '@/data/festivals';
import { currentFestivalDate, getFestival } from '@/lib/festivals';
import { bangkokDay, formatThaiRange, parseIsoDay, TH_MONTHS_SHORT, toBuddhistYear } from '@/lib/thai-date';

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return FESTIVALS.map((f) => ({ slug: f.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const festival = getFestival(slug);
  if (!festival) return {};
  const date = currentFestivalDate(festival, bangkokDay().iso);
  // URL ไม่มีปี แต่ใส่ปีใน title ได้
  const year = date ? ` ${toBuddhistYear(date.year)}` : '';
  return { title: `${festival.name}${year}`, description: festival.tagline };
}

export default async function FestivalPage({ params }: { params: Params }) {
  const { slug } = await params;
  const festival = getFestival(slug);
  if (!festival) notFound();
  const date = currentFestivalDate(festival, bangkokDay().iso);
  const prep = date?.prep ? parseIsoDay(date.prep) : null;

  return (
    <main>
      <PageHeader title={festival.name} />
      {date && (
        <div className="prose">
          <p>
            <span className="pill pill--gold">{formatThaiRange(date.start, date.end, true)}</span>
          </p>
          {prep && <p>เตรียมตัว: {prep.day} {TH_MONTHS_SHORT[prep.month - 1]} {date.notes ? `(${date.notes})` : ''}</p>}
        </div>
      )}
      <ComingSoon>
        <p>{festival.tagline}</p>
      </ComingSoon>
    </main>
  );
}
