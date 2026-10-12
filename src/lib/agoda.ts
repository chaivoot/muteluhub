import { AGODA_ABROAD_CITY, AGODA_CITY, AGODA_POI } from '@/data/agoda-ids';

/**
 * ลิงก์ที่พัก Agoda (spec ข้อ 4.2)
 * CID อยู่ใน env AGODA_CID เท่านั้น ห้าม hardcode ไม่มี CID = ไม่แสดงลิงก์
 * รูปแบบที่ทดสอบแล้ว (2026-10-12): partnersearch.aspx?pcs=1&cid=&city=&poi=
 * พา redirect ไปหน้าค้นหาโดยคง cid ไว้ มี poi = ที่พักรอบสถานที่ ไม่มี = ทั้งเมือง/จังหวัด
 * ใช้ร่วมกันทั้งหน้าสถานที่ หน้าจังหวัด (และหน้าเทศกาลภายหลัง)
 */
export interface AgodaTarget {
  slug?: string;
  country: string;
  provinceSlug?: string;
  city?: string;
  agodaLinkOverride?: string;
}

const AGODA_BASE = 'https://www.agoda.com/partners/partnersearch.aspx';

export function agodaLink(target: AgodaTarget, cid: string | undefined = process.env.AGODA_CID): string | null {
  if (target.agodaLinkOverride) return target.agodaLinkOverride;
  if (!cid) return null;
  const poi = target.slug ? AGODA_POI[target.slug] : undefined;
  const city =
    poi?.city ??
    (target.country === 'TH'
      ? target.provinceSlug && AGODA_CITY[target.provinceSlug]
      : target.city && AGODA_ABROAD_CITY[target.city]);
  if (!city) return null;
  const sp = new URLSearchParams({ pcs: '1', cid, hl: 'th-th', city: String(city) });
  if (poi) sp.set('poi', String(poi.poi));
  return `${AGODA_BASE}?${sp}`;
}

/** ลิงก์นี้พาไปที่พักรอบสถานที่ (มี poi) หรือแค่ทั้งเมือง */
export const agodaNearPlace = (slug: string) => slug in AGODA_POI;
