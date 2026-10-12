import type { Planet } from './daily-colors';

/**
 * สินค้า affiliate (Shopee) นำเข้าผ่าน /admin/import?kind=products
 * แสดงในเนื้อหาเท่านั้น มีป้าย ลิงก์ affiliate ทุกจุด (spec: ไม่มีแบนเนอร์)
 */
export interface Product {
  slug: string;
  name: string;
  brand?: string;
  /** ลิงก์ affiliate จากหน้า Shopee Affiliate */
  url: string;
  image: { src: string; alt: string };
  /** เสื้อสำหรับสีมงคล: ดาวเจ้าของสีตามทักษา */
  shirtColor?: Planet;
  /** เฉดรองของสีเดียวกัน เช่น ครีม (สีเหลือง) */
  shade?: string;
  checkedAt: string;
  published: boolean;
  notes: string[];
}

/** ข้อมูลที่ส่งไปฝั่ง client สำหรับปุ่มเสื้อสีมงคล */
export type ShirtOffer = Pick<Product, 'slug' | 'name' | 'url' | 'image'>;
