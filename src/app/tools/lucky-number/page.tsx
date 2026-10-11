import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'เลขมงคลจากวันเกิด', description: 'คำนวณเลขมงคลจากวันเดือนปีเกิด ตามเรื่องที่อยากเสริม' };

export default function Page() {
  return (
    <main>
      <PageHeader title="เลขมงคลจากวันเกิด" />
      <ComingSoon>
        <p>กรอกวันเกิดและเลือกเรื่องที่อยากเสริม แล้วรับเลขมงคลของคุณ พร้อมบอกว่าใช้หลักคำนวณอะไร</p>
      </ComingSoon>
    </main>
  );
}
