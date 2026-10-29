import { ECLIPSES, type Eclipse } from '@/data/eclipses';
import { addDays } from '@/lib/thai-date';

/** วันสุดท้ายของปรากฏการณ์ (ข้ามเที่ยงคืนนับเป็นวันถัดไป) */
export const eclipseEndDate = (e: Eclipse) => (e.end < e.start ? addDays(e.date, 1) : e.date);

const byDate = (a: Eclipse, b: Eclipse) => a.date.localeCompare(b.date);

/** อุปราคาที่ยังไม่จบ และเริ่มภายใน withinDays วัน */
export function upcomingEclipses(todayIso: string, withinDays = Infinity, eclipses = ECLIPSES): Eclipse[] {
  const horizon = Number.isFinite(withinDays) ? addDays(todayIso, withinDays) : '9999-12-31';
  return eclipses.filter((e) => eclipseEndDate(e) >= todayIso && e.date <= horizon).sort(byDate);
}

export function pastEclipses(todayIso: string, eclipses = ECLIPSES): Eclipse[] {
  return eclipses.filter((e) => eclipseEndDate(e) < todayIso).sort(byDate).reverse();
}

/** เช่น "จันทรุปราคาเต็มดวง" */
export function eclipseTitle(e: Eclipse): string {
  return `${e.kind === 'solar' ? 'สุริยุปราคา' : 'จันทรุปราคา'}${e.type === 'total' ? 'เต็มดวง' : 'บางส่วน'}`;
}
