import type { GoalSlug } from '@/lib/goals';

/**
 * เทศกาล: URL ไม่มีปี (/festival/[slug]) เนื้อหาอัปเดตทุกปี
 * วันที่แยกเป็นรายปีใน dates (ตาราง festival_dates ใน spec)
 * ใส่เฉพาะวันที่ที่ยืนยันแล้วเท่านั้น
 */
export interface FestivalDate {
  year: number; // ค.ศ.
  start: string; // YYYY-MM-DD
  end: string;
  prep?: string;
  notes?: string;
}

export interface SourcedText {
  text: string;
  source?: string;
}

export interface FestivalVenue {
  name: string;
  province: string;
  placeName?: string;
  /** วันจัดงานปีนี้ (ถ้าประกาศแล้ว) */
  dates?: string;
  description: string;
  sources: string[];
}

export interface FestivalFaq {
  q: string;
  a: string;
  source?: string;
}

/** เนื้อหาหน้าเทศกาล อัปเดตทุกปี (URL ไม่มีปี) ทุกข้อเท็จจริงต้องมีแหล่งอ้างอิง */
export interface FestivalContent {
  intro: string;
  /** หมายเหตุวันตามจันทรคติ */
  lunarNote?: string;
  rules: SourcedText[];
  /** หัวข้อของรายการพิเศษ เช่น ผักกลิ่นฉุน 5 ชนิด */
  specialList?: { title: string; items: string[]; source?: string };
  venues: FestivalVenue[];
  faq: FestivalFaq[];
  healthNote?: string;
  sources: string[];
  /** วันที่ตรวจเนื้อหาล่าสุด */
  checkedAt: string;
}

export interface Festival {
  slug: string;
  name: string;
  tagline: string;
  goals: GoalSlug[];
  dates: FestivalDate[];
  image?: { src: string; alt: string; credit: string };
  content?: FestivalContent;
}

export const FESTIVALS: Festival[] = [
  {
    slug: 'kinje',
    name: 'เทศกาลกินเจ',
    tagline: 'ข้อควรรู้ ของไหว้ สถานที่จัดงาน ที่พัก',
    goals: ['health', 'protection'],
    dates: [
      // อ้างอิง spec: กินเจ 2569 = 10-18 ต.ค. 2569 (ล้างท้อง 9 ต.ค.)
      { year: 2026, start: '2026-10-10', end: '2026-10-18', prep: '2026-10-09', notes: 'ล้างท้อง 9 ต.ค.' },
    ],
  },
];
