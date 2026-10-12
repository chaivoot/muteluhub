import type { Place } from '@/data/places';
import { countryByCode } from '@/data/countries';
import { DEITY_GROUPS, deityGroup, inDeityGroup, type DeityGroup } from '@/data/deity-groups';
import { PROVINCES, provinceShortName } from '@/data/provinces';
import type { GoalSlug } from '@/lib/goals';

export interface PlaceFilter {
  goal?: GoalSlug | null;
  /** slug ของกลุ่มองค์เทพใน DEITY_GROUPS */
  deity?: string | null;
  /** ข้อความที่ผู้ใช้พิมพ์เอง หาในชื่อองค์เทพแบบบางส่วน (ใช้เมื่อไม่ได้เลือกกลุ่ม) */
  deityText?: string | null;
  province?: string | null;
}

/** สถานที่ในไทย / ต่างประเทศ */
export const thaiPlaces = (places: Place[]) => places.filter((p) => p.country === 'TH');
export const abroadPlaces = (places: Place[], code?: string) =>
  places.filter((p) => p.country !== 'TH' && (!code || p.country === code));

export function filterPlaces(filter: PlaceFilter, places: Place[]): Place[] {
  const group = filter.deity ? deityGroup(filter.deity) : undefined;
  const text = normalizeDeity(filter.deityText ?? '');
  return places.filter(
    (p) =>
      (!filter.goal || p.goals.includes(filter.goal)) &&
      (!filter.deity || (group != null && inDeityGroup(group, p.deities))) &&
      (!text || p.deities.some((d) => normalizeDeity(d).includes(text))) &&
      (!filter.province || p.provinceSlug === filter.province),
  );
}

export const getPlace = (slug: string, places: Place[]) => places.find((p) => p.slug === slug);

export const isProvinceSlug = (slug: string) => slug in PROVINCES;

/** จังหวัดที่มีสถานที่อย่างน้อย 1 แห่ง เรียงตามตัวอักษร */
export function provincesWithPlaces(places: Place[]): { slug: string; name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of places) if (p.provinceSlug) counts.set(p.provinceSlug, (counts.get(p.provinceSlug) ?? 0) + 1);
  return [...counts]
    .map(([slug, count]) => ({ slug, name: PROVINCES[slug] ?? slug, count }))
    .sort((a, b) => a.name.localeCompare(b.name, 'th'));
}

const normalizeDeity = (s: string) => s.replace(/\s+/g, '').toLowerCase();

export type DeitySuggestion =
  | { kind: 'group'; slug: string; label: string; count: number }
  | { kind: 'text'; label: string; count: number };

/**
 * ตัวเลือกในช่ององค์เทพ: ไม่พิมพ์ = ทุกกลุ่ม, พิมพ์ = กลุ่มที่ชื่อกลุ่มหรือชื่อองค์เทพในกลุ่มตรง
 * แล้วตามด้วยชื่อองค์เทพที่ไม่อยู่ในกลุ่มไหน (เช่น เจ้าพ่อพระกาฬ)
 */
export function deitySuggestions(places: Place[], query: string, limit = 12): DeitySuggestion[] {
  const q = normalizeDeity(query);
  const groups: DeitySuggestion[] = deitiesOf(places)
    .filter(
      (g) =>
        !q ||
        normalizeDeity(g.label).includes(q) ||
        places.some((p) => p.deities.some((d) => g.match.test(d) && normalizeDeity(d).includes(q))),
    )
    .map((g) => ({ kind: 'group', slug: g.slug, label: g.label, count: g.count }));
  if (!q) return groups;
  const loose = new Map<string, number>();
  for (const p of places)
    for (const d of new Set(p.deities))
      if (normalizeDeity(d).includes(q) && !DEITY_GROUPS.some((g) => g.match.test(d)))
        loose.set(d, (loose.get(d) ?? 0) + 1);
  const texts: DeitySuggestion[] = [...loose]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'th'))
    .map(([label, count]) => ({ kind: 'text', label, count }));
  return [...groups, ...texts].slice(0, limit);
}

/** กลุ่มองค์เทพที่มีสถานที่อย่างน้อย 1 แห่ง เรียงตามจำนวน (มากก่อน) */
export function deitiesOf(places: Place[]): (DeityGroup & { count: number })[] {
  return DEITY_GROUPS.map((g) => ({ ...g, count: places.filter((p) => inDeityGroup(g, p.deities)).length }))
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'th'));
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
