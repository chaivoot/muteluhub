import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'สีเสื้อมงคลวันนี้', description: 'สีเสื้อมงคลประจำวันตามเรื่องที่อยากเสริม พร้อมสีที่ควรเลี่ยง' };

export default function Page() {
  return (
    <main>
      <PageHeader title="สีเสื้อมงคลวันนี้" />
      <ComingSoon>
        <p>สีเสื้อมงคลทุกเป้าหมายของวันนี้ สีที่ควรเลี่ยง และการ์ดสำหรับแชร์</p>
      </ComingSoon>
    </main>
  );
}
