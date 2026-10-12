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
import { productsRepo } from '@/lib/products-repo';
import { PLANET_COLOR } from '@/data/daily-colors';
import type { Product } from '@/data/products';
import { tellersRepo } from '@/lib/tellers-repo';
import { deleteAction, logoutAction, publishAllAction, setPinsAction, togglePublishedAction } from './actions';
import { PIN_ALL } from '@/lib/tellers';
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
  /** ลิงก์ของรายการ (สินค้าไม่มีหน้าในเว็บ ลิงก์ไป Shopee) */
  href?: string;
  /** กลุ่มสำหรับตัวกรอง: จังหวัด/ประเทศ, ศาสตร์หลัก, สีเสื้อ */
  group: string;
  /** ภาพหลัก (สถานที่/สินค้า) undefined = ประเภทนี้ไม่มีภาพจริง (หมอดูใช้ภาพประกอบตามศาสตร์) */
  thumb?: string | null;
  /** หมวดที่ปักหมุดได้ (หมอดู: หน้ารวม + ศาสตร์ของคนนั้น) */
  pinOptions?: { value: string; label: string }[];
  pinnedIn?: string[];
}

const PAGE_SIZE = 30;

interface Filters {
  q: string;
  status: 'all' | 'published' | 'hidden' | 'pinned';
  group: string;
  image: 'all' | 'missing' | 'has';
  page: number;
}

function readFilters(sp: Record<string, string | undefined>): Filters {
  const status = sp.status === 'published' || sp.status === 'hidden' || sp.status === 'pinned' ? sp.status : 'all';
  const image = sp.image === 'missing' || sp.image === 'has' ? sp.image : 'all';
  return { q: (sp.q ?? '').trim(), status, group: sp.group ?? '', image, page: Math.max(1, Number(sp.page) || 1) };
}

function applyFilters(rows: Listed[], f: Filters): Listed[] {
  const q = f.q.toLowerCase();
  return rows.filter(
    (r) =>
      (f.status === 'all' ||
        (f.status === 'pinned' ? (r.pinnedIn?.length ?? 0) > 0 : r.published === (f.status === 'published'))) &&
      (!f.group || r.group === f.group) &&
      (f.image === 'all' || r.thumb === undefined || (f.image === 'missing') === !r.thumb) &&
      (!q || `${r.name} ${r.slug} ${r.meta}`.toLowerCase().includes(q)),
  );
}

/** URL หน้าหลังบ้านพร้อมตัวกรองปัจจุบัน */
function adminHref(kind: DirectoryKind, f: Filters, page: number): string {
  const sp = new URLSearchParams({ tab: kind });
  if (f.q) sp.set('q', f.q);
  if (f.status !== 'all') sp.set('status', f.status);
  if (f.group) sp.set('group', f.group);
  if (f.image !== 'all') sp.set('image', f.image);
  if (page > 1) sp.set('page', String(page));
  return `/admin?${sp}`;
}

async function listFor(kind: DirectoryKind): Promise<Listed[]> {
  if (kind === 'places') {
    return (await placesRepo.adminList()).map(({ item: p, updatedAt }: { item: Place; updatedAt: Date }) => ({
      ...p,
      updatedAt,
      thumb: p.images[0]?.src ?? null,
      group: p.country === 'TH' ? (PROVINCES[p.provinceSlug ?? ''] ?? 'ไม่ระบุจังหวัด') : placeLocation(p).split(' · ').pop()!,
      meta: [placeLocation(p), p.goals.map((g) => getGoal(g).short).join(' '), `รูป ${p.images.length}`].join(' · '),
    }));
  }
  if (kind === 'products') {
    return (await productsRepo.adminList()).map(({ item: p, updatedAt }: { item: Product; updatedAt: Date }) => ({
      ...p,
      updatedAt,
      href: p.url,
      thumb: p.image.src,
      group: p.shirtColor ? PLANET_COLOR[p.shirtColor].name : 'อื่น ๆ',
      meta: [
        p.brand,
        p.shirtColor ? `เสื้อ${p.shade ? `สี${p.shade}` : PLANET_COLOR[p.shirtColor].name}` : null,
        new URL(p.url).hostname,
      ]
        .filter(Boolean)
        .join(' · '),
    }));
  }
  return (await tellersRepo.adminList()).map(({ item: t, updatedAt }: { item: FortuneTeller; updatedAt: Date }) => ({
    ...t,
    updatedAt,
    group: getDiscipline(t.disciplines[0])?.name ?? t.disciplines[0],
    pinOptions: [
      { value: PIN_ALL, label: 'หน้ารวมหมอดู' },
      ...t.disciplines.map((d) => ({ value: d, label: getDiscipline(d)?.name ?? d })),
    ],
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

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
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

  const sp = await searchParams;
  const kind: DirectoryKind = isDirectoryKind(sp.tab) ? sp.tab : 'places';
  const filters = readFilters(sp);
  const publicPath = ADMIN_KINDS.find((k) => k.kind === kind)!.publicPath;
  const [rows, imports] = await Promise.all([listFor(kind), recentImports(5)]);
  const publishedCount = rows.filter((r) => r.published).length;
  const groups = [...new Set(rows.map((r) => r.group))].sort((a, b) => a.localeCompare(b, 'th'));
  const filtered = applyFilters(rows, filters);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtering = filters.q !== '' || filters.status !== 'all' || filters.group !== '' || filters.image !== 'all';
  const hasImages = rows.some((r) => r.thumb !== undefined);
  const missingImage = rows.filter((r) => r.thumb === null);
  const groupLabel = kind === 'places' ? 'จังหวัด / ประเทศ' : kind === 'products' ? 'สี' : 'ศาสตร์หลัก';

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
        <details className="seed-box" open={rows.length === 0}>
          <summary className="field__label">ชุดข้อมูลเริ่มต้น (จาก repo)</summary>
          {SEED_BATCHES.filter((b) => b.kind === kind).map((b) => (
            <SeedButton key={b.id} batch={b.id} label={`${b.label} (${b.data.length} รายการ)`} />
          ))}
          <p className="note">นำเข้าเฉพาะรายการที่ยังไม่มี ไม่เขียนทับของเดิม สถานะเผยแพร่ตามที่ตั้งไว้ในชุดข้อมูล</p>
        </details>
      )}

      <form key={adminHref(kind, filters, 1)} className="admin-filter" method="get" action="/admin">
        <input type="hidden" name="tab" value={kind} />
        <label className="admin-filter__q">
          <span className="visually-hidden">ค้นหา</span>
          <input className="input" type="search" name="q" defaultValue={filters.q} placeholder="ค้นหาชื่อ slug หรือรายละเอียด" />
        </label>
        <label className="select-wrap">
          <span className="visually-hidden">สถานะ</span>
          <select className="select" name="status" defaultValue={filters.status}>
            <option value="all">ทุกสถานะ</option>
            <option value="published">เผยแพร่</option>
            <option value="hidden">ซ่อน</option>
            {kind === 'fortune_tellers' && <option value="pinned">ปักหมุดอยู่</option>}
          </select>
        </label>
        <label className="select-wrap">
          <span className="visually-hidden">{groupLabel}</span>
          <select className="select" name="group" defaultValue={filters.group}>
            <option value="">ทุก{groupLabel}</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g} ({rows.filter((r) => r.group === g).length})
              </option>
            ))}
          </select>
        </label>
        {hasImages && (
          <label className="select-wrap">
            <span className="visually-hidden">ภาพ</span>
            <select className="select" name="image" defaultValue={filters.image}>
              <option value="all">ภาพ: ทั้งหมด</option>
              <option value="missing">ยังไม่มีภาพ ({missingImage.length})</option>
              <option value="has">มีภาพแล้ว ({rows.length - missingImage.length})</option>
            </select>
          </label>
        )}
        <button type="submit" className="btn btn--gold btn--sm">
          กรอง
        </button>
        {filtering && (
          <Link href={`/admin?tab=${kind}`} className="btn btn--outline btn--sm">
            ล้าง
          </Link>
        )}
      </form>
      {missingImage.length > 0 && filters.image !== 'missing' && (
        <p className="admin-warn">
          ยังไม่มีภาพ {missingImage.length} รายการ{' '}
          <Link href={adminHref(kind, { ...filters, image: 'missing' }, 1)}>ดูรายการที่ยังไม่มีภาพ</Link>
        </p>
      )}
      <p className="note">
        พบ {filtered.length} รายการ{pages > 1 ? ` · หน้า ${page}/${pages}` : ''}
      </p>

      <ul className="admin-list">
        {shown.map((r) => (
          <li key={r.slug} className="admin-item">
            {r.thumb !== undefined &&
              (r.thumb ? (
                <img src={r.thumb} alt="" className="admin-item__thumb" loading="lazy" />
              ) : (
                <span className="admin-item__thumb admin-item__thumb--missing">ไม่มีภาพ</span>
              ))}
            <div className="admin-item__main">
              <div className="admin-item__name">
                {r.published ? (
                  <Link href={r.href ?? `${publicPath}/${r.slug}`} target="_blank">
                    {r.name}
                  </Link>
                ) : (
                  r.name
                )}
              </div>
              <div className="note">
                {r.slug} · {r.meta} · ตรวจ {r.checkedAt} · แก้ไข {dateTime(r.updatedAt)}
              </div>
              {r.pinOptions && (
                <details className="admin-item__notes admin-pins">
                  <summary>
                    ปักหมุด
                    {r.pinnedIn && r.pinnedIn.length > 0
                      ? `: ${r.pinOptions
                          .filter((o) => r.pinnedIn!.includes(o.value))
                          .map((o) => o.label)
                          .join(', ')}`
                      : ' (ยังไม่ได้ปัก)'}
                  </summary>
                  <form action={setPinsAction} className="admin-pins__form">
                    <input type="hidden" name="kind" value={kind} />
                    <input type="hidden" name="slug" value={r.slug} />
                    {r.pinOptions.map((o) => (
                      <label key={o.value} className="admin-pins__opt">
                        <input type="checkbox" name="pin" value={o.value} defaultChecked={r.pinnedIn?.includes(o.value)} />
                        {o.label}
                      </label>
                    ))}
                    <button type="submit" className="btn btn--outline btn--sm">
                      บันทึกหมุด
                    </button>
                  </form>
                </details>
              )}
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
        {rows.length > 0 && filtered.length === 0 && <li className="note">ไม่พบรายการตามตัวกรองนี้</li>}
      </ul>
      {pages > 1 && (
        <nav className="admin-pager" aria-label="หน้า">
          {page > 1 && (
            <Link href={adminHref(kind, filters, page - 1)} className="btn btn--outline btn--sm">
              ก่อนหน้า
            </Link>
          )}
          <span className="note">
            หน้า {page} / {pages}
          </span>
          {page < pages && (
            <Link href={adminHref(kind, filters, page + 1)} className="btn btn--outline btn--sm">
              ถัดไป
            </Link>
          )}
        </nav>
      )}

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
