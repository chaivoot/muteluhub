import Link from 'next/link';
import { SiteHeader } from './SiteHeader';
import { Fragment, type ReactNode } from 'react';

/** label ของหน้าแม่สำหรับ breadcrumb */
const PARENT_LABELS: Record<string, string> = {
  '/places': 'สถานที่เสริมดวง',
  '/fortune-tellers': 'หมอดู',
  '/abroad': 'มูต่างประเทศ',
  '/ai-prompts': 'ดูดวงด้วย AI',
};

/** breadcrumb เริ่มที่หน้าแรกเสมอ items = ชั้นถัดไป (ไม่รวมหน้าปัจจุบัน) */
export function Breadcrumbs({ items, className }: { items: { href: string; label: string }[]; className?: string }) {
  return (
    <nav aria-label="breadcrumb" className={className ? `crumbs ${className}` : 'crumbs'}>
      <Link href="/">หน้าแรก</Link>
      {items.map((it) => (
        <Fragment key={it.href}>
          <span aria-hidden="true">›</span>
          <Link href={it.href}>{it.label}</Link>
        </Fragment>
      ))}
    </nav>
  );
}

/** header ของทุกหน้าย่อย: แถบเว็บ (โลโก้ + เมนู) แล้วตามด้วย breadcrumb และชื่อหน้า */
export function PageHeader({
  title,
  backHref = '/',
  asHeading = true,
}: {
  title: string;
  /** หน้าแม่ใน breadcrumb ('/' = ไม่มีชั้นกลาง) */
  backHref?: string;
  /** false เมื่อหน้ามี h1 ของตัวเอง (เช่นโปรไฟล์หมอดู) แสดงแค่ breadcrumb */
  asHeading?: boolean;
}) {
  const parent = backHref !== '/' ? (PARENT_LABELS[backHref] ?? null) : null;
  return (
    <>
      <SiteHeader />
      <div className="page-header">
        <Breadcrumbs items={parent ? [{ href: backHref, label: parent }] : []} />
        {asHeading && <h1 className="page-header__title">{title}</h1>}
      </div>
    </>
  );
}

/** หน้าที่ยังไม่ได้ทำ (ตามลำดับงานใน spec ข้อ 7) */
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
