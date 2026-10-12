import places01 from '@data/import/places-batch-01.json';
import abroad01 from '@data/import/places-abroad-batch-01.json';
import tellers01 from '@data/import/fortune-tellers-batch-01.json';
import shrines01 from '@data/import/places-shrines-batch-01.json';
import shirts01 from '@data/import/products-shirts-batch-01.json';
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
  { id: 'places-shrines-batch-01', kind: 'places', label: 'ศาลเจ้าทั่วไทย 86 แห่ง (50 จังหวัด)', data: shrines01 },
  { id: 'products-shirts-batch-01', kind: 'products', label: 'เสื้อ YUEDPAO 7 สี (สีเสื้อมงคล)', data: shirts01 },
  { id: 'fortune-tellers-batch-01', kind: 'fortune_tellers', label: 'หมอดูไพ่ทาโรต์ออนไลน์ 10 คน', data: tellers01 },
];

export const getSeedBatch = (id: string) => SEED_BATCHES.find((b) => b.id === id);
