import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ComingSoon';
import { ColorToday } from '@/components/ColorToday';
import { bangkokDay, formatThaiFullDate } from '@/lib/thai-date';

export const metadata: Metadata = {
  title: 'สีเสื้อมงคลวันนี้',
  description: 'สีเสื้อมงคลประจำวันตามหลักทักษา แยกตามเรื่องที่อยากเสริม การเงิน ความรัก การงาน พร้อมสีที่ควรเลี่ยง',
};

// เปลี่ยนตามวัน สร้างหน้าใหม่ทุก 10 นาที
export const revalidate = 600;

export default function ColorTodayPage() {
  const today = bangkokDay();
  return (
    <main>
      <PageHeader title="สีเสื้อมงคลวันนี้" />
      <Suspense>
        <ColorToday weekday={today.weekday} dateLabel={formatThaiFullDate(today)} />
      </Suspense>
    </main>
  );
}
