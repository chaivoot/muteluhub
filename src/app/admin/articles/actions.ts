'use server';

import { redirect } from 'next/navigation';
import { FESTIVALS } from '@/data/festivals';
import { requireAdmin } from '@/lib/admin-auth';
import { articleExists, deleteArticle, saveArticle, setFestivalCover } from '@/lib/articles-repo';
import { articleSchema, imageSchema } from '@/lib/import/article-schema';
import type { GoalSlug } from '@/lib/goals';

export interface SaveResult {
  error?: string;
  slug?: string;
}

/** บันทึกบทความจากหน้าแก้ไข (input มาจาก client ตรวจด้วย zod ทุกครั้ง) */
export async function saveArticleAction(input: unknown, isNew: boolean): Promise<SaveResult> {
  await requireAdmin();
  const parsed = articleSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(' · ') };
  const a = parsed.data;
  if (isNew && (await articleExists(a.slug))) return { error: `มีบทความ slug "${a.slug}" อยู่แล้ว` };
  await saveArticle({ ...a, goals: a.goals as GoalSlug[], seoTitle: a.seoTitle || null }, isNew);
  return { slug: a.slug };
}

export async function deleteArticleAction(form: FormData): Promise<void> {
  await requireAdmin();
  await deleteArticle(String(form.get('slug')));
  redirect('/admin/articles');
}

/** ตั้งหรือลบรูปปกของหน้าเทศกาล (null = กลับไปใช้รูปเดิมในโค้ด) */
export async function setFestivalCoverAction(slug: string, cover: unknown): Promise<SaveResult> {
  await requireAdmin();
  if (!FESTIVALS.some((f) => f.slug === slug)) return { error: 'ไม่พบเทศกาลนี้' };
  if (cover === null) {
    await setFestivalCover(slug, null);
    return { slug };
  }
  const parsed = imageSchema.safeParse(cover);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(' · ') };
  await setFestivalCover(slug, parsed.data);
  return { slug };
}
