import type { GoalSlug } from '@/lib/goals';

/** ความหมายคู่เลขและผลรวมเบอร์มงคล (ความเชื่อ รวบรวมจากหลายแหล่ง) ข้อมูลจริงจะเติมในไฟล์นี้ */
export interface PhoneMeaning {
  level: 'good' | 'neutral' | 'bad';
  meaning: string;
  goals: GoalSlug[];
  agreement: 'high' | 'medium' | 'low';
}

export const PHONE_METHOD_NOTES: string[] = [];
export const PHONE_PAIRS: Record<string, PhoneMeaning> = {};
export const PHONE_SUMS: Record<number, PhoneMeaning> = {};
