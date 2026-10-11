import type { GoalSlug } from '@/lib/goals';
import type { Weekday } from '@/lib/thai-date';

/**
 * สีเสื้อมงคลรายวัน (ตาราง daily_colors ใน spec)
 *
 * ยังไม่ได้ข้อสรุปหลักทักษาที่ใช้ (spec ข้อ 8) จึงมีแค่ข้อมูลตัวอย่างจากม็อกอัป
 * ห้ามเพิ่มเป็นข้อมูลจริงจนกว่าเจ้าของจะยืนยันหลักและแหล่งอ้างอิง
 * เมื่อยืนยันแล้ว: ใส่ source ให้ตรงแหล่ง และเปลี่ยน DAILY_COLORS_STATUS เป็น 'confirmed'
 */
export type TaksaRole = 'บริวาร' | 'อายุ' | 'เดช' | 'ศรี' | 'มูละ' | 'อุตสาหะ' | 'มนตรี' | 'กาลกิณี';

export interface DailyColor {
  weekday: Weekday;
  /** ไม่มี goal = ใช้กับทุกเป้าหมาย (เช่น สีที่ควรเลี่ยง) */
  goal?: GoalSlug;
  colorName: string;
  hex: string;
  taksaRole?: TaksaRole;
  avoid: boolean;
  source: string;
}

export const DAILY_COLORS_STATUS: 'sample' | 'confirmed' = 'sample';

export const DAILY_COLORS: DailyColor[] = [
  { weekday: 0, goal: 'money', colorName: 'สีเขียว', hex: '#2F8A5B', avoid: false, source: 'sample-mockup' },
  { weekday: 0, colorName: 'สีฟ้า', hex: '#7FB3E0', avoid: true, source: 'sample-mockup' },
  { weekday: 0, colorName: 'สีน้ำเงิน', hex: '#2B4C9B', avoid: true, source: 'sample-mockup' },
];
