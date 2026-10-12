import 'server-only';
import { revalidateTag, unstable_cache } from 'next/cache';
import { ensureSchema, getSql, hasDatabase } from '@/lib/db';

/**
 * คลังข้อมูล directory แบบเดียวกันทุกประเภท (สถานที่ หมอดู สินค้า)
 * ตาราง: slug, data jsonb, published, province_slug, created_at, updated_at
 */
export type DirectoryKind = 'places' | 'fortune_tellers' | 'products';

interface Entry {
  slug: string;
  published: boolean;
  notes: string[];
  provinceSlug?: string;
}

interface Row<T> {
  slug: string;
  data: T;
  published: boolean;
  updated_at: Date;
}

export interface AdminRow<T> {
  item: T;
  updatedAt: Date;
}

export interface UpsertSummary {
  created: string[];
  updated: string[];
}

export function createDirectoryRepo<T extends Entry>(kind: DirectoryKind) {
  const tag = kind;
  const fromRow = (r: Row<T>): T => ({ ...r.data, slug: r.slug, published: r.published });

  async function queryPublished(): Promise<T[]> {
    if (!hasDatabase()) return [];
    await ensureSchema();
    const sql = getSql();
    const rows = await sql<Row<T>[]>`
      select slug, data, published, updated_at from ${sql(kind)}
      where published = true order by data->>'name'`;
    // notes เป็นบันทึกภายใน ไม่ส่งออกหน้าเว็บ
    return rows.map(fromRow).map((x) => ({ ...x, notes: [] }));
  }

  const listPublished = unstable_cache(queryPublished, [`published-${kind}`], { tags: [tag], revalidate: 3600 });

  return {
    tag,
    listPublished,

    async adminList(): Promise<AdminRow<T>[]> {
      await ensureSchema();
      const sql = getSql();
      const rows = await sql<Row<T>[]>`select slug, data, published, updated_at from ${sql(kind)} order by updated_at desc`;
      return rows.map((r) => ({ item: fromRow(r), updatedAt: r.updated_at }));
    },

    async existingSlugs(slugs: string[]): Promise<Set<string>> {
      if (slugs.length === 0) return new Set();
      await ensureSchema();
      const sql = getSql();
      const rows = await sql<{ slug: string }[]>`select slug from ${sql(kind)} where slug in ${sql(slugs)}`;
      return new Set(rows.map((r) => r.slug));
    },

    /** เพิ่มใหม่หรือเขียนทับตาม slug ในทรานแซกชันเดียว และเก็บ JSON ที่วางไว้ใน import_log */
    async upsert(items: T[], rawPayload: unknown): Promise<UpsertSummary> {
      await ensureSchema();
      const sql = getSql();
      const summary = await sql.begin(async (tx) => {
        const created: string[] = [];
        const updated: string[] = [];
        for (const it of items) {
          const { published, ...data } = it;
          const [row] = await tx<{ inserted: boolean }[]>`
            insert into ${tx(kind)} (slug, data, published, province_slug)
            values (${it.slug}, ${tx.json(data as never)}, ${published}, ${it.provinceSlug ?? null})
            on conflict (slug) do update set
              data = excluded.data,
              published = excluded.published,
              province_slug = excluded.province_slug,
              updated_at = now()
            returning (xmax = 0) as inserted`;
          (row.inserted ? created : updated).push(it.slug);
        }
        await tx`
          insert into import_log (kind, payload, summary)
          values (${kind}, ${tx.json(rawPayload as never)}, ${tx.json({ created, updated } as never)})`;
        return { created, updated };
      });
      revalidateTag(tag);
      return summary;
    },

    async setPublished(slug: string, published: boolean): Promise<void> {
      await ensureSchema();
      const sql = getSql();
      await sql`update ${sql(kind)} set published = ${published}, updated_at = now() where slug = ${slug}`;
      revalidateTag(tag);
    },

    /** เผยแพร่ทุกรายการที่ยังซ่อนอยู่ คืนจำนวนที่เปลี่ยน */
    async publishAll(): Promise<number> {
      await ensureSchema();
      const sql = getSql();
      const rows = await sql`update ${sql(kind)} set published = true, updated_at = now() where published = false returning slug`;
      revalidateTag(tag);
      return rows.length;
    },

    async remove(slug: string): Promise<void> {
      await ensureSchema();
      const sql = getSql();
      await sql`delete from ${sql(kind)} where slug = ${slug}`;
      revalidateTag(tag);
    },
  };
}

export interface ImportLogEntry {
  id: number;
  kind: string;
  createdAt: Date;
  created: string[];
  updated: string[];
}

export async function recentImports(limit = 10): Promise<ImportLogEntry[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<{ id: number; kind: string; created_at: Date; summary: { created: string[]; updated: string[] } }[]>`
    select id, kind, created_at, summary from import_log order by id desc limit ${limit}`;
  return rows.map((r) => ({ id: r.id, kind: r.kind, createdAt: r.created_at, ...r.summary }));
}
