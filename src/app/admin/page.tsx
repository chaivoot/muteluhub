import Link from 'next/link';
import { CHANNEL_LABEL, type FortuneTeller } from '@/data/fortune-tellers';
import type { Place } from '@/data/places';
import { PROVINCES } from '@/data/provinces';
import { adminConfigured, isAdmin } from '@/lib/admin-auth';
import { ADMIN_KINDS, isDirectoryKind, kindLabel } from '@/lib/admin-kinds';
import { hasDatabase } from '@/lib/db';
import { recentImports, type DirectoryKind } from '@/lib/directory-repo';
import { getDiscipline } from '@/lib/disciplines';
import { getGoal } from '@/lib/goals';
import { placeLocation } from '@/lib/places';
import { placesRepo } from '@/lib/places-repo';
import { tellersRepo } from '@/lib/tellers-repo';
import { deleteAction, logoutAction, publishAllAction, togglePublishedAction } from './actions';
import { ConfirmButton } from './ConfirmButton';
import { DeleteButton } from './DeleteButton';
import { LoginForm } from './LoginForm';
import { SeedButton } from './SeedButton';
import { SEED_BATCHES } from '@/lib/seed-batches';

const dateTime = (d: Date) =>
  d.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'medium', timeStyle: 'short' });

interface Listed {
  slug: string;
  name: string;
  published: boolean;
  notes: string[];
  checkedAt: string;
  meta: string;
  updatedAt: Date;
}

async function listFor(kind: DirectoryKind): Promise<Listed[]> {
  if (kind === 'places') {
    return (await placesRepo.adminList()).map(({ item: p, updatedAt }: { item: Place; updatedAt: Date }) => ({
      ...p,
      updatedAt,
      meta: [placeLocation(p), p.goals.map((g) => getGoal(g).short).join(' '), `รูป ${p.images.length}`].join(' · '),
    }));
  }
  return (await tellersRepo.adminList()).map(({ item: t, updatedAt }: { item: FortuneTeller; updatedAt: Date }) => ({
    ...t,
    updatedAt,
    meta: [
      t.disciplines.map((d) => getDiscipline(d)?.name ?? d).join(', '),
      t.channels.map((c) => CHANNEL_LABEL[c]).join(' '),
      t.provinceSlug ? PROVINCES[t.provinceSlug] : 'ออนไลน์',
      t.priceFrom != null ? `เริ่ม ${t.priceFrom} บาท` : null,
    ]
      .filter(Boolean)
      .join(' · '),
  }));
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
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

  const { tab } = await searchParams;
  const kind: DirectoryKind = isDirectoryKind(tab) ? tab : 'places';
  const publicPath = ADMIN_KINDS.find((k) => k.kind === kind)!.publicPath;
  const [rows, imports] = await Promise.all([listFor(kind), recentImports(5)]);
  const publishedCount = rows.filter((r) => r.published).length;

  return (
    <main className="container admin__main">
      <div className="admin__head">
        <h1 className="admin__title">หลังบ้าน</h1>
        <form action={logoutAction}>
          <button type="submit" className="btn btn--outline btn--sm">
            ออกจากระบบ
          </button>
        </form>
      </div>

      <nav className="chip-row" aria-label="ประเภทข้อมูล">
        {ADMIN_KINDS.map((k) => (
          <Link key={k.kind} href={`/admin?tab=${k.kind}`} className="chip" aria-current={k.kind === kind ? 'page' : undefined}>
            {k.label}
          </Link>
        ))}
      </nav>

      <p className="note">
        {kindLabel(kind)} {rows.length} · เผยแพร่แล้ว {publishedCount} · ซ่อนอยู่ {rows.length - publishedCount}
      </p>
      <div className="actions actions--wrap">
        <Link href={`/admin/import?kind=${kind}`} className="btn btn--gold">
          นำเข้า JSON ({kindLabel(kind)})
        </Link>
        {rows.length - publishedCount > 0 && (
          <form action={publishAllAction}>
            <input type="hidden" name="kind" value={kind} />
            <ConfirmButton
              className="btn btn--outline"
              message={`เผยแพร่${kindLabel(kind)}ที่ซ่อนอยู่ทั้งหมด ${rows.length - publishedCount} รายการ? ตรวจบันทึกของแต่ละรายการแล้วหรือยัง`}
            >
              เผยแพร่ทั้งหมด ({rows.length - publishedCount})
            </ConfirmButton>
          </form>
        )}
      </div>

      {SEED_BATCHES.some((b) => b.kind === kind) && (
        <section className="seed-box">
          <div className="field__label">ชุดข้อมูลเริ่มต้น (จาก repo)</div>
          {SEED_BATCHES.filter((b) => b.kind === kind).map((b) => (
            <SeedButton key={b.id} batch={b.id} label={`${b.label} (${b.data.length} รายการ)`} />
          ))}
          <p className="note">นำเข้าเฉพาะรายการที่ยังไม่มี ไม่เขียนทับของเดิม ทุกรายการเข้ามาแบบซ่อนไว้ก่อน</p>
        </section>
      )}

      <ul className="admin-list">
        {rows.map((r) => (
          <li key={r.slug} className="admin-item">
            <div className="admin-item__main">
              <div className="admin-item__name">
                {r.published ? (
                  <Link href={`${publicPath}/${r.slug}`} target="_blank">
                    {r.name}
                  </Link>
                ) : (
                  r.name
                )}
              </div>
              <div className="note">
                {r.slug} · {r.meta} · ตรวจ {r.checkedAt} · แก้ไข {dateTime(r.updatedAt)}
              </div>
              {r.notes.length > 0 && (
                <details className="admin-item__notes">
                  <summary>บันทึก ({r.notes.length})</summary>
                  <ul className="bullet-list">
                    {r.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
            <div className="admin-item__actions">
              <span className={r.published ? 'pill pill--gold' : 'tag'}>{r.published ? 'เผยแพร่' : 'ซ่อน'}</span>
              <form action={togglePublishedAction}>
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="slug" value={r.slug} />
                <input type="hidden" name="published" value={String(!r.published)} />
                <button type="submit" className="btn btn--outline btn--sm">
                  {r.published ? 'ซ่อน' : 'เผยแพร่'}
                </button>
              </form>
              <form action={deleteAction}>
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="slug" value={r.slug} />
                <DeleteButton name={r.name} />
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
                {dateTime(log.createdAt)} · {isDirectoryKind(log.kind) ? kindLabel(log.kind) : log.kind} · ใหม่{' '}
                {log.created.length} · อัปเดต {log.updated.length}
              </li>
            ))}
          </ul>
          <p className="note">ทุกครั้งที่นำเข้า ระบบเก็บ JSON ที่วางไว้ในตาราง import_log ใช้ย้อนดูหรือกู้คืนได้</p>
        </section>
      )}
    </main>
  );
}
