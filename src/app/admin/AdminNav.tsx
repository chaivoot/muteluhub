import Link from 'next/link';
import type { DirectoryKind } from '@/lib/directory-repo';
import { ADMIN_KINDS } from '@/lib/admin-kinds';

/** แท็บหลังบ้าน: ข้อมูล directory + บทความ */
export function AdminNav({ current }: { current: DirectoryKind | 'articles' }) {
  return (
    <nav className="chip-row" aria-label="ประเภทข้อมูล">
      {ADMIN_KINDS.map((k) => (
        <Link key={k.kind} href={`/admin?tab=${k.kind}`} className="chip" aria-current={k.kind === current ? 'page' : undefined}>
          {k.label}
        </Link>
      ))}
      <Link href="/admin/articles" className="chip" aria-current={current === 'articles' ? 'page' : undefined}>
        บทความ
      </Link>
    </nav>
  );
}
