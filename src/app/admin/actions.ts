'use server';

import { redirect } from 'next/navigation';
import { login, logout, requireAdmin } from '@/lib/admin-auth';
import type { DirectoryKind } from '@/lib/directory-repo';
import { isDirectoryKind } from '@/lib/admin-kinds';
import type { ImportItemResult } from '@/lib/import/common';
import { parsePlaceImport } from '@/lib/import/place-schema';
import { parseTellerImport } from '@/lib/import/teller-schema';
import { placesRepo } from '@/lib/places-repo';
import { getSeedBatch } from '@/lib/seed-batches';
import { tellersRepo } from '@/lib/tellers-repo';

export async function loginAction(_: unknown, form: FormData): Promise<{ error?: string }> {
  const ok = await login(String(form.get('password') ?? ''));
  if (!ok) return { error: 'รหัสผ่านไม่ถูกต้อง' };
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect('/admin');
}

type AnyItem = { slug: string; published: boolean; notes: string[] };

function forKind(kind: DirectoryKind) {
  if (kind === 'places') return { parse: parsePlaceImport, repo: placesRepo };
  return { parse: parseTellerImport, repo: tellersRepo };
}

function parse(kind: DirectoryKind, text: string) {
  return forKind(kind).parse(text) as { error?: string; items: ImportItemResult<AnyItem>[] };
}

export interface PreviewItem extends Omit<ImportItemResult<AnyItem>, 'item'> {
  action?: 'create' | 'update';
  published?: boolean;
  notesCount?: number;
}

export interface PreviewResult {
  error?: string;
  items: PreviewItem[];
}

/** ตรวจข้อมูลก่อนนำเข้า ยังไม่เขียนฐานข้อมูล */
export async function previewImportAction(kind: DirectoryKind, text: string): Promise<PreviewResult> {
  await requireAdmin();
  if (!isDirectoryKind(kind)) return { error: 'ประเภทข้อมูลไม่ถูกต้อง', items: [] };
  const parsed = parse(kind, text);
  if (parsed.error) return { error: parsed.error, items: [] };
  const existing = await forKind(kind).repo.existingSlugs(parsed.items.filter((i) => i.ok).map((i) => i.item!.slug));
  return {
    items: parsed.items.map(({ item, ...rest }) => ({
      ...rest,
      action: item ? (existing.has(item.slug) ? 'update' : 'create') : undefined,
      published: item?.published,
      notesCount: item?.notes.length,
    })),
  };
}

export interface ImportResult {
  error?: string;
  created?: string[];
  updated?: string[];
}

/** นำเข้าเฉพาะเมื่อทุกรายการผ่านการตรวจ (ไม่นำเข้าบางส่วน) */
export async function importAction(kind: DirectoryKind, text: string): Promise<ImportResult> {
  await requireAdmin();
  if (!isDirectoryKind(kind)) return { error: 'ประเภทข้อมูลไม่ถูกต้อง' };
  try {
    // แยกตามประเภทเพื่อให้ type ของแต่ละ repo ตรงกัน
    if (kind === 'places') return await importAll(parsePlaceImport(text), (items) => placesRepo.upsert(items, JSON.parse(text)));
    return await importAll(parseTellerImport(text), (items) => tellersRepo.upsert(items, JSON.parse(text)));
  } catch (err) {
    return { error: `บันทึกไม่สำเร็จ: ${(err as Error).message}` };
  }
}

async function importAll<T>(
  parsed: { error?: string; items: ImportItemResult<T>[] },
  save: (items: T[]) => Promise<ImportResult>,
): Promise<ImportResult> {
  if (parsed.error) return { error: parsed.error };
  const bad = parsed.items.filter((i) => !i.ok);
  if (bad.length) return { error: `มี ${bad.length} รายการที่ยังผิด แก้ให้ครบก่อนนำเข้า` };
  return save(parsed.items.map((i) => i.item!));
}

function kindFrom(form: FormData): DirectoryKind {
  const kind = form.get('kind');
  if (!isDirectoryKind(kind)) throw new Error('Bad kind');
  return kind;
}

export async function togglePublishedAction(form: FormData): Promise<void> {
  await requireAdmin();
  await forKind(kindFrom(form)).repo.setPublished(String(form.get('slug')), form.get('published') === 'true');
}

export async function deleteAction(form: FormData): Promise<void> {
  await requireAdmin();
  await forKind(kindFrom(form)).repo.remove(String(form.get('slug')));
}

export interface SeedResult {
  error?: string;
  created?: string[];
  skipped?: string[];
}

/** นำเข้าชุดเริ่มต้นจาก repo เฉพาะ slug ที่ยังไม่มี (ไม่เขียนทับสถานะเผยแพร่ที่ตั้งไว้แล้ว) */
export async function seedAction(_: unknown, form: FormData): Promise<SeedResult> {
  await requireAdmin();
  const batch = getSeedBatch(String(form.get('batch')));
  if (!batch) return { error: 'ไม่พบชุดข้อมูล' };
  const text = JSON.stringify(batch.data);
  try {
    if (batch.kind === 'places') return await seedWith(parsePlaceImport(text), placesRepo, batch.data);
    return await seedWith(parseTellerImport(text), tellersRepo, batch.data);
  } catch (err) {
    return { error: `บันทึกไม่สำเร็จ: ${(err as Error).message}` };
  }
}

async function seedWith<T extends { slug: string }>(
  parsed: { error?: string; items: ImportItemResult<T>[] },
  repo: { existingSlugs: (s: string[]) => Promise<Set<string>>; upsert: (items: T[], raw: unknown) => Promise<{ created: string[] }> },
  raw: unknown[],
): Promise<SeedResult> {
  if (parsed.error) return { error: parsed.error };
  const bad = parsed.items.filter((i) => !i.ok);
  if (bad.length) return { error: `ชุดข้อมูลมี ${bad.length} รายการที่ผิด` };
  const items = parsed.items.map((i) => i.item!);
  const existing = await repo.existingSlugs(items.map((i) => i.slug));
  const fresh = items.filter((i) => !existing.has(i.slug));
  if (fresh.length === 0) return { created: [], skipped: [...existing] };
  const freshSlugs = new Set(fresh.map((i) => i.slug));
  const rawFresh = raw.filter((r) => freshSlugs.has((r as { slug?: string }).slug ?? ''));
  const { created } = await repo.upsert(fresh, rawFresh);
  return { created, skipped: [...existing] };
}
