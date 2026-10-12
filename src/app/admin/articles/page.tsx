import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FESTIVALS } from '@/data/festivals';
import { isAdmin } from '@/lib/admin-auth';
import { adminListArticles, getFestivalCovers } from '@/lib/articles-repo';
import { hasDatabase } from '@/lib/db';
import { AdminNav } from '../AdminNav';
import { FestivalCoverForm } from './FestivalCoverForm';

function dateTime(iso: string) {
  return new Date(iso).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'medium', timeStyle: 'short' });
}

export default async function AdminArticlesPage() {
  if (!hasDatabase() || !(await isAdmin())) redirect('/admin');
  const [articles, covers] = await Promise.all([adminListArticles(), getFestivalCovers()]);
  return (
    <main className="container admin__main">
      <h1 className="admin__title">หลังบ้าน</h1>
      <AdminNav current="articles" />

      <div className="actions actions--wrap">
        <Link href="/admin/articles/new" className="btn btn--gold">
          เขียนบทความใหม่
        </Link>
      </div>
      <ul className="admin-list">
        {articles.map((a) => (
          <li key={a.slug} className="admin-item">
            {a.cover ? (
              <img src={a.cover.src} alt="" className="admin-item__thumb" />
            ) : (
              <span className="admin-item__thumb admin-item__thumb--missing">ไม่มีภาพ</span>
            )}
            <div className="admin-item__main">
              <div className="admin-item__name">
                <Link href={`/admin/articles/${a.slug}`}>{a.title}</Link>
              </div>
              <div className="note">
                {a.slug} · แก้ไข {dateTime(a.updatedAt)}
                {a.publishedAt ? ` · เผยแพร่ ${dateTime(a.publishedAt)}` : ''}
              </div>
            </div>
            <div className="admin-item__actions">
              <span className={a.published ? 'pill pill--gold' : 'tag'}>{a.published ? 'เผยแพร่' : 'ฉบับร่าง'}</span>
              {a.published && (
                <Link href={`/articles/${a.slug}`} target="_blank" className="btn btn--outline btn--sm">
                  ดูหน้าจริง
                </Link>
              )}
            </div>
          </li>
        ))}
        {articles.length === 0 && <li className="note">ยังไม่มีบทความ กดเขียนบทความใหม่เพื่อเริ่ม</li>}
      </ul>

      <h2 className="admin__subtitle">รูปปกหน้าเทศกาล</h2>
      <p className="note">อัปโหลดรูปใหม่แทนรูปเดิมของหน้าเทศกาลได้ (ภาพ AI ใช้ได้เป็นภาพบรรยากาศ ใส่เครดิตว่า ภาพประกอบ)</p>
      <ul className="admin-list">
        {FESTIVALS.map((f) => {
          const db = covers[f.slug];
          const code = f.image ? { src: f.image.src, alt: f.image.alt, credit: f.image.credit } : null;
          return <FestivalCoverForm key={f.slug} slug={f.slug} name={f.name} current={db ?? code} fromDb={Boolean(db)} />;
        })}
      </ul>
    </main>
  );
}
