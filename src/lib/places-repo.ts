import 'server-only';
import { unstable_cache, revalidateTag } from 'next/cache';
import type { Place } from '@/data/places';
import { ensureSchema, getSql, hasDatabase } from '@/lib/db';

export const PLACES_TAG = 'places';

interface Row {
  slug: string;
  data: Place;
  published: boolean;
  updated_at: Date;
}

const fromRow = (r: Row): Place => ({ ...r.data, slug: r.slug, published: r.published });

/** ส่วนที่แสดงบนหน้าเว็บ: ตัด notes (บันทึกภายใน) ออกเสมอ */
const toPublic = (p: Place): Place => ({ ...p, notes: [] });

async function queryPublished(): Promise<Place[]> {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<Row[]>`
    select slug, data, published, updated_at from places
    where published = true
    order by data->>'name'`;
  return rows.map(fromRow).map(toPublic);
}

/** สถานที่ที่เผยแพร่แล้ว (cache จนกว่าจะมีการนำเข้า/แก้ไข) */
export const listPublishedPlaces = unstable_cache(queryPublished, ['published-places'], {
  tags: [PLACES_TAG],
  revalidate: 3600,
});

export async function getPublishedPlace(slug: string): Promise<Place | undefined> {
  return (await listPublishedPlaces()).find((p) => p.slug === slug);
}

// ---------- หลังบ้าน ----------

export interface AdminPlaceRow {
  place: Place;
  updatedAt: Date;
}

export async function adminListPlaces(): Promise<AdminPlaceRow[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<Row[]>`select slug, data, published, updated_at from places order by updated_at desc`;
  return rows.map((r) => ({ place: fromRow(r), updatedAt: r.updated_at }));
}

export async function existingSlugs(slugs: string[]): Promise<Set<string>> {
  if (slugs.length === 0) return new Set();
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<{ slug: string }[]>`select slug from places where slug in ${sql(slugs)}`;
  return new Set(rows.map((r) => r.slug));
}

export interface UpsertSummary {
  created: string[];
  updated: string[];
}

/** นำเข้า: เพิ่มใหม่หรือเขียนทับตาม slug ในทรานแซกชันเดียว และเก็บ JSON ที่นำเข้าไว้ใน import_log */
export async function upsertPlaces(places: Place[], rawPayload: unknown): Promise<UpsertSummary> {
  await ensureSchema();
  const sql = getSql();
  const summary = await sql.begin(async (tx) => {
    const created: string[] = [];
    const updated: string[] = [];
    for (const p of places) {
      const { published, ...data } = p;
      const [row] = await tx<{ inserted: boolean }[]>`
        insert into places (slug, data, published, province_slug)
        values (${p.slug}, ${tx.json(data as never)}, ${published}, ${p.provinceSlug})
        on conflict (slug) do update set
          data = excluded.data,
          published = excluded.published,
          province_slug = excluded.province_slug,
          updated_at = now()
        returning (xmax = 0) as inserted`;
      (row.inserted ? created : updated).push(p.slug);
    }
    await tx`
      insert into import_log (kind, payload, summary)
      values ('places', ${tx.json(rawPayload as never)}, ${tx.json({ created, updated } as never)})`;
    return { created, updated };
  });
  revalidateTag(PLACES_TAG);
  return summary;
}

export async function setPlacePublished(slug: string, published: boolean): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`update places set published = ${published}, updated_at = now() where slug = ${slug}`;
  revalidateTag(PLACES_TAG);
}

export async function deletePlace(slug: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`delete from places where slug = ${slug}`;
  revalidateTag(PLACES_TAG);
}

export interface ImportLogEntry {
  id: number;
  createdAt: Date;
  created: string[];
  updated: string[];
}

export async function recentImports(limit = 10): Promise<ImportLogEntry[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<{ id: number; created_at: Date; summary: { created: string[]; updated: string[] } }[]>`
    select id, created_at, summary from import_log order by id desc limit ${limit}`;
  return rows.map((r) => ({ id: r.id, createdAt: r.created_at, ...r.summary }));
}

export async function getImportPayload(id: number): Promise<unknown> {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<{ payload: unknown }[]>`select payload from import_log where id = ${id}`;
  return row?.payload;
}
