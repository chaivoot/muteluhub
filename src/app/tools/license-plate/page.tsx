import type { Metadata } from 'next';
import { PageHeader } from '@/components/ComingSoon';
import { LicensePlateTool } from '@/components/LicensePlateTool';

export const metadata: Metadata = {
  alternates: { canonical: '/tools/license-plate' },
  title: 'เช็กทะเบียนรถมงคล ผลรวมทะเบียน และอักษรตามวันเกิด',
  description: 'เช็กทะเบียนรถว่ามงคลไหม ดูผลรวมทะเบียน ความหมายคู่เลข และอักษรกาลกิณีตามวันเกิด ก่อนจองหรือประมูลทะเบียน',
};

export default function LicensePlatePage() {
  return (
    <main>
      <PageHeader title="เช็กทะเบียนรถมงคล" />
      <div className="prose intro">
        <p>พิมพ์ทะเบียนรถ เลือกวันเกิดและเรื่องที่อยากเสริม แล้วดูผลรวมทะเบียน ความหมาย และอักษรที่ควรเลี่ยงตามวันเกิดของคุณ</p>
      </div>
      <LicensePlateTool />
    </main>
  );
}
