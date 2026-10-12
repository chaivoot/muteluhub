import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';
import { DisciplineNav } from '@/components/DisciplineNav';
import { TellersBrowser } from '@/components/TellersBrowser';
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
  return (
    <main>
      <PageHeader title="หมอดู" />
      <Suspense>
        <TellersBrowser tellers={tellers} belowGoals={<DisciplineNav tellers={tellers} />} />
      </Suspense>
    </main>
  );
}
