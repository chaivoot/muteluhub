'use client';

import { track } from '@/lib/analytics';
import { UiIcon } from './icons';

/**
 * บล็อกที่พัก Agoda ในเนื้อหา (ไม่ใช่แบนเนอร์) พร้อมป้าย ลิงก์ affiliate
 * near = ลิงก์พาไปที่พักรอบสถานที่ (มี poi) ไม่งั้นเป็นที่พักทั้งเมือง/จังหวัด
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
          rel="sponsored nofollow noopener noreferrer"
          className="btn btn--gold btn--sm"
          onClick={() => track('click_affiliate', { slug })}
        >
          ดูที่พักบน Agoda
        </a>
        <span className="affiliate-label">ลิงก์ affiliate</span>
      </div>
    </section>
  );
}
