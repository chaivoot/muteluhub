import { PRICE_BUCKETS, type Channel, type FortuneTeller } from '@/data/fortune-tellers';
import type { GoalSlug } from '@/lib/goals';

export interface TellerFilter {
  goal?: GoalSlug | null;
  discipline?: string | null;
  channel?: Channel | null;
  province?: string | null;
  price?: string | null;
}

export function inPriceBucket(t: FortuneTeller, bucketSlug: string): boolean {
  const b = PRICE_BUCKETS.find((x) => x.slug === bucketSlug);
  if (!b) return true;
  return t.priceFrom != null && t.priceFrom >= b.min && t.priceFrom < b.max;
}

export function filterTellers(f: TellerFilter, tellers: FortuneTeller[]): FortuneTeller[] {
  return tellers.filter(
    (t) =>
      (!f.goal || t.goals.includes(f.goal)) &&
      (!f.discipline || t.disciplines.includes(f.discipline)) &&
      (!f.channel || t.channels.includes(f.channel)) &&
      (!f.province || t.provinceSlug === f.province) &&
      (!f.price || inPriceBucket(t, f.price)),
  );
}

/** หมุดของหน้ารวมหมอดู */
export const PIN_ALL = 'all';

/** หมอดูที่ปักหมุดในหมวดนี้ขึ้นก่อน (คงลำดับเดิมในแต่ละกลุ่ม) */
export function sortPinned(tellers: FortuneTeller[], pin: string): FortuneTeller[] {
  const isPinned = (t: FortuneTeller) => t.pinnedIn?.includes(pin) ?? false;
  return [...tellers.filter(isPinned), ...tellers.filter((t) => !isPinned(t))];
}

/** จำนวนตัวกรองใน bottom sheet ที่เลือกอยู่ (ไม่นับเป้าหมาย ซึ่งอยู่แถวบนเสมอ) */
export const activeFilterCount = (f: TellerFilter) =>
  [f.discipline, f.channel, f.province, f.price].filter(Boolean).length;

/** หมอดูที่คล้ายกัน: ศาสตร์เดียวกันก่อน แล้วเป้าหมายและจังหวัด */
export function similarTellers(t: FortuneTeller, all: FortuneTeller[], limit = 3): FortuneTeller[] {
  const score = (o: FortuneTeller) =>
    o.disciplines.filter((d) => t.disciplines.includes(d)).length * 10 +
    o.goals.filter((g) => t.goals.includes(g)).length * 2 +
    (t.provinceSlug && o.provinceSlug === t.provinceSlug ? 1 : 0);
  return all
    .filter((o) => o.slug !== t.slug)
    .map((o) => ({ o, s: score(o) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ o }) => o);
}

export const formatPrice = (n: number) => `${n.toLocaleString('th-TH')} บาท`;

/** ลิงก์ LINE จาก ID: @official -> R/ti/p/@id, ID ส่วนตัว -> ti/p/~id */
export function lineUrl(id: string): string {
  const v = id.trim();
  if (/^https?:\/\//.test(v)) return v;
  if (v.startsWith('@')) return `https://line.me/R/ti/p/${encodeURIComponent(v)}`;
  return `https://line.me/ti/p/~${encodeURIComponent(v)}`;
}

export const telUrl = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
