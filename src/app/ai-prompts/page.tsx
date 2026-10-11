import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ComingSoon';
import { PromptLibrary } from '@/components/PromptLibrary';

export const metadata: Metadata = {
  title: 'prompt ดูดวงด้วย AI',
  description: 'คลัง prompt ดูดวงสำหรับ ChatGPT, Claude, Gemini แยกตามเรื่องที่อยากเสริมและศาสตร์ คัดลอกไปใช้ได้ทันที',
};

export default function AiPromptsPage() {
  return (
    <main>
      <PageHeader title="ดูดวงด้วย AI" />
      <div className="prose intro">
        <p>คัดลอก prompt ไปใช้กับ ChatGPT, Claude หรือ Gemini ได้เลย ทุก prompt ให้ AI ตีความจากข้อมูลที่คุณให้เท่านั้น ไม่ให้เดาเอง</p>
        <p>
          <Link href="/tools/prompt-generator">สร้าง prompt ทีละขั้น</Link>
        </p>
      </div>
      <PromptLibrary />
    </main>
  );
}
