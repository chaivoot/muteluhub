'use client';

import { track } from '@/lib/analytics';
import { UiIcon } from './icons';

/**
 * บล็อกที่พัก Traveloka (ผ่าน Involve Asia) ในเนื้อหา ไม่ใช่แบนเนอร์ พร้อมป้าย ลิงก์ affiliate
 * href มาจาก lodgingLink() ใน src/lib/booking.ts
 */
export function LodgingBlock({
  href,
  title,
  note,
  slug,
}: {
  href: string;
  title: string;
  note: string;
  slug?: string;
}) {
  return (
    <section className="lodging" aria-label="ที่พัก">
      <div className="lodging__head">
        <span className="lodging__icon">
          <UiIcon name="bed" size={22} />
        </span>
        <div className="lodging__text">
          <h2 className="lodging__title">{title}</h2>
          <p className="lodging__note">{note}</p>
        </div>
      </div>
      <div className="lodging__row">
        <a
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="btn btn--gold btn--sm"
          onClick={() => track('booking_click', { slug })}
        >
          ค้นหาที่พักใกล้ ๆ บน Traveloka
        </a>
        <span className="affiliate-label">ลิงก์ affiliate</span>
      </div>
      <p className="lodging__disclosure">เว็บได้ค่าคอมมิชชันเมื่อจองผ่านลิงก์นี้ ราคาที่คุณจ่ายเท่าเดิม</p>
    </section>
  );
}
