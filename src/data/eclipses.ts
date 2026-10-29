/**
 * สุริยุปราคา / จันทรุปราคา ที่เห็นได้ในประเทศไทย
 * ประเภทและเวลาสัมผัสจาก NASA (Espenak) แปลงเป็นเวลาไทย (UT+7) ส่วนสุริยุปราคาใช้เวลาที่กรุงเทพฯ ตาม สดร. / ตารางคำนวณรายเมือง
 * ไม่รวมจันทรุปราคาเงามัว (ดูด้วยตาแทบไม่ออก) และอุปราคาที่ไทยมองไม่เห็น ต้องเติมรายปี
 */
export type EclipseKind = 'solar' | 'lunar';
export type EclipseType = 'total' | 'partial';

export interface Eclipse {
  kind: EclipseKind;
  type: EclipseType;
  /** วันที่เริ่มเห็น (เวลาไทย) */
  date: string;
  /** ช่วงเวลาที่เห็นในไทย HH:MM (เวลาไทย) ถ้าข้ามเที่ยงคืน end เป็นของวันถัดไป */
  start: string;
  max: string;
  end: string;
  /** ช่วงเต็มดวง (เฉพาะแบบเต็มดวง) */
  totality?: { start: string; end: string };
  note: string;
  sources: string[];
}

const NASA_LE = 'https://eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html';

export const ECLIPSES: Eclipse[] = [
  {
    kind: 'lunar',
    type: 'total',
    date: '2026-03-03',
    start: '16:50',
    max: '18:33',
    end: '20:17',
    totality: { start: '18:04', end: '19:02' },
    note: 'ตรงกับวันมาฆบูชา ดวงจันทร์ขึ้นจากขอบฟ้าราว 6 โมงเย็นขณะกำลังเต็มดวง',
    sources: [NASA_LE, 'https://www.thairath.co.th/news/society/2915976'],
  },
  {
    kind: 'solar',
    type: 'partial',
    date: '2027-08-02',
    start: '17:54',
    max: '18:25',
    end: '18:45',
    note: 'ช่วงเย็นก่อนดวงอาทิตย์ตก เห็นได้ทั่วประเทศ ดวงอาทิตย์ถูกบังไม่มาก ดวงอาทิตย์ตกก่อนอุปราคาจบ',
    sources: ['https://www.matichon.co.th/local/news_4517084', 'https://www.naewna.com/local/725594'],
  },
  {
    kind: 'lunar',
    type: 'partial',
    date: '2028-07-07',
    start: '00:09',
    max: '01:20',
    end: '02:30',
    note: 'คืนวันที่ 6 ต่อเช้ามืดวันที่ 7 ดวงจันทร์แหว่งราว 2 ใน 5 ของดวง เห็นได้ทั่วประเทศ',
    sources: [NASA_LE, 'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2028Jul06P.pdf'],
  },
  {
    kind: 'solar',
    type: 'partial',
    date: '2028-07-22',
    start: '07:47',
    max: '08:35',
    end: '09:26',
    note: 'ช่วงเช้า กรุงเทพฯ ถูกบังราว 16% ภาคใต้เห็นมากกว่า (เต็มดวงที่ออสเตรเลียและนิวซีแลนด์)',
    sources: ['https://orbitalradar.com/eclipse/2028-july-22/bangkok', 'https://en.wikipedia.org/wiki/Solar_eclipse_of_July_22,_2028'],
  },
  {
    kind: 'lunar',
    type: 'total',
    date: '2028-12-31',
    start: '22:07',
    max: '23:52',
    end: '01:36',
    totality: { start: '23:16', end: '00:27' },
    note: 'คืนข้ามปี เห็นได้ทั่วประเทศตลอดปรากฏการณ์ ดวงจันทร์เป็นสีแดงอิฐราว 1 ชั่วโมง',
    sources: [NASA_LE, 'https://eclipse.gsfc.nasa.gov/LEplot/LEplot2001/LE2028Dec31T.pdf'],
  },
];
