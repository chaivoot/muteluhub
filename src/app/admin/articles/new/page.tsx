import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FESTIVALS } from '@/data/festivals';
import { isAdmin } from '@/lib/admin-auth';
import { ArticleEditor } from '../ArticleEditor';

export default async function NewArticlePage() {
  if (!(await isAdmin())) redirect('/admin');
  return (
    <main className="container admin__main">
      <p className="note">
        <Link href="/admin/articles">‹ บทความทั้งหมด</Link>
      </p>
      <h1 className="admin__title">เขียนบทความใหม่</h1>
      <ArticleEditor initial={null} festivals={FESTIVALS.map((f) => ({ slug: f.slug, name: f.name }))} />
    </main>
  );
}
