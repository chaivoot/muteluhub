import type { GoalSlug } from '@/lib/goals';

/**
 * หมอดู (ตาราง fortune_tellers ใน spec ข้อ 5) เก็บใน Neon Postgres นำเข้าผ่าน /admin/import
 * - ไม่มีรูปจริงรายคน ใช้ภาพ default ตามศาสตร์หลัก (spec หลักการข้อ 2) เลือกแบบคงที่จาก hash ของ slug
 * - notes เป็นบันทึกภายใน แสดงเฉพาะหลังบ้าน
 */
export type Channel = 'shop' | 'online' | 'line' | 'phone';

export const CHANNEL_LABEL: Record<Channel, string> = {
  shop: 'หน้าร้าน',
  online: 'ออนไลน์',
  line: 'LINE',
  phone: 'โทร',
};

export const CHANNELS = Object.keys(CHANNEL_LABEL) as Channel[];

export interface Contact {
  phone?: string;
  line?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  website?: string;
}

export interface FortuneTeller {
  slug: string;
  /** หมวดที่ปักหมุด (slug ศาสตร์ หรือ 'all' = หน้ารวมหมอดู) ตั้งจากหลังบ้าน */
  pinnedIn?: string[];
  name: string;
  /** slug ศาสตร์จาก data/disciplines.json ตัวแรกคือศาสตร์หลัก (ใช้เลือกภาพ default) */
  disciplines: string[];
  goals: GoalSlug[];
  channels: Channel[];
  /** ไม่มี = ดูออนไลน์อย่างเดียว */
  provinceSlug?: string;
  district?: string;
  bio: string;
  hours?: string;
  /** ราคาเริ่มต้น (บาท) */
  priceFrom?: number;
  priceNote?: string;
  contact: Contact;
  mapsUrl?: string;
  claimed: boolean;
  checkedAt: string;
  published: boolean;
  notes: string[];
  sources: string[];
}

export interface PriceBucket {
  slug: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_BUCKETS: PriceBucket[] = [
  { slug: 'under-500', label: 'ไม่เกิน 500 บาท', min: 0, max: 500 },
  { slug: '500-1000', label: '500-1,000 บาท', min: 500, max: 1000 },
  { slug: '1000-3000', label: '1,000-3,000 บาท', min: 1000, max: 3000 },
  { slug: 'over-3000', label: 'มากกว่า 3,000 บาท', min: 3000, max: Infinity },
];
