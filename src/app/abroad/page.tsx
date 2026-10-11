import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'มูต่างประเทศ', description: 'คู่มือทริปสายมูต่างประเทศ' };

export default function Page() {
  return (
    <main>
      <PageHeader title="มูต่างประเทศ" />
      <ComingSoon>
        <p>คู่มือทริปสายมูแยกตามประเทศ พร้อมสถานที่และที่พักใกล้ ๆ</p>
      </ComingSoon>
    </main>
  );
}
