import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { isDirectoryKind, kindLabel } from '@/lib/admin-kinds';
import type { DirectoryKind } from '@/lib/directory-repo';
import { ImportForm } from './ImportForm';

export default async function ImportPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  if (!(await isAdmin())) redirect('/admin');
  const { kind: k } = await searchParams;
  const kind: DirectoryKind = isDirectoryKind(k) ? k : 'places';
  return (
    <main className="container admin__main">
      <div className="admin__head">
        <h1 className="admin__title">นำเข้า{kindLabel(kind)}</h1>
        <Link href={`/admin?tab=${kind}`} className="btn btn--outline btn--sm">
          กลับ
        </Link>
      </div>
      <p className="note">
        slug ที่มีอยู่แล้วจะถูกเขียนทับทั้งรายการ · ตั้ง published เป็น false เพื่อซ่อนไว้ตรวจก่อน · รูปแบบดูที่ docs/import-format.md
      </p>
      <ImportForm kind={kind} />
    </main>
  );
}
