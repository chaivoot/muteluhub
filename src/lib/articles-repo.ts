import 'server-only';
import { randomBytes } from 'node:crypto';
import { revalidateTag, unstable_cache } from 'next/cache';
import type { Article, FestivalCover } from '@/data/articles';
import { ensureSchema, getSql, hasDatabase } from '@/lib/db';

/**
 * บทความ รูปที่อัปโหลด และรูปปกเทศกาล (เขียนจากหลังบ้าน /admin/articles)
 * หน้าเว็บอ่านผ่าน cache tag แล้ว revalidate ทันทีที่บันทึก
 */
const ARTICLES_TAG = 'articles';
const COVERS_TAG = 'festival_covers';

interface ArticleRow {
  slug: string;
  data: Omit<Article, 'slug' | 'published' | 'publishedAt' | 'updatedAt'>;
  published: boolean;
  published_at: Date | null;
  updated_at: Date;
}

const fromRow = (r: ArticleRow): Article => ({
  ...r.data,
  slug: r.slug,
  published: r.published,
  publishedAt: r.published_at?.toISOString() ?? null,
  updatedAt: r.updated_at.toISOString(),
});

async function queryPublished(): Promise<Article[]> {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<ArticleRow[]>`
    select slug, data, published, published_at, updated_at from articles
    where published = true order by published_at desc nulls last`;
  return rows.map(fromRow);
}

export const listPublishedArticles = unstable_cache(queryPublished, ['published-articles'], {
  tags: [ARTICLES_TAG],
  revalidate: 3600,
});

export async function adminListArticles(): Promise<Article[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<ArticleRow[]>`
    select slug, data, published, published_at, updated_at from articles order by updated_at desc`;
  return rows.map(fromRow);
}

export async function getArticleForAdmin(slug: string): Promise<Article | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<ArticleRow[]>`
    select slug, data, published, published_at, updated_at from articles where slug = ${slug}`;
  return rows[0] ? fromRow(rows[0]) : null;
}

/** บันทึกบทความ (สร้างใหม่หรือแก้) เผยแพร่ครั้งแรกจะตั้งวันที่เผยแพร่ */
export async function saveArticle(article: Omit<Article, 'publishedAt' | 'updatedAt'>, isNew: boolean): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  const { slug, published, ...data } = article;
  if (isNew) {
    await sql`
      insert into articles (slug, data, published, published_at)
      values (${slug}, ${sql.json(data as never)}, ${published}, ${published ? new Date() : null})`;
  } else {
    await sql`
      update articles set data = ${sql.json(data as never)}, published = ${published},
        published_at = case when ${published} then coalesce(published_at, now()) else published_at end,
        updated_at = now()
      where slug = ${slug}`;
  }
  revalidateTag(ARTICLES_TAG);
}

export async function articleExists(slug: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`select 1 from articles where slug = ${slug}`;
  return rows.length > 0;
}

export async function deleteArticle(slug: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`delete from articles where slug = ${slug}`;
  revalidateTag(ARTICLES_TAG);
}

// ---------- media ----------

export async function saveMedia(bytes: Buffer, mime: string, width: number | null, height: number | null): Promise<string> {
  await ensureSchema();
  const sql = getSql();
  const id = randomBytes(9).toString('base64url');
  await sql`insert into media (id, mime, bytes, width, height) values (${id}, ${mime}, ${bytes}, ${width}, ${height})`;
  return id;
}

export async function getMedia(id: string): Promise<{ mime: string; bytes: Buffer } | null> {
  if (!hasDatabase()) return null;
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<{ mime: string; bytes: Buffer }[]>`select mime, bytes from media where id = ${id}`;
  return rows[0] ?? null;
}

// ---------- festival covers ----------

async function queryCovers(): Promise<Record<string, FestivalCover>> {
  if (!hasDatabase()) return {};
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<(FestivalCover & { slug: string })[]>`select slug, src, alt, credit from festival_covers`;
  return Object.fromEntries(rows.map(({ slug, ...c }) => [slug, c]));
}

export const getFestivalCovers = unstable_cache(queryCovers, ['festival-covers'], {
  tags: [COVERS_TAG],
  revalidate: 3600,
});

export async function setFestivalCover(slug: string, cover: FestivalCover | null): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  if (cover) {
    await sql`
      insert into festival_covers (slug, src, alt, credit) values (${slug}, ${cover.src}, ${cover.alt}, ${cover.credit})
      on conflict (slug) do update set src = excluded.src, alt = excluded.alt, credit = excluded.credit, updated_at = now()`;
  } else {
    await sql`delete from festival_covers where slug = ${slug}`;
  }
  revalidateTag(COVERS_TAG);
}
