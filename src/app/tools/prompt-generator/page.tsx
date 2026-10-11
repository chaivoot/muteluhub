import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ComingSoon';
import { PromptGenerator } from '@/components/PromptGenerator';

export const metadata: Metadata = {
  alternates: { canonical: '/tools/prompt-generator' },
  title: 'สร้าง prompt ดูดวง',
  description: 'เลือกเรื่องที่อยากเสริม เลือกศาสตร์ กรอกข้อมูล แล้วได้ prompt ดูดวงพร้อมใช้กับ AI',
};

export default function PromptGeneratorPage() {
  return (
    <main>
      <PageHeader title="สร้าง prompt ดูดวง" />
      <div className="prose intro">
        <p>AI ตีความได้ดี แต่ผูกดวงเองไม่แม่น prompt ที่นี่จึงส่งข้อมูลที่มีอยู่แล้วให้ AI ตีความ</p>
      </div>
      <Suspense>
        <PromptGenerator />
      </Suspense>
    </main>
  );
}
