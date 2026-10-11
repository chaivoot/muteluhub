import Link from 'next/link';
import type { ReactNode } from 'react';

export function SectionHeader({ title, href, aside }: { title: string; href?: string; aside?: ReactNode }) {
  return (
    <div className="section-header">
      <h2 className="section-header__title">{title}</h2>
      {href && (
        <Link href={href} className="section-header__link">
          ดูทั้งหมด
        </Link>
      )}
      {aside}
    </div>
  );
}
