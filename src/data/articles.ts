import type { GoalSlug } from '@/lib/goals';

/** รูปพร้อมเครดิต (src = /media/<id> ที่อัปโหลดจากหลังบ้าน หรือ path ใน public) */
export interface ArticleImage {
  src: string;
  alt: string;
  credit: string;
}

/** บทความที่เขียนจากหลังบ้าน เนื้อหาเป็น markdown แบบย่อ (ดู src/lib/markdown.tsx) */
export interface Article {
  slug: string;
  title: string;
  /** สรุปสั้น ใช้บนการ์ดและ meta description */
  excerpt: string;
  body: string;
  cover: ArticleImage | null;
  goals: GoalSlug[];
  /** ผูกกับหน้าเทศกาล (slug) ถ้ามี จะขึ้นลิงก์ในหน้าเทศกาลนั้น */
  festival: string | null;
  seoTitle: string | null;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export type FestivalCover = ArticleImage;
