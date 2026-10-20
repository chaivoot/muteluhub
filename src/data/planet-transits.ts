/**
 * ดาวย้ายราศีตามโหราศาสตร์ไทย (นิรายนะ) หน้า /planet-transits
 * วันที่ใช้ตามที่โหร/ปฏิทินโหราศาสตร์ไทยเผยแพร่ ไม่ได้คำนวณเอง (สุริยยาตร์กับ ephemeris สมัยใหม่ต่างกันได้หลายวัน)
 * ทุกเหตุการณ์ต้องมีแหล่ง ถ้าแหล่งไทยไม่ตรงกันให้เขียนไว้ใน note
 * เนื้อหาโหราศาสตร์ไทยแสดงเป็นเลขไทย (เจ้าของกำหนด 2026-10-11) ในไฟล์นี้เก็บเลขอารบิก แปลงตอนแสดงผล
 */

export type PlanetSlug = 'jupiter' | 'saturn' | 'rahu' | 'ketu' | 'uranus' | 'mercury';

export const ZODIAC_SIGNS = [
  'เมษ',
  'พฤษภ',
  'เมถุน',
  'กรกฎ',
  'สิงห์',
  'กันย์',
  'ตุลย์',
  'พิจิก',
  'ธนู',
  'มังกร',
  'กุมภ์',
  'มีน',
] as const;
export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export interface PlanetInfo {
  slug: PlanetSlug;
  name: string;
  /** เลขประจำดาวในโหราศาสตร์ไทย */
  number: number;
  /** ความหมายโดยย่อ */
  meaning: string;
  /** อยู่ราศีละประมาณ */
  pace: string;
}

export const PLANETS: PlanetInfo[] = [
  {
    slug: 'jupiter',
    name: 'พฤหัสบดี',
    number: 5,
    meaning: 'ดาวศุภเคราะห์ ครูบาอาจารย์ ความรู้ ศาสนา ผู้ใหญ่ที่ให้ความช่วยเหลือ และความคุ้มครอง',
    pace: 'ราศีละราว 1 ปี',
  },
  {
    slug: 'saturn',
    name: 'เสาร์',
    number: 7,
    meaning: 'ความหนัก ความอดทน อุปสรรค ภาระ และผลของการกระทำที่สะสมมา',
    pace: 'ราศีละราว 2 ปีครึ่ง',
  },
  {
    slug: 'rahu',
    name: 'ราหู',
    number: 8,
    meaning: 'ความลุ่มหลง ความมืดมัว สิ่งไม่คาดฝัน และความทะเยอทะยาน',
    pace: 'ราศีละราว 1 ปีครึ่ง เดินถอยหลัง',
  },
  {
    slug: 'ketu',
    name: 'เกตุ',
    number: 9,
    meaning: 'ความเปลี่ยนแปลงฉับพลัน สิ่งศักดิ์สิทธิ์ และการหลุดพ้น',
    pace: 'อยู่ตรงข้ามราหูเสมอ',
  },
  {
    slug: 'uranus',
    name: 'มฤตยู',
    number: 0,
    meaning: 'ความแปลกใหม่ การเปลี่ยนแปลงแบบพลิกผัน และเรื่องไม่คาดคิด',
    pace: 'ราศีละราว 7 ปี',
  },
  {
    slug: 'mercury',
    name: 'พุธ',
    number: 4,
    meaning: 'การสื่อสาร การเจรจา การค้า การเดินทาง และเอกสาร',
    pace: 'เดินเร็ว ที่คนพูดถึงคือช่วงพุธพักร์ (เดินถอยหลัง)',
  },
];

export const getPlanet = (slug: PlanetSlug) => PLANETS.find((p) => p.slug === slug)!;

export interface PlanetTransit {
  planet: PlanetSlug;
  /** ingress = ย้ายราศี, retrograde-period = ช่วงพักร์ (เดินถอยหลัง) */
  kind: 'ingress' | 'retrograde-period';
  from?: ZodiacSign;
  to?: ZodiacSign;
  /** YYYY-MM-DD */
  date: string;
  /** เวลาตามที่แหล่งระบุ เช่น 02.10 */
  time?: string;
  /** วันสิ้นสุดของช่วง (เช่น ช่วงพักร์) */
  end?: string;
  /** สรุปสั้นภาษาไทย */
  note?: string;
  /** บทความในเว็บที่เกี่ยวข้อง (slug ใน /articles) */
  article?: string;
  sources: string[];
}

/** ตำแหน่งตั้งต้นก่อนเหตุการณ์แรกในรายการ (ใช้หาว่าตอนนี้ดาวอยู่ราศีไหน) */
export interface PlanetBaseline {
  planet: PlanetSlug;
  sign: ZodiacSign;
  /** ใช้ได้ตั้งแต่วันนี้ */
  asOf: string;
  sources: string[];
}

export const PLANET_BASELINES: PlanetBaseline[] = [
  {
    planet: 'jupiter',
    sign: 'กรกฎ',
    asOf: '2026-05-31',
    sources: ['https://www.thaipost.net/columnist-people/1068088/'],
  },
];

export const PLANET_TRANSITS: PlanetTransit[] = [
  {
    planet: 'jupiter',
    kind: 'ingress',
    from: 'กรกฎ',
    to: 'สิงห์',
    date: '2026-10-20',
    note: 'อยู่ราศีสิงห์ถึง 9 ก.พ. 2570 โหรบางท่านมองว่าเป็นจุดเริ่มของความดีขึ้น',
    article: 'jupiter-enters-leo-2569',
    sources: [
      'https://www.thaipost.net/columnist-people/1068088/',
      'https://www.thansettakij.com/blogs/lifestyle/horoscope/660302',
    ],
  },
  {
    planet: 'jupiter',
    kind: 'ingress',
    from: 'สิงห์',
    to: 'กรกฎ',
    date: '2027-02-09',
    note: 'เดินถอยกลับเข้าราศีกรกฎชั่วคราว',
    sources: [
      'https://www.thaipost.net/columnist-people/1068088/',
      'https://www.thansettakij.com/blogs/lifestyle/horoscope/660302',
    ],
  },
  {
    planet: 'jupiter',
    kind: 'ingress',
    from: 'กรกฎ',
    to: 'สิงห์',
    date: '2027-06-23',
    note: 'กลับเข้าราศีสิงห์อีกครั้ง โหรบางท่านมองว่าเป็นจุดเปลี่ยนจริง',
    sources: ['https://www.thansettakij.com/blogs/lifestyle/horoscope/660302'],
  },
];
