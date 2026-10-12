/** ระยะทางและการแสดงผล ใช้ฝั่ง client กับ ใกล้ฉัน (ตำแหน่งผู้ใช้ไม่ส่งขึ้น server) */
export interface LatLng {
  lat: number;
  lng: number;
}

/** ใกล้ฉัน: แสดงเฉพาะสถานที่ในรัศมีนี้ (กม.) */
export const NEAR_ME_RADIUS_KM = 30;

/** ระยะทางตามแนวโค้งโลก (haversine) เป็นกิโลเมตร */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** 850 ม. / 3.2 กม. / 120 กม. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(10, Math.round((km * 1000) / 10) * 10)} ม.`;
  if (km < 10) return `${km.toFixed(1)} กม.`;
  return `${Math.round(km).toLocaleString('en-US')} กม.`;
}

/** เรียงจากใกล้ไปไกล รายการที่ไม่มีพิกัดไปอยู่ท้าย */
export function sortByDistance<T extends { lat: number | null; lng: number | null }>(
  items: T[],
  from: LatLng,
): { item: T; km: number | null }[] {
  return items
    .map((item) => ({
      item,
      km: item.lat == null || item.lng == null ? null : distanceKm(from, { lat: item.lat, lng: item.lng }),
    }))
    .sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
}
