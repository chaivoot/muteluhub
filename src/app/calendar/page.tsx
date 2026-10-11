import type { Metadata } from 'next';
import { CalendarPage } from './CalendarPage';

export const metadata: Metadata = {
  alternates: { canonical: '/calendar' },
  title: 'ปฏิทินมงคล วันดี วันธงชัย',
  description: 'ปฏิทินวันดีตามวันธงชัย อธิบดี อุบาทว์ โลกาวินาศ สำหรับแต่งงาน ขึ้นบ้านใหม่ เปิดร้าน ออกรถ พร้อมวันจันทรคติ',
};

// วันนี้เปลี่ยนทุกวัน
export const revalidate = 3600;

export default function Page() {
  return <CalendarPage event="wedding" title="ปฏิทินมงคล" />;
}
