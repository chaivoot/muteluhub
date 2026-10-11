import Link from 'next/link';
import { PROVINCES } from '@/data/provinces';
import { adminConfigured, isAdmin } from '@/lib/admin-auth';
import { hasDatabase } from '@/lib/db';
import { getGoal } from '@/lib/goals';
import { adminListPlaces, recentImports } from '@/lib/places-repo';
import { deletePlaceAction, logoutAction, togglePublishedAction } from './actions';
import { DeleteButton } from './DeleteButton';
import { LoginForm } from './LoginForm';

const dateTime = (d: Date) =>
  d.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'medium', timeStyle: 'short' });

export default async function AdminPage() {
  if (!adminConfigured() || !hasDatabase()) {
    return (
      <main className="container admin__main">
        <h1 className="admin__title">หลังบ้าน MuteluHub</h1>
        <div className="coming-soon">
          <p className="coming-soon__title">ยังตั้งค่าไม่ครบ</p>
          <ul className="bullet-list">
            {!hasDatabase() && <li>ยังไม่ได้ต่อฐานข้อมูล: เพิ่ม Neon ใน Vercel (Storage) ให้ได้ env DATABASE_URL</li>}
            {!adminConfigured() && <li>ยังไม่ได้ตั้งรหัสผ่าน: ใส่ env ADMIN_PASSWORD (อย่างน้อย 8 ตัว) ใน Vercel</li>}
          </ul>
          <p className="note">ตั้งค่าแล้วต้อง Redeploy หนึ่งครั้ง</p>
        </div>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main className="container admin__main">
        <h1 className="admin__title">หลังบ้าน MuteluHub</h1>
        <LoginForm />
      </main>
    );
  }

  const [rows, imports] = await Promise.all([adminListPlaces(), recentImports(5)]);
  const publishedCount = rows.filter((r) => r.place.published).length;

  return (
    <main className="container admin__main">
      <div className="admin__head">
        <h1 className="admin__title">สถานที่ ({rows.length})</h1>
        <form action={logoutAction}>
          <button type="submit" className="btn btn--outline btn--sm">
            ออกจากระบบ
          </button>
        </form>
      </div>
      <p className="note">
        เผยแพร่แล้ว {publishedCount} · ซ่อนอยู่ {rows.length - publishedCount}
      </p>
      <div className="actions">
        <Link href="/admin/import" className="btn btn--gold">
          นำเข้า JSON
        </Link>
      </div>

      <ul className="admin-list">
        {rows.map(({ place, updatedAt }) => (
          <li key={place.slug} className="admin-item">
            <div className="admin-item__main">
              <div className="admin-item__name">
                {place.published ? (
                  <Link href={`/places/${place.slug}`} target="_blank">
                    {place.name}
                  </Link>
                ) : (
                  place.name
                )}
              </div>
              <div className="note">
                {place.slug} · {PROVINCES[place.provinceSlug]} · {place.goals.map((g) => getGoal(g).short).join(' ')} · รูป{' '}
                {place.images.length} · ตรวจ {place.checkedAt} · แก้ไข {dateTime(updatedAt)}
              </div>
              {place.notes.length > 0 && (
                <details className="admin-item__notes">
                  <summary>บันทึก ({place.notes.length})</summary>
                  <ul className="bullet-list">
                    {place.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
            <div className="admin-item__actions">
              <span className={place.published ? 'pill pill--gold' : 'tag'}>{place.published ? 'เผยแพร่' : 'ซ่อน'}</span>
              <form action={togglePublishedAction}>
                <input type="hidden" name="slug" value={place.slug} />
                <input type="hidden" name="published" value={String(!place.published)} />
                <button type="submit" className="btn btn--outline btn--sm">
                  {place.published ? 'ซ่อน' : 'เผยแพร่'}
                </button>
              </form>
              <form action={deletePlaceAction}>
                <input type="hidden" name="slug" value={place.slug} />
                <DeleteButton name={place.name} />
              </form>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="note">ยังไม่มีข้อมูล กดนำเข้า JSON เพื่อเริ่ม</li>}
      </ul>

      {imports.length > 0 && (
        <section>
          <h2 className="place__h2">นำเข้าล่าสุด</h2>
          <ul className="bullet-list">
            {imports.map((log) => (
              <li key={log.id}>
                {dateTime(log.createdAt)} · ใหม่ {log.created.length} · อัปเดต {log.updated.length}
              </li>
            ))}
          </ul>
          <p className="note">ทุกครั้งที่นำเข้า ระบบเก็บ JSON ที่วางไว้ในตาราง import_log ใช้ย้อนดูหรือกู้คืนได้</p>
        </section>
      )}
    </main>
  );
}
