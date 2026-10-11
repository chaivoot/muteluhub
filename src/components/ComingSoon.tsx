import Link from 'next/link';
import type { ReactNode } from 'react';
import { UiIcon } from './icons';

/** หน้าที่ยังไม่ได้ทำ (ตามลำดับงานใน spec ข้อ 7) */
export function PageHeader({
  title,
  backHref = '/',
  asHeading = true,
}: {
  title: string;
  backHref?: string;
  /** false เมื่อหน้ามี h1 ของตัวเอง (เช่นโปรไฟล์หมอดู) */
  asHeading?: boolean;
}) {
  const Title = asHeading ? 'h1' : 'p';
  return (
    <div className="page-header">
      <Link href={backHref} className="icon-btn" aria-label="ย้อนกลับ">
        <UiIcon name="back" size={22} strokeWidth={2} />
      </Link>
      <Title className="page-header__title">{title}</Title>
    </div>
  );
}

export function ComingSoon({ title = 'กำลังเตรียมหน้านี้', children }: { title?: string; children?: ReactNode }) {
  return (
    <div className="coming-soon">
      <p className="coming-soon__title">{title}</p>
      {children && <div className="coming-soon__body">{children}</div>}
      <Link href="/" className="btn btn--outline">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
