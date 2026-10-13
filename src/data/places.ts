import type { GoalSlug } from '@/lib/goals';

/**
 * สถานที่เสริมดวง (ตาราง places ใน spec ข้อ 5) เก็บใน Neon Postgres นำเข้าผ่าน /admin/import
 * - ภาพต้องเป็นภาพจริงพร้อมเครดิตและ license เท่านั้น (ถ่ายเอง, Wikimedia Commons ที่เช็ก license, ขออนุญาต)
 *   ห้ามดึงจาก Google Maps ห้ามใช้ภาพตัวอย่างใน design/mockups/images
 * - ข้อมูลทุกช่องต้องมีแหล่งอ้างอิงใน sources ไม่แน่ใจให้เว้นว่าง (null / [])
 * - notes เป็นบันทึกภายใน แสดงเฉพาะหลังบ้าน ห้ามแสดงบนหน้าเว็บ
 */
export type PlaceType = 'temple' | 'shrine' | 'devalai' | 'chinese-shrine';

export interface PlaceImage {
  src: string;
  alt: string;
  author: string;
  license: string;
  /** หน้าไฟล์ต้นฉบับ (เช่น Wikimedia Commons) ว่างได้สำหรับรูปที่อัปโหลดเอง */
  sourceUrl: string;
}

export interface Place {
  slug: string;
  name: string;
  nameEn?: string;
  type: PlaceType;
  /** ชื่อองค์เทพ / สิ่งศักดิ์สิทธิ์ (ตาราง deities) */
  deities: string[];
  goals: GoalSlug[];
  /** รหัสประเทศ ISO 3166-1 เช่น TH, JP (ต่างประเทศดู src/data/countries.ts) */
  country: string;
  /** เฉพาะในไทย */
  provinceSlug?: string;
  /** เฉพาะต่างประเทศ ชื่อเมืองภาษาไทย */
  city?: string;
  district?: string;
  lat: number | null;
  lng: number | null;
  openingHours: string | null;
  summary: string;
  offerings: string[];
  howToPray: string[];
  howToRepayVow: string[];
  /** รูปจากไฟล์นำเข้า + รูปที่อัปโหลดจากหลังบ้าน (อัปโหลดอยู่ก่อน) */
  images: PlaceImage[];
  /** เฉพาะรูปที่อัปโหลดจากหลังบ้าน (ไม่มาจากไฟล์นำเข้า) ใช้ให้หลังบ้านลบได้ */
  uploadedImages?: PlaceImage[];
  sources: string[];
  /** ลิงก์ Agoda ที่ใส่เอง ใช้แทนลิงก์ที่ประกอบอัตโนมัติ */
  agodaLinkOverride?: string;
  mapsUrl?: string;
  /** วันที่ตรวจข้อมูลล่าสุด YYYY-MM-DD */
  checkedAt: string;
  published: boolean;
  /** ปักหมุดจากหลังบ้าน (คอลัมน์ pinned_in) เช่น 'home' = แนะนำหน้าแรก */
  pinnedIn?: string[];
  notes: string[];
}

export const PLACE_TYPE_LABEL: Record<PlaceType, string> = {
  temple: 'วัด',
  shrine: 'ศาล',
  devalai: 'เทวาลัย',
  'chinese-shrine': 'ศาลเจ้าจีน',
};
