import { z } from 'zod';
import { FESTIVALS } from '@/data/festivals';
import { GOALS } from '@/lib/goals';

/** ตรวจบทความจากฟอร์มหลังบ้าน */
const imageSrc = z
  .string()
  .trim()
  .refine((s) => /^\/media\/[A-Za-z0-9_-]+$/.test(s) || /^\/images\/[\w./-]+$/.test(s), 'รูปต้องอัปโหลดผ่านหลังบ้าน');

export const imageSchema = z.object({
  src: imageSrc,
  alt: z.string().trim().min(1, 'ใส่คำอธิบายรูป (alt)').max(200),
  credit: z.string().trim().min(1, 'ใส่เครดิตรูป เช่น ภาพประกอบ หรือชื่อช่างภาพ').max(120),
});

export const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug ใช้ a-z 0-9 และขีด (-) เท่านั้น เช่น halloween-mutelu-tips')
    .max(80),
  title: z.string().trim().min(4, 'ใส่ชื่อบทความ').max(160),
  excerpt: z.string().trim().min(10, 'ใส่สรุปสั้น ๆ อย่างน้อย 10 ตัวอักษร').max(300),
  body: z.string().trim().min(20, 'ใส่เนื้อหาบทความ').max(60000),
  cover: imageSchema.nullable(),
  goals: z.array(z.enum(GOALS.map((g) => g.slug) as [string, ...string[]])).max(8),
  festival: z
    .string()
    .nullable()
    .refine((s) => s === null || FESTIVALS.some((f) => f.slug === s), 'ไม่พบเทศกาลนี้'),
  seoTitle: z.string().trim().max(120).nullable(),
  published: z.boolean(),
});

export type ArticleInput = z.infer<typeof articleSchema>;
