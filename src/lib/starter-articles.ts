import { articleSchema, type ArticleInput } from '@/lib/import/article-schema';

/**
 * บทความตั้งต้นที่ Claude เขียนไว้ใน repo (data/articles/*.json)
 * Claude เขียนฐานข้อมูล production ไม่ได้ จึงให้เจ้าของกดนำเข้าที่ /admin/articles
 * นำเข้าเป็นฉบับร่าง ข้าม slug ที่มีอยู่แล้ว ไม่เขียนทับของที่แก้ไปแล้ว
 * เพิ่มบทความใหม่: วางไฟล์ JSON ใน data/articles แล้วเพิ่มรายการที่นี่
 */
const RAW: unknown[] = [];

export function starterArticles(): ArticleInput[] {
  return RAW.map((r) => articleSchema.parse({ cover: null, published: false, seoTitle: null, ...(r as object) }));
}
