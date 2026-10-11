import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/admin-auth';
import { ImportForm } from './ImportForm';

export default async function ImportPage() {
  if (!(await isAdmin())) redirect('/admin');
  return (
    <main className="container admin__main">
      <div className="admin__head">
        <h1 className="admin__title">นำเข้าสถานที่</h1>
        <Link href="/admin" className="btn btn--outline btn--sm">
          กลับ
        </Link>
      </div>
      <p className="note">
        slug ที่มีอยู่แล้วจะถูกเขียนทับทั้งรายการ · ตั้ง published เป็น false เพื่อซ่อนไว้ตรวจก่อน · รูปแบบดูที่ docs/import-format.md
      </p>
      <ImportForm />
    </main>
  );
}
