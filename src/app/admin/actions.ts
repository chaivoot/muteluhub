'use server';

import { redirect } from 'next/navigation';
import { login, logout, requireAdmin } from '@/lib/admin-auth';
import { parsePlaceImport, type ImportItemResult } from '@/lib/import/place-schema';
import { deletePlace, existingSlugs, setPlacePublished, upsertPlaces } from '@/lib/places-repo';

export async function loginAction(_: unknown, form: FormData): Promise<{ error?: string }> {
  const ok = await login(String(form.get('password') ?? ''));
  if (!ok) return { error: 'รหัสผ่านไม่ถูกต้อง' };
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await logout();
  redirect('/admin');
}

export interface PreviewItem extends Omit<ImportItemResult, 'place'> {
  action?: 'create' | 'update';
  published?: boolean;
  imageCount?: number;
  notes?: string[];
}

export interface PreviewResult {
  error?: string;
  items: PreviewItem[];
}

/** ตรวจข้อมูลก่อนนำเข้า ยังไม่เขียนฐานข้อมูล */
export async function previewImportAction(text: string): Promise<PreviewResult> {
  await requireAdmin();
  const parsed = parsePlaceImport(text);
  if (parsed.error) return { error: parsed.error, items: [] };
  const existing = await existingSlugs(parsed.items.filter((i) => i.ok).map((i) => i.place!.slug));
  return {
    items: parsed.items.map(({ place, ...rest }) => ({
      ...rest,
      action: place ? (existing.has(place.slug) ? 'update' : 'create') : undefined,
      published: place?.published,
      imageCount: place?.images.length,
      notes: place?.notes,
    })),
  };
}

export interface ImportResult {
  error?: string;
  created?: string[];
  updated?: string[];
}

/** นำเข้าเฉพาะรายการที่ผ่านการตรวจ ถ้ามีรายการผิดจะไม่นำเข้าเลยสักรายการ */
export async function importPlacesAction(text: string): Promise<ImportResult> {
  await requireAdmin();
  const parsed = parsePlaceImport(text);
  if (parsed.error) return { error: parsed.error };
  const bad = parsed.items.filter((i) => !i.ok);
  if (bad.length) return { error: `มี ${bad.length} รายการที่ยังผิด แก้ให้ครบก่อนนำเข้า` };
  try {
    return await upsertPlaces(
      parsed.items.map((i) => i.place!),
      JSON.parse(text),
    );
  } catch (err) {
    return { error: `บันทึกไม่สำเร็จ: ${(err as Error).message}` };
  }
}

export async function togglePublishedAction(form: FormData): Promise<void> {
  await requireAdmin();
  await setPlacePublished(String(form.get('slug')), form.get('published') === 'true');
}

export async function deletePlaceAction(form: FormData): Promise<void> {
  await requireAdmin();
  await deletePlace(String(form.get('slug')));
}
