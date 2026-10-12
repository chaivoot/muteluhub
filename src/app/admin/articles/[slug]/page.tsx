import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { FESTIVALS } from '@/data/festivals';
import { isAdmin } from '@/lib/admin-auth';
import { getArticleForAdmin } from '@/lib/articles-repo';
import { DeleteButton } from '../../DeleteButton';
import { deleteArticleAction } from '../actions';
import { ArticleEditor } from '../ArticleEditor';

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) redirect('/admin');
  const { slug } = await params;
  const article = await getArticleForAdmin(slug);
  if (!article) notFound();
  return (
    <main className="container admin__main">
      <p className="note">
        <Link href="/admin/articles">‹ บทความทั้งหมด</Link>
      </p>
      <h1 className="admin__title">แก้บทความ</h1>
      <ArticleEditor initial={article} festivals={FESTIVALS.map((f) => ({ slug: f.slug, name: f.name }))} />
      <form action={deleteArticleAction} className="actions">
        <input type="hidden" name="slug" value={article.slug} />
        <DeleteButton name={article.title} message={`ลบบทความ "${article.title}"? ลบแล้วกู้คืนไม่ได้`} />
      </form>
    </main>
  );
}
