import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'ปฏิทินมงคล', description: 'ฤกษ์ดีตามประเภทงาน แต่งงาน ขึ้นบ้านใหม่ เปิดร้าน ออกรถ' };

export default function Page() {
  return (
    <main>
      <PageHeader title="ปฏิทินมงคล" />
      <ComingSoon>
        <p>ฤกษ์ดีตามประเภทงาน เช่น แต่งงาน ขึ้นบ้านใหม่ เปิดร้าน ออกรถ</p>
      </ComingSoon>
    </main>
  );
}
