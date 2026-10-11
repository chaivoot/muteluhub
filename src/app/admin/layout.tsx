import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'หลังบ้าน',
  robots: { index: false, follow: false },
};

// หลังบ้านอ่านข้อมูลสดทุกครั้ง ไม่ cache
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin">{children}</div>;
}
