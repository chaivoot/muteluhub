import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';
import { TellersBrowser } from '@/components/TellersBrowser';
import { DISCIPLINES } from '@/lib/disciplines';
import { listPublishedTellers } from '@/lib/tellers-repo';

export const metadata: Metadata = {
  alternates: { canonical: '/fortune-tellers' },
  title: 'หมอดู',
  description: 'รวมหมอดูแยกตามศาสตร์และเรื่องที่ถนัด กรองตามช่องทาง จังหวัด และราคา',
};

export const revalidate = 3600;

export default async function FortuneTellersPage() {
  const tellers = await listPublishedTellers();
  if (tellers.length === 0) {
    return (
      <main>
        <PageHeader title="หมอดู" />
        <ComingSoon>
          <p>รายชื่อหมอดูกรองตามเรื่องที่อยากเสริม ศาสตร์ ช่องทาง จังหวัด และราคา</p>
        </ComingSoon>
      </main>
    );
  }
  const used = new Set(tellers.flatMap((t) => t.disciplines));
  return (
    <main>
      <PageHeader title="หมอดู" />
      <Suspense>
        <TellersBrowser tellers={tellers} />
      </Suspense>
      <section className="container">
        <div className="section-header section-header--flush">
          <h2 className="section-header__title">ดูตามศาสตร์</h2>
        </div>
        <ul className="chip-row chip-row--wrap">
          {DISCIPLINES.filter((d) => used.has(d.slug)).map((d) => (
            <li key={d.slug}>
              <Link href={`/fortune-tellers/${d.slug}`} className="chip">
                {d.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
