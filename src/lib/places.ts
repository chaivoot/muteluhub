import type { Place } from '@/data/places';
import { countryByCode } from '@/data/countries';
import { PROVINCES, provinceShortName } from '@/data/provinces';
import type { GoalSlug } from '@/lib/goals';

export interface PlaceFilter {
  goal?: GoalSlug | null;
  deity?: string | null;
  province?: string | null;
}

/** สถานที่ในไทย / ต่างประเทศ */
export const thaiPlaces = (places: Place[]) => places.filter((p) => p.country === 'TH');
export const abroadPlaces = (places: Place[], code?: string) =>
  places.filter((p) => p.country !== 'TH' && (!code || p.country === code));

export function filterPlaces(filter: PlaceFilter, places: Place[]): Place[] {
  return places.filter(
    (p) =>
      (!filter.goal || p.goals.includes(filter.goal)) &&
      (!filter.deity || p.deities.includes(filter.deity)) &&
      (!filter.province || p.provinceSlug === filter.province),
  );
}

export const getPlace = (slug: string, places: Place[]) => places.find((p) => p.slug === slug);

export const isProvinceSlug = (slug: string) => slug in PROVINCES;

/** จังหวัดที่มีสถานที่อย่างน้อย 1 แห่ง เรียงตามจำนวน */
export function provincesWithPlaces(places: Place[]): { slug: string; name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of places) if (p.provinceSlug) counts.set(p.provinceSlug, (counts.get(p.provinceSlug) ?? 0) + 1);
  return [...counts]
    .map(([slug, count]) => ({ slug, name: PROVINCES[slug] ?? slug, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'th'));
}

export function deitiesOf(places: Place[]): string[] {
  return [...new Set(places.flatMap((p) => p.deities))].sort((a, b) => a.localeCompare(b, 'th'));
}

/** สถานที่ใกล้เคียงหรือคล้ายกัน: จังหวัดเดียวกันก่อน แล้วค่อยเป้าหมายที่ตรงกัน */
export function relatedPlaces(place: Place, limit = 4, places: Place[]): Place[] {
  const score = (p: Place) =>
    (p.country === place.country && (p.provinceSlug ?? p.city) === (place.provinceSlug ?? place.city) ? 10 : 0) +
    (p.country === place.country ? 3 : 0) + p.goals.filter((g) => place.goals.includes(g)).length;
  return places
    .filter((p) => p.slug !== place.slug)
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p);
}

/** ลิงก์เปิดแผนที่จากพิกัด (ลิงก์เท่านั้น ไม่ดึงรูปจาก Google Maps) */
export function mapLink(place: Place): string | null {
  if (place.mapsUrl) return place.mapsUrl;
  if (place.lat == null || place.lng == null) return null;
  return `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
}

/** "กรุงเทพฯ" หรือ "เกียวโต · ญี่ปุ่น" */
export function placeLocation(place: Place, withCountry = true): string {
  if (place.country === 'TH') return provinceShortName(place.provinceSlug ?? '');
  const country = countryByCode(place.country)?.name ?? place.country;
  return withCountry ? [place.city, country].filter(Boolean).join(' · ') : (place.city ?? country);
}
