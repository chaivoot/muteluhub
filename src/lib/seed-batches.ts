import places01 from '@data/import/places-batch-01.json';
import abroad01 from '@data/import/places-abroad-batch-01.json';
import abroad02 from '@data/import/places-abroad-batch-02.json';
import tellers01 from '@data/import/fortune-tellers-batch-01.json';
import shrines01 from '@data/import/places-shrines-batch-01.json';
import places02 from '@data/import/places-batch-02.json';
import places03 from '@data/import/places-batch-03.json';
import places04 from '@data/import/places-batch-04.json';
import shirts01 from '@data/import/products-shirts-batch-01.json';
import tellers02 from '@data/import/fortune-tellers-batch-02.json';
import tellers03 from '@data/import/fortune-tellers-batch-03.json';
import tellers04 from '@data/import/fortune-tellers-batch-04.json';
import type { DirectoryKind } from '@/lib/directory-repo';

/**
 * ชุดข้อมูลเริ่มต้นที่อยู่ใน repo (data/import/*.json) ให้กดนำเข้าจากหลังบ้านได้ในคลิกเดียว
 * นำเข้าเฉพาะ slug ที่ยังไม่มีในฐานข้อมูล ไม่เขียนทับของเดิม
 * เพิ่มชุดใหม่: วางไฟล์ใน data/import แล้วเพิ่มรายการที่นี่
 */
export interface SeedBatch {
  id: string;
  kind: DirectoryKind;
  label: string;
  data: unknown[];
}

export const SEED_BATCHES: SeedBatch[] = [
  { id: 'places-batch-01', kind: 'places', label: 'สถานที่ชุดแรก 8 แห่ง', data: places01 },
  { id: 'places-abroad-batch-01', kind: 'places', label: 'ต่างประเทศ: ญี่ปุ่น ฮ่องกง ไต้หวัน 9 แห่ง', data: abroad01 },
  { id: 'places-abroad-batch-02', kind: 'places', label: 'ต่างประเทศชุด 2: 32 แห่ง 10 ประเทศ (เพิ่มสิงคโปร์ เมียนมา ลาว อินเดีย จีน เกาหลี มาเลเซีย)', data: abroad02 },
  { id: 'places-batch-02', kind: 'places', label: 'วัดและศาลทั่วไทยชุด 2: 117 แห่ง ครบ 77 จังหวัด', data: places02 },
  { id: 'places-shrines-batch-01', kind: 'places', label: 'ศาลเจ้าทั่วไทย 86 แห่ง (50 จังหวัด)', data: shrines01 },
  { id: 'places-batch-03', kind: 'places', label: 'ศาลหลักเมืองที่ยังขาด + ศาลท้องถิ่น ชุด 3: 44 แห่ง', data: places03 },
  { id: 'places-batch-04', kind: 'places', label: 'ศาลหลักเมืองมีนบุรี (พิกัดจากเจ้าของ)', data: places04 },
  { id: 'products-shirts-batch-01', kind: 'products', label: 'เสื้อ YUEDPAO 12 ตัว ครบ 8 สีทักษา (สีเสื้อมงคล)', data: shirts01 },
  { id: 'fortune-tellers-batch-01', kind: 'fortune_tellers', label: 'หมอดูไพ่ทาโรต์ออนไลน์ 10 คน', data: tellers01 },
  { id: 'fortune-tellers-batch-02', kind: 'fortune_tellers', label: 'หมอดูชุด 2: 59 คน ครบทุกศาสตร์ (โหร ซินแส เลข ลายมือ ไพ่)', data: tellers02 },
  { id: 'fortune-tellers-batch-03', kind: 'fortune_tellers', label: 'หมอดูชุด 3: 3 คน (ตรวจจากรายชื่อ Horoworld)', data: tellers03 },
  { id: 'fortune-tellers-batch-04', kind: 'fortune_tellers', label: 'หมอดูชุด 4: 27 คน (โหราศาสตร์ไทย ปาจื้อ ลายมือ โหงวเฮ้ง ตั้งชื่อ ฯลฯ)', data: tellers04 },
];

export const getSeedBatch = (id: string) => SEED_BATCHES.find((b) => b.id === id);
