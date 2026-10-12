/**
 * ช่อง prompt ที่เว็บคำนวณให้เองจากช่องอื่น (ผู้ใช้ไม่ต้องกรอก)
 * ใช้เครื่องมือตัวเดียวกับหน้าเลขมงคลและหน้าสีเสื้อ คำนวณฝั่ง client เท่านั้น
 */
import type { PromptTemplate } from '@/data/prompt-templates';
import { colorLabel, getShirtColor } from '@/lib/daily-colors';
import { calculateLuckyNumbers, LUCKY_NUMBER_METHOD, type LuckyNumberResult } from '@/lib/lucky-number';
import type { PromptValues } from '@/lib/prompts';
import { TH_WEEKDAYS, type Weekday } from '@/lib/thai-date';

export type ComputedKind = 'lucky-method' | 'lucky-numbers' | 'color-lucky' | 'color-avoid';

/** "5, 9, 24 (เลขเส้นทางชีวิต 5, เลขวันเกิด 3)" ใช้ทั้งหน้าเลขมงคลและหน้า prompt */
export const luckyNumbersText = (r: LuckyNumberResult) =>
  `${r.luckyNumbers.join(', ')} (เลขเส้นทางชีวิต ${r.lifePath}, เลขวันเกิด ${r.birthday})`;

/** "จันทร์" / "วันจันทร์" -> 1 */
export function parseWeekday(value: string): Weekday | null {
  const name = value.trim().replace(/^วัน/, '');
  const i = TH_WEEKDAYS.findIndex((d) => d === name);
  return i < 0 ? null : (i as Weekday);
}

function parseIsoDate(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  return m ? { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) } : null;
}

export function derivedValues(t: PromptTemplate, values: PromptValues): PromptValues {
  const goal = t.goals.length === 1 ? t.goals[0] : null;
  const out: PromptValues = {};
  for (const f of t.requiredFields) {
    if (!f.computed || !goal) continue;
    if (f.computed === 'lucky-method') out[f.key] = LUCKY_NUMBER_METHOD.name;
    if (f.computed === 'lucky-numbers') {
      const birth = parseIsoDate(values.birth_date ?? '');
      try {
        if (birth) out[f.key] = luckyNumbersText(calculateLuckyNumbers(birth, goal));
      } catch {
        // วันเกิดไม่ถูกต้อง: ปล่อยว่างให้ฟอร์มบอกว่ายังไม่ครบ
      }
    }
    if (f.computed === 'color-lucky' || f.computed === 'color-avoid') {
      const weekday = parseWeekday(values.weekday ?? '');
      if (weekday == null) continue;
      const { lucky, avoid } = getShirtColor(weekday, goal);
      out[f.key] = colorLabel(f.computed === 'color-lucky' ? lucky.color : avoid.color);
    }
  }
  return out;
}
