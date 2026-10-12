/**
 * Analytics แบบไม่เก็บข้อมูลส่วนตัว (addendum 01 ข้อ 10)
 * props รับเฉพาะ slug / goal / discipline ตาม type ห้ามส่งค่าที่ผู้ใช้กรอก (วันเกิด คำถาม ไพ่)
 * ยังไม่ได้เลือกผู้ให้บริการ: ตอนนี้ push เข้า window.dataLayer ถ้ามี
 */
export type AnalyticsEvent = 'copy_prompt' | 'open_followup' | 'click_to_fortune_teller' | 'click_affiliate';

export interface AnalyticsProps {
  slug?: string;
  goal?: string;
  discipline?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === 'undefined') return;
  const { slug, goal, discipline } = props; // ตัด key อื่นทิ้งเสมอ
  window.dataLayer?.push({ event, slug, goal, discipline });
}
