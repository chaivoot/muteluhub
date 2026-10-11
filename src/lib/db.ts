import 'server-only';
import postgres from 'postgres';

/**
 * Neon Postgres (ตั้งค่าผ่าน Vercel Marketplace จะได้ env DATABASE_URL อัตโนมัติ)
 * ไม่มี DATABASE_URL = ยังไม่ได้ต่อฐานข้อมูล หน้าเว็บจะทำงานแบบไม่มีข้อมูลสถานที่
 */
type Sql = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as { mhSql?: Sql; mhSchema?: Promise<void> };

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  if (!globalForDb.mhSql) {
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    globalForDb.mhSql = postgres(url, {
      ssl: local ? false : 'require',
      max: 3,
      // Neon pooled connection (pgbouncer) ไม่รองรับ prepared statements
      prepare: false,
      idle_timeout: 20,
      onnotice: () => {},
    });
  }
  return globalForDb.mhSql;
}

/** สร้างตารางถ้ายังไม่มี (เรียกครั้งเดียวต่อ process) */
export function ensureSchema(): Promise<void> {
  if (!globalForDb.mhSchema) {
    const sql = getSql();
    // หลาย process (เช่น build workers) อาจสร้างตารางพร้อมกัน ใช้ advisory lock กันชน
    globalForDb.mhSchema = sql.begin(async (sql) => {
      await sql`select pg_advisory_xact_lock(727274)`;
      await sql`
        create table if not exists places (
          slug text primary key,
          data jsonb not null,
          published boolean not null default false,
          province_slug text not null,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        )`;
      await sql`create index if not exists places_published_idx on places (published)`;
      // สถานที่ต่างประเทศไม่มีจังหวัด (เพิ่มภายหลัง ตารางเดิมเคยเป็น not null)
      await sql`alter table places alter column province_slug drop not null`;
      await sql`
        create table if not exists fortune_tellers (
          slug text primary key,
          data jsonb not null,
          published boolean not null default false,
          province_slug text,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        )`;
      await sql`create index if not exists fortune_tellers_published_idx on fortune_tellers (published)`;
      await sql`
        create table if not exists import_log (
          id serial primary key,
          kind text not null,
          payload jsonb not null,
          summary jsonb not null,
          created_at timestamptz not null default now()
        )`;
    }).then(() => undefined).catch((err) => {
      globalForDb.mhSchema = undefined;
      throw err;
    });
  }
  return globalForDb.mhSchema;
}
