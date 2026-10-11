import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'หมอดู', description: 'รวมหมอดูแยกตามศาสตร์และเรื่องที่ถนัด' };

export default function Page() {
  return (
    <main>
      <PageHeader title="หมอดู" />
      <ComingSoon>
        <p>รายชื่อหมอดูกรองตามเรื่องที่อยากเสริม ศาสตร์ ช่องทาง จังหวัด และราคา</p>
      </ComingSoon>
    </main>
  );
}
