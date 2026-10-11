import places01 from '@data/import/places-batch-01.json';
import tellers01 from '@data/import/fortune-tellers-batch-01.json';
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
  { id: 'fortune-tellers-batch-01', kind: 'fortune_tellers', label: 'หมอดูไพ่ทาโรต์ออนไลน์ 10 คน', data: tellers01 },
];

export const getSeedBatch = (id: string) => SEED_BATCHES.find((b) => b.id === id);
