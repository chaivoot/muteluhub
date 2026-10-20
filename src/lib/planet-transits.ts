import {
  PLANET_BASELINES,
  PLANET_TRANSITS,
  PLANETS,
  type PlanetInfo,
  type PlanetTransit,
  type ZodiacSign,
} from '@/data/planet-transits';
import { addDays } from '@/lib/thai-date';

const THAI_DIGITS = '๐๑๒๓๔๕๖๗๘๙';

/** เนื้อหาโหราศาสตร์ไทยใช้เลขไทย */
export const thaiDigits = (s: string | number) => String(s).replace(/[0-9]/g, (d) => THAI_DIGITS[Number(d)]);

export interface PlanetPosition {
  planet: PlanetInfo;
  sign: ZodiacSign;
  /** วันที่เข้าราศีนี้ (ถ้ารู้) */
  since: string | null;
  /** ย้ายราศีครั้งถัดไป */
  next: PlanetTransit | null;
  /** กำลังอยู่ในช่วงพักร์ */
  retrograde: PlanetTransit | null;
}

const byDate = (a: PlanetTransit, b: PlanetTransit) => a.date.localeCompare(b.date);

/** ดาวแต่ละดวงอยู่ราศีไหนในวันที่ระบุ (เฉพาะดวงที่มีข้อมูล) */
export function planetPositions(todayIso: string, transits = PLANET_TRANSITS, baselines = PLANET_BASELINES): PlanetPosition[] {
  const result: PlanetPosition[] = [];
  for (const planet of PLANETS) {
    const own = transits.filter((t) => t.planet === planet.slug).sort(byDate);
    const ingresses = own.filter((t) => t.kind === 'ingress' && t.to);
    const last = [...ingresses].reverse().find((t) => t.date <= todayIso);
    const base = baselines.find((b) => b.planet === planet.slug && b.asOf <= todayIso);
    const sign: ZodiacSign | null = last?.to ?? base?.sign ?? null;
    const since = last?.date ?? base?.asOf ?? null;
    if (!sign) continue;
    const retrograde = own.find((t) => t.kind === 'retrograde-period' && t.date <= todayIso && (t.end ?? t.date) >= todayIso) ?? null;
    result.push({ planet, sign, since, next: ingresses.find((t) => t.date > todayIso) ?? null, retrograde });
  }
  return result;
}

/** เหตุการณ์ที่กำลังเกิดหรือจะเกิดภายใน withinDays วัน (ใช้ขึ้นหน้าแรก) */
export function upcomingTransits(todayIso: string, withinDays: number, transits = PLANET_TRANSITS): PlanetTransit[] {
  const horizon = addDays(todayIso, withinDays);
  return transits
    .filter((t) => (t.end ?? t.date) >= todayIso && t.date <= horizon)
    .sort(byDate);
}

/** ข้อความสั้นของเหตุการณ์ เช่น "พฤหัสบดี (๕) ย้ายจากกรกฎเข้าสิงห์" */
export function transitTitle(t: PlanetTransit): string {
  const p = PLANETS.find((x) => x.slug === t.planet)!;
  const who = `${p.name} (${thaiDigits(p.number)})`;
  if (t.kind === 'retrograde-period') return `${who} พักร์ (เดินถอยหลัง)${t.to ? ` ในราศี${t.to}` : ''}`;
  return t.from ? `${who} ย้ายจากราศี${t.from}เข้าราศี${t.to}` : `${who} ย้ายเข้าราศี${t.to}`;
}
