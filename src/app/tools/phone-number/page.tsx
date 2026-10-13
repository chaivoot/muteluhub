import type { Metadata } from 'next';
import { PageHeader } from '@/components/ComingSoon';
import { PhoneNumberTool } from '@/components/PhoneNumberTool';
import { PHONE_METHOD } from '@/lib/phone-number';

export const metadata: Metadata = {
  alternates: { canonical: '/tools/phone-number' },
  title: 'เช็กเบอร์มงคล ความหมายคู่เลข และคู่เลขตามวันเกิด',
  description: `เช็กเบอร์โทรว่ามงคลไหมด้วยหลัก ${PHONE_METHOD.name} ดูความหมายทีละคู่ และคู่เลขที่แนะนำตามวันเกิดและเรื่องที่อยากเสริม`,
};

export default function PhoneNumberPage() {
  return (
    <main>
      <PageHeader title="เช็กเบอร์มงคล" />
      <div className="prose intro">
        <p>ใส่เบอร์โทร เลือกวันเกิดและเรื่องที่อยากเสริม แล้วดูว่าเบอร์นี้เด่นเรื่องไหน หรือดูคู่เลขที่เหมาะกับคุณก่อนหาเบอร์ใหม่</p>
      </div>
      <PhoneNumberTool />
    </main>
  );
}
