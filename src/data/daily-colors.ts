import type { GoalSlug } from '@/lib/goals';

/**
 * สีเสื้อมงคลรายวัน (spec ข้อ 3.6)
 * หลัก: ทักษา ตารางคงที่ตามวัน (เจ้าของยืนยัน 2026-10-11)
 * - วันเกิดของวันนั้นเป็น "บริวาร" แล้วเวียนตามลำดับทักษาไปยัง อายุ เดช ศรี มูละ อุตสาหะ มนตรี กาลกิณี
 * - แต่ละตำแหน่งใช้สีประจำดาวของตำแหน่งนั้น
 * - วันพุธใช้พุธกลางวัน
 * เปลี่ยนหลักในอนาคต: แก้ไฟล์นี้และ src/lib/daily-colors.ts ที่เดียว หน้าเว็บอ่านชื่อหลักจาก DAILY_COLORS_SOURCE
 */
export const DAILY_COLORS_SOURCE = {
  name: 'ทักษา ตารางคงที่ตามวัน',
  description:
    'ใช้วันของวันนี้เป็นบริวาร แล้วนับเวียนตามลำดับทักษา (อาทิตย์ จันทร์ อังคาร พุธ เสาร์ พฤหัสบดี ราหู ศุกร์) ไปยังอายุ เดช ศรี มูละ อุตสาหะ มนตรี และกาลกิณี แต่ละตำแหน่งใช้สีประจำดาว วันพุธใช้พุธกลางวัน',
} as const;

export type Planet = 'sun' | 'moon' | 'mars' | 'mercury' | 'saturn' | 'jupiter' | 'rahu' | 'venus';

/** ลำดับทักษา */
export const TAKSA_ORDER: Planet[] = ['sun', 'moon', 'mars', 'mercury', 'saturn', 'jupiter', 'rahu', 'venus'];

export const PLANET_NAME: Record<Planet, string> = {
  sun: 'อาทิตย์',
  moon: 'จันทร์',
  mars: 'อังคาร',
  mercury: 'พุธ',
  saturn: 'เสาร์',
  jupiter: 'พฤหัสบดี',
  rahu: 'ราหู',
  venus: 'ศุกร์',
};

export interface ShirtColor {
  /** ชื่อหลัก เช่น "สีเขียว" */
  name: string;
  /** สีใกล้เคียงที่ใช้แทนได้ */
  alt: string[];
  hex: string;
  /** สีไอคอนเสื้อบนวงกลม */
  ink: string;
}

/** สีประจำดาว */
export const PLANET_COLOR: Record<Planet, ShirtColor> = {
  sun: { name: 'สีแดง', alt: [], hex: '#C8323C', ink: '#FCE9EA' },
  moon: { name: 'สีเหลือง', alt: ['ครีม'], hex: '#E9C64A', ink: '#3A2F0B' },
  mars: { name: 'สีชมพู', alt: [], hex: '#E58FB1', ink: '#3D1222' },
  mercury: { name: 'สีเขียว', alt: [], hex: '#2F8A5B', ink: '#E9F5EC' },
  saturn: { name: 'สีม่วง', alt: ['ดำ'], hex: '#7B4FA0', ink: '#F1E9F8' },
  jupiter: { name: 'สีส้ม', alt: ['แสด'], hex: '#E8833A', ink: '#3A1D06' },
  rahu: { name: 'สีเทา', alt: ['น้ำตาล'], hex: '#8A8F98', ink: '#1A1D22' },
  venus: { name: 'สีฟ้า', alt: ['น้ำเงิน'], hex: '#6FA8DC', ink: '#0E2338' },
};

export type TaksaRole = 'บริวาร' | 'อายุ' | 'เดช' | 'ศรี' | 'มูละ' | 'อุตสาหะ' | 'มนตรี' | 'กาลกิณี';

/** ลำดับตำแหน่งทักษา นับจากวันนั้น */
export const TAKSA_ROLES: TaksaRole[] = ['บริวาร', 'อายุ', 'เดช', 'ศรี', 'มูละ', 'อุตสาหะ', 'มนตรี', 'กาลกิณี'];

export const ROLE_MEANING: Record<TaksaRole, string> = {
  บริวาร: 'คนรอบข้าง ครอบครัว ลูกน้อง',
  อายุ: 'สุขภาพ อายุยืน',
  เดช: 'อำนาจ บารมี การงาน',
  ศรี: 'โชคลาภ การเงิน เสน่ห์',
  มูละ: 'หลักทรัพย์ ฐานะมั่นคง',
  อุตสาหะ: 'ความขยัน ความพากเพียร',
  มนตรี: 'ผู้ใหญ่อุปถัมภ์ การคุ้มครอง',
  กาลกิณี: 'สีที่ควรเลี่ยง',
};

/** เป้าหมาย -> ตำแหน่งทักษา (เจ้าของยืนยัน 2026-10-11) */
export const GOAL_ROLE: Record<GoalSlug, Exclude<TaksaRole, 'กาลกิณี'>> = {
  money: 'ศรี',
  love: 'ศรี',
  career: 'เดช',
  health: 'อายุ',
  business: 'มูละ',
  study: 'อุตสาหะ',
  family: 'บริวาร',
  protection: 'มนตรี',
};
