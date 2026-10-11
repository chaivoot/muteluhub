import { FESTIVALS, type Festival, type FestivalDate } from '@/data/festivals';
import { addDays } from '@/lib/thai-date';

export interface FestivalOccurrence {
  festival: Festival;
  date: FestivalDate;
  status: 'ongoing' | 'upcoming';
}

/**
 * เทศกาลที่กำลังจัดอยู่ หรือจะเริ่มภายใน withinDays วัน
 * (ปล่อยหน้าก่อนเทศกาล 4-6 สัปดาห์ จึงตั้งค่าเริ่มต้น 45 วัน)
 */
export function upcomingFestivals(
  todayIso: string,
  withinDays = 45,
  festivals: Festival[] = FESTIVALS,
): FestivalOccurrence[] {
  const horizon = addDays(todayIso, withinDays);
  const result: FestivalOccurrence[] = [];
  for (const festival of festivals) {
    for (const date of festival.dates) {
      if (date.end < todayIso || date.start > horizon) continue;
      result.push({ festival, date, status: date.start <= todayIso ? 'ongoing' : 'upcoming' });
    }
  }
  return result.sort((a, b) => a.date.start.localeCompare(b.date.start));
}

export function getFestival(slug: string): Festival | undefined {
  return FESTIVALS.find((f) => f.slug === slug);
}

/** วันที่ของปีปัจจุบัน ถ้าไม่มีใช้ปีล่าสุดที่มีข้อมูล */
export function currentFestivalDate(festival: Festival, todayIso: string): FestivalDate | undefined {
  const sorted = festival.dates.slice().sort((a, b) => a.start.localeCompare(b.start));
  return sorted.find((d) => d.end >= todayIso) ?? sorted.at(-1);
}
