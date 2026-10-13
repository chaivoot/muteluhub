/**
 * ภาพแทนสำหรับสถานที่ที่ยังไม่มีรูปจริง (เจ้าของให้มา 2026-10-13 เป็นภาพบรรยากาศ AI ต้นฉบับ design/placeholder-place-original.jpg)
 * ใช้เป็นภาพบรรยากาศเท่านั้น ต้องมีป้ายบอกว่าไม่ใช่ภาพสถานที่นี้ ไม่ใช้เป็นภาพแชร์ (OG) และไม่นับว่ามีภาพ
 * (สถานที่ที่ใช้ภาพแทนจึงไม่ขึ้นหน้าแรก ดู featuredPlaces)
 */
export const PLACE_PLACEHOLDER = {
  src: '/images/placeholder/place-prayer-1200.webp',
  srcSmall: '/images/placeholder/place-prayer-600.webp',
  alt: 'ภาพประกอบ: คนจุดธูปไหว้ขอพรในศาลเจ้า',
  credit: 'ประกอบ ยังไม่มีภาพสถานที่นี้',
} as const;
