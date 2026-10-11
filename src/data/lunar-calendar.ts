import type { LunarMonth } from '@/lib/lunar';

/**
 * วันขึ้น 1 ค่ำ ของแต่ละเดือนจันทรคติ (อัปเดตรายปี)
 * 2569: จากรายการวันพระ Thai PBS + ofm.co.th ตรงกันทุกวัน (ปีอธิกมาส มีเดือน ๘ หลัง)
 * 2570: จากรายการวันพระ Kapook ตรวจกับ PyThaiNLP 5.4.0 ตรงกันทุกเดือน (ยังไม่มีประกาศทางการ)
 * ข้อมูลครอบคลุม 20 ธ.ค. 2568 ถึง 26 ม.ค. 2571
 */
export const LUNAR_MONTHS: LunarMonth[] = [
  { month: 2, start: '2025-12-20', days: 30 },
  { month: 3, start: '2026-01-19', days: 29 },
  { month: 4, start: '2026-02-17', days: 30 },
  { month: 5, start: '2026-03-19', days: 29 },
  { month: 6, start: '2026-04-17', days: 30 },
  { month: 7, start: '2026-05-17', days: 29 },
  { month: 8, start: '2026-06-15', days: 30 },
  { month: 8, second8: true, start: '2026-07-15', days: 30 },
  { month: 9, start: '2026-08-14', days: 29 },
  { month: 10, start: '2026-09-12', days: 30 },
  { month: 11, start: '2026-10-12', days: 29 },
  { month: 12, start: '2026-11-10', days: 30 },
  { month: 1, start: '2026-12-10', days: 29 },
  { month: 2, start: '2027-01-08', days: 30 },
  { month: 3, start: '2027-02-07', days: 29 },
  { month: 4, start: '2027-03-08', days: 30 },
  { month: 5, start: '2027-04-07', days: 29 },
  { month: 6, start: '2027-05-06', days: 30 },
  { month: 7, start: '2027-06-05', days: 29 },
  { month: 8, start: '2027-07-04', days: 30 },
  { month: 9, start: '2027-08-03', days: 29 },
  { month: 10, start: '2027-09-01', days: 30 },
  { month: 11, start: '2027-10-01', days: 29 },
  { month: 12, start: '2027-10-30', days: 30 },
  { month: 1, start: '2027-11-29', days: 29 },
  { month: 2, start: '2027-12-28', days: 30 },
];

export const LUNAR_SOURCES = [
  'https://www.thaipbs.or.th/now/content/3498',
  'https://www.ofm.co.th/blog/calendar-buddhist-2569/',
  'https://calendar.kapook.com/2570/buddhistholyday',
];
