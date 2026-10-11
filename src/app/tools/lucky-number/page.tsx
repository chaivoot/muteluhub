import type { Metadata } from 'next';
import { PageHeader } from '@/components/ComingSoon';
import { LuckyNumberTool } from '@/components/LuckyNumberTool';
import { LUCKY_NUMBER_METHOD } from '@/lib/lucky-number';

export const metadata: Metadata = {
  alternates: { canonical: '/tools/lucky-number' },
  title: 'เลขมงคลจากวันเกิด',
  description: `คำนวณเลขมงคลจากวันเดือนปีเกิด ตามเรื่องที่อยากเสริม ด้วยหลัก ${LUCKY_NUMBER_METHOD.name}`,
};

export default function LuckyNumberPage() {
  return (
    <main>
      <PageHeader title="เลขมงคลจากวันเกิด" />
      <div className="prose intro">
        <p>เลือกวันเกิดและเรื่องที่อยากเสริม แล้วดูเลขมงคลของคุณ คำนวณตามหลัก {LUCKY_NUMBER_METHOD.name}</p>
      </div>
      <LuckyNumberTool />
    </main>
  );
}
