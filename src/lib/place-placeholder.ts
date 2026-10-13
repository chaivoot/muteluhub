import type { Place, PlaceType } from '@/data/places';

/**
 * ภาพแทนสำหรับสถานที่ที่ยังไม่มีรูปจริง (ภาพบรรยากาศ AI ที่เจ้าของให้มา 2026-10-13 ต้นฉบับใน design/placeholder-*-original.jpg)
 * ใช้เป็นภาพบรรยากาศเท่านั้น ต้องมีป้ายบอกว่าไม่ใช่ภาพสถานที่นี้ ไม่ใช้เป็นภาพแชร์ (OG) และไม่นับว่ามีภาพ
 * (สถานที่ที่ใช้ภาพแทนจึงไม่ขึ้นหน้าแรก ดู featuredPlaces) เพิ่มภาพตามประเภทได้ใน BY_TYPE
 */
export interface Placeholder {
  src: string;
  srcSmall: string;
  alt: string;
  credit: string;
}

const CREDIT = 'ประกอบ ยังไม่มีภาพสถานที่นี้';

export const PLACE_PLACEHOLDER: Placeholder = {
  src: '/images/placeholder/place-prayer-1200.webp',
  srcSmall: '/images/placeholder/place-prayer-600.webp',
  alt: 'ภาพประกอบ: คนจุดธูปไหว้ขอพร',
  credit: CREDIT,
};

const BY_TYPE: Partial<Record<PlaceType, Placeholder>> = {
  temple: {
    src: '/images/placeholder/thai-temple-1200.webp',
    srcSmall: '/images/placeholder/thai-temple-600.webp',
    alt: 'ภาพประกอบ: คนจุดธูปไหว้พระพุทธรูปในวัด',
    credit: CREDIT,
  },
  'chinese-shrine': {
    src: '/images/placeholder/chinese-shrine-1200.webp',
    srcSmall: '/images/placeholder/chinese-shrine-600.webp',
    alt: 'ภาพประกอบ: คนจุดธูปไหว้หน้าศาลเจ้าจีน',
    credit: CREDIT,
  },
};

export const placeholderFor = (place: Pick<Place, 'type'>): Placeholder => BY_TYPE[place.type] ?? PLACE_PLACEHOLDER;
