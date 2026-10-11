import type { GoalSlug } from '@/lib/goals';
import type { Weekday } from '@/lib/thai-date';

/**
 * ปฏิทินมงคล (spec ข้อ 3.5) หลัก: กาลโยคตามประกาศสงกรานต์ (รายปี) + กติกาตามประเภทงาน
 * เจ้าของเลือก "คำนวณตามตำรา + นำเข้ารายปี" (2026-10-11)
 * วันธงชัย อธิบดี อุบาทว์ โลกาวินาศ เปลี่ยนตามปีจุลศักราช ใช้ตั้งแต่วันเถลิงศก ถึงวันก่อนเถลิงศกปีถัดไป
 * เพิ่มปีใหม่: ใส่ช่วงใหม่หลังประกาศสงกรานต์ออก (ราว ก.พ.-มี.ค.) ห้ามใช้ค่าที่คำนวณเองโดยไม่มีประกาศ
 */
export interface KalayokPeriod {
  /** จุลศักราช */
  cs: number;
  /** วันเถลิงศก (เริ่มใช้) และวันสุดท้ายที่ใช้ YYYY-MM-DD */
  from: string;
  to: string;
  thongchai: Weekday[];
  athibodi: Weekday[];
  ubat: Weekday[];
  lokawinat: Weekday[];
  sources: string[];
}

// 0 = อาทิตย์ ... 6 = เสาร์
export const KALAYOK: KalayokPeriod[] = [
  {
    cs: 1387,
    from: '2025-04-16',
    to: '2026-04-15',
    thongchai: [5],
    athibodi: [5],
    ubat: [4],
    lokawinat: [0],
    sources: ['https://www.thairath.co.th/lifestyle/2852728'],
  },
  {
    // ประกาศสงกรานต์ 2569: จันทร์เป็นทั้งธงชัยและโลกาวินาศ
    cs: 1388,
    from: '2026-04-16',
    to: '2027-04-15',
    thongchai: [1],
    athibodi: [6],
    ubat: [0],
    lokawinat: [1],
    sources: [
      'https://www.dailynews.co.th/news/5642291/',
      'https://th.wikipedia.org/wiki/กาลโยค',
      'https://www.amarintv.com/horoscope/article/534950',
    ],
  },
];

export type SpecialKind = 'thongchai' | 'athibodi' | 'ubat' | 'lokawinat';

export const SPECIAL_LABEL: Record<SpecialKind, string> = {
  thongchai: 'วันธงชัย',
  athibodi: 'วันอธิบดี',
  ubat: 'วันอุบาทว์',
  lokawinat: 'วันโลกาวินาศ',
};

/** ดิถีมหาสูญ (ทั้งข้างขึ้นและข้างแรม) เดือน -> ค่ำ */
export const MAHASUN: Record<number, number> = {
  1: 2, 4: 2,
  2: 12, 11: 12,
  3: 4, 6: 4,
  5: 6, 8: 6,
  7: 8, 10: 8,
  9: 10, 12: 10,
};

export type EventSlug = 'wedding' | 'new-house' | 'open-shop' | 'new-car';

export interface EventType {
  slug: EventSlug;
  name: string;
  goals: GoalSlug[];
  /** วันในสัปดาห์ที่ไม่นิยม */
  cautionWeekdays?: Weekday[];
  /** เดือนจันทรคติที่นิยม / ไม่นิยม */
  preferredMonths?: number[];
  cautionMonths?: number[];
  avoidMahasun?: boolean;
  /** ลำดับความดี: ธงชัยก่อน แล้วอธิบดี */
  rules: { text: string; source: string }[];
}

export const EVENT_TYPES: EventType[] = [
  {
    slug: 'wedding',
    name: 'แต่งงาน',
    goals: ['love', 'family'],
    cautionWeekdays: [2, 3, 4, 6],
    preferredMonths: [2, 4, 6, 9],
    cautionMonths: [12],
    avoidMahasun: true,
    rules: [
      { text: 'นิยมแต่งในเดือนคู่ (ยี่ ๔ ๖) เพราะสื่อถึงชีวิตคู่ เดือน ๖ นิยมมากที่สุด', source: 'https://www.thaipbs.or.th/news/content/341193' },
      { text: 'เดือน ๙ เป็นเดือนคี่แต่นิยม เพราะเก้าพ้องเสียงกับก้าว', source: 'https://www.thaipbs.or.th/news/content/341193' },
      { text: 'เดือน ๑๒ ไม่นิยมแต่ง แม้เป็นเดือนคู่ ปัจจุบันไม่เคร่งนัก', source: 'https://www.thaipbs.or.th/news/content/341193' },
      { text: 'ไม่นิยมแต่งวันอังคาร พุธ พฤหัสบดี และเสาร์', source: 'https://th.wikipedia.org/wiki/การแต่งงานแบบไทย' },
      { text: 'เลี่ยงวันอุบาทว์ วันโลกาวินาศ และดิถีมหาสูญ', source: 'https://www.sanook.com/horoscope/20121/' },
    ],
  },
  {
    slug: 'new-house',
    name: 'ขึ้นบ้านใหม่',
    goals: ['family', 'protection'],
    rules: [
      { text: 'นิยมเลือกวันธงชัย และเลี่ยงวันโลกาวินาศ', source: 'https://www.thaisoung.com/page/tips/auspicious-housewarming-date' },
      { text: 'วันธงชัยเหมาะกับการเริ่มต้นสิ่งใหม่ รวมถึงย้ายบ้าน', source: 'https://blog.allonline.7eleven.co.th/amulet24/auspicious-dates/auspicious-day-lucky-2569/' },
    ],
  },
  {
    slug: 'open-shop',
    name: 'เปิดร้าน / เปิดกิจการ',
    goals: ['business', 'money'],
    rules: [
      { text: 'เลือกวันธงชัยก่อน ถ้าไม่สะดวกค่อยใช้วันอธิบดี', source: 'https://www.ktc.co.th/article/knowledge/business/auspicious-days-to-open-shop-this-year' },
      { text: 'เลี่ยงวันโลกาวินาศสำหรับงานมงคล', source: 'https://blog.allonline.7eleven.co.th/amulet24/auspicious-dates/auspicious-day-lucky-2569/' },
    ],
  },
  {
    slug: 'new-car',
    name: 'ออกรถ',
    goals: ['protection'],
    rules: [
      { text: 'ออกรถวันธงชัยดีที่สุด รองลงมาคือวันอธิบดี', source: 'https://www.chubb.com/th-th/articles/personal/lucky-days-to-get-a-new-car-2025.html' },
      { text: 'เลี่ยงวันอุบาทว์และวันโลกาวินาศ', source: 'https://www.chubb.com/th-th/articles/personal/lucky-days-to-get-a-new-car-2025.html' },
    ],
  },
];

export const getEventType = (slug: string) => EVENT_TYPES.find((e) => e.slug === slug);
