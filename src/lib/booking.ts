import {
  TRAVELOKA_ABROAD_CITY,
  TRAVELOKA_AFFILIATE_BASE,
  TRAVELOKA_PLACE,
  TRAVELOKA_PROVINCE,
  type TravelokaPage,
} from '@/data/traveloka-urls';

/**
 * ลิงก์ที่พัก Traveloka ผ่าน Involve Asia (แทน Agoda ตั้งแต่ 2026-10-29)
 * deeplink = <ลิงก์ฐาน invl.me ของ Property muteluhub>?url=<หน้า Traveloka ที่ encode แล้ว>
 * ลิงก์ฐานตัวเดียวใช้ได้กับทุกหน้า ยอดเข้า Affiliate ID เดียวกัน เปลี่ยนลิงก์ฐานแก้ที่ TRAVELOKA_AFFILIATE_BASE จุดเดียว
 * เก็บ URL หน้า Traveloka ที่ยังไม่แปลงไว้ในข้อมูล แปลงตอน render
 * หน้าที่ใช้: landmark (ใกล้สถานที่) > area (ย่าน/อำเภอ) > จังหวัด/เมือง ห้ามใช้ hotel/detail?spec= (มีวันเข้าพักฝัง)
 */
export interface LodgingTarget {
  slug?: string;
  country: string;
  provinceSlug?: string;
  city?: string;
  /** หน้า Traveloka ที่ใส่เองตอนนำเข้า ใช้ก่อนรายการในโค้ด */
  travelokaUrl?: string;
}

const TRAVELOKA_HOST = /^https:\/\/www\.traveloka\.com\//;

/** หน้า Traveloka ที่แคบที่สุดที่มีสำหรับสถานที่/จังหวัดนี้ */
export function travelokaPage(target: LodgingTarget): TravelokaPage | null {
  if (target.travelokaUrl && TRAVELOKA_HOST.test(target.travelokaUrl)) return { url: target.travelokaUrl, level: 'landmark' };
  const own = target.slug ? TRAVELOKA_PLACE[target.slug] : undefined;
  if (own) return own;
  if (target.country === 'TH') return (target.provinceSlug && TRAVELOKA_PROVINCE[target.provinceSlug]) || null;
  return (target.city && TRAVELOKA_ABROAD_CITY[target.city]) || null;
}

/** แปลงหน้า Traveloka เป็นลิงก์ affiliate (ไม่มีลิงก์ฐาน = ไม่แสดง) */
export function bookingLink(rawUrl: string, base: string | null = TRAVELOKA_AFFILIATE_BASE): string | null {
  if (!base || !TRAVELOKA_HOST.test(rawUrl)) return null;
  return `${base}?url=${encodeURIComponent(rawUrl)}`;
}

/** ลิงก์ที่พักพร้อมระดับความใกล้ (near = หน้า landmark หรือย่านของสถานที่นั้น) */
export function lodgingLink(target: LodgingTarget, base: string | null = TRAVELOKA_AFFILIATE_BASE) {
  const page = travelokaPage(target);
  const href = page ? bookingLink(page.url, base) : null;
  return href && page ? { href, near: page.level === 'landmark' || page.level === 'area' } : null;
}
