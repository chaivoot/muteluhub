import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'สถานที่เสริมดวงในไทย', description: 'วัด ศาลเจ้า เทวาลัย ทั่วไทย แยกตามเรื่องที่อยากขอพร' };

export default function Page() {
  return (
    <main>
      <PageHeader title="สถานที่เสริมดวงในไทย" />
      <ComingSoon>
        <p>วัด ศาลเจ้า เทวาลัย ทั่วไทย พร้อมเวลาเปิด ของไหว้ วิธีขอพรและแก้บน</p>
      </ComingSoon>
    </main>
  );
}
