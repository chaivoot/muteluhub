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
    pace: 'เกตุแบบไทยเดินถอยหลัง ราศีละราว 56 วัน',
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

/** ตำแหน่งตั้งต้นก่อนเหตุการณ์แรกในรายการ (ใช้หาว่าตอนนี้ดาวอยู่ราศีไหน) ดาวที่ย้ายนานแล้วใส่ไว้ที่นี่ */
export interface PlanetBaseline {
  planet: PlanetSlug;
  sign: ZodiacSign;
  /** ใช้ได้ตั้งแต่วันนี้ */
  asOf: string;
  sources: string[];
}

export const PLANET_BASELINES: PlanetBaseline[] = [
  { planet: 'jupiter', sign: 'กรกฎ', asOf: '2026-05-31', sources: ['https://www.thaipost.net/columnist-people/1068088/'] },
  { planet: 'saturn', sign: 'มีน', asOf: '2026-02-13', sources: ["https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569", "https://www.thansettakij.com/blogs/lifestyle/horoscope/651000"] },
  { planet: 'rahu', sign: 'กุมภ์', asOf: '2025-05-05', sources: ["https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2568"] },
  { planet: 'uranus', sign: 'พฤษภ', asOf: '2023-03-08', sources: ["https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2566"] },
];

/** เรียงตามวันที่ เวลาเป็นเวลาท้องถิ่นตามปฏิทินโหราศาสตร์ไทย (สุริยยาตร์) ที่สื่อไทยอ้าง */
export const PLANET_TRANSITS: PlanetTransit[] = [
  {
    planet: "saturn",
    kind: "retrograde-period",
    to: "มีน",
    date: "2026-07-27",
    end: "2026-11-29",
    note: "เสาร์เดินถอยหลังในราศีมีน บางแหล่งระบุวันสิ้นสุด 23 พ.ย.",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569",
      "https://readinglounge.co/transits-2026-saturn-pisces/",
    ],
  },
  {
    planet: "uranus",
    kind: "retrograde-period",
    to: "พฤษภ",
    date: "2026-09-23",
    end: "2027-02-08",
    note: "มฤตยูเดินถอยหลังในราศีพฤษภ และไม่ย้ายราศีจนเลยปี 2571",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569",
      "https://myhora.com/calendar/astro-suriyayas-20-10-2569.aspx",
    ],
  },
  {
    planet: "mercury",
    kind: "retrograde-period",
    to: "ตุลย์",
    date: "2026-10-12",
    end: "2026-10-31",
    note: "พุธเดินถอยหลังในราศีตุลย์ ช่วงดาวเดินช้า (มนฑ์) ก่อน 4-11 ต.ค. และหลัง 1-8 พ.ย. 2569",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569",
    ],
  },
  {
    planet: "ketu",
    kind: "ingress",
    from: "พิจิก",
    to: "ตุลย์",
    date: "2026-10-14",
    time: "22.46",
    note: "เกตุแบบไทยเดินถอยหลัง ย้ายราศีทุกราว 56 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-14-10-2569.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2569/",
    ],
  },
  {
    planet: "jupiter",
    kind: "ingress",
    from: "กรกฎ",
    to: "สิงห์",
    date: "2026-10-20",
    time: "07.50",
    note: "ยกเข้าราศีสิงห์ครั้งแรก อยู่ถึง 9 ก.พ. 2570",
    article: "jupiter-enters-leo-2569",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-20-10-2569.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569",
      "https://thethaiger.com/th/news/1621777/",
      "https://www.thaipost.net/columnist-people/1068088/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2569/",
      "https://today.line.me/th/v3/article/1DlzYNv",
      "https://readinglounge.co/transits-2026-jupiter-cancer-return/",
    ],
  },
  {
    planet: "rahu",
    kind: "ingress",
    from: "กุมภ์",
    to: "มังกร",
    date: "2026-11-22",
    time: "05.05",
    note: "อยู่ราศีมังกรราว 1 ปีครึ่ง ถึง 10 มิ.ย. 2571",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-22-11-2569.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569",
      "https://myduang.com/ผูกดวง/ราหูย้าย/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2569/",
      "https://today.line.me/th/v3/article/1DlzYNv",
      "https://thethaiger.com/th/news/1621777/",
    ],
  },
  {
    planet: "ketu",
    kind: "ingress",
    from: "ตุลย์",
    to: "กันย์",
    date: "2026-12-10",
    time: "12.46",
    note: "เกตุแบบไทยเดินถอยหลัง ย้ายราศีทุกราว 56 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-10-12-2569.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2569/",
    ],
  },
  {
    planet: "jupiter",
    kind: "retrograde-period",
    to: "สิงห์",
    date: "2026-12-11",
    end: "2027-04-21",
    note: "เดินถอยหลัง 131 วัน เริ่มในราศีสิงห์ แล้วถอยกลับเข้าราศีกรกฎ 9 ก.พ. 2570",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2569",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://readinglounge.co/transits-2026-jupiter-cancer-return/",
    ],
  },
  {
    planet: "mercury",
    kind: "retrograde-period",
    to: "มังกร",
    date: "2027-02-03",
    end: "2027-02-22",
    note: "พุธเดินถอยหลังในราศีมังกร ช่วงดาวเดินช้า (มนฑ์) ก่อน 25 ม.ค.-2 ก.พ. และหลัง 23 ก.พ.-2 มี.ค. 2570",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
    ],
  },
  {
    planet: "ketu",
    kind: "ingress",
    from: "กันย์",
    to: "สิงห์",
    date: "2027-02-05",
    time: "02.46",
    note: "เกตุแบบไทยเดินถอยหลัง ย้ายราศีทุกราว 56 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-05-02-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
    ],
  },
  {
    planet: "jupiter",
    kind: "ingress",
    from: "สิงห์",
    to: "กรกฎ",
    date: "2027-02-09",
    time: "10.07",
    note: "ถอยกลับเข้าราศีกรกฎ ซึ่งเป็นตำแหน่งมหาอุจจ์ของดาวพฤหัสบดี",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-09-02-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
      "https://www.thaipost.net/columnist-people/1068088/",
      "https://www.thansettakij.com/blogs/lifestyle/horoscope/660302",
      "https://readinglounge.co/transits-2026-jupiter-cancer-return/",
    ],
  },
  {
    planet: "ketu",
    kind: "ingress",
    from: "สิงห์",
    to: "กรกฎ",
    date: "2027-04-02",
    time: "16.46",
    note: "เกตุแบบไทยเดินถอยหลัง ย้ายราศีทุกราว 56 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-02-04-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
    ],
  },
  {
    planet: "ketu",
    kind: "ingress",
    from: "กรกฎ",
    to: "เมถุน",
    date: "2027-05-29",
    time: "06.46",
    note: "เกตุแบบไทยเดินถอยหลัง ย้ายราศีทุกราว 56 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-29-05-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
    ],
  },
  {
    planet: "mercury",
    kind: "retrograde-period",
    to: "พฤษภ",
    date: "2027-06-01",
    end: "2027-06-19",
    note: "พุธเดินถอยหลังในราศีพฤษภ ช่วงดาวเดินช้า (มนฑ์) ก่อน 24-31 พ.ค. และหลัง 20-27 มิ.ย. 2570",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
    ],
  },
  {
    planet: "jupiter",
    kind: "ingress",
    from: "กรกฎ",
    to: "สิงห์",
    date: "2027-06-23",
    time: "21.02",
    note: "กลับเข้าราศีสิงห์รอบสอง",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-23-06-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
      "https://www.thansettakij.com/blogs/lifestyle/horoscope/660302",
      "https://readinglounge.co/transits-2026-jupiter-cancer-return/",
    ],
  },
  {
    planet: "ketu",
    kind: "ingress",
    from: "เมถุน",
    to: "พฤษภ",
    date: "2027-07-24",
    time: "20.46",
    note: "เกตุแบบไทยเดินถอยหลัง ย้ายราศีทุกราว 56 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-24-07-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
    ],
  },
  {
    planet: "saturn",
    kind: "retrograde-period",
    to: "มีน",
    date: "2027-08-09",
    end: "2027-12-12",
    note: "เสาร์เดินถอยหลังในราศีมีน 125 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://readinglounge.co/transits-2026-saturn-pisces/",
    ],
  },
  {
    planet: "ketu",
    kind: "ingress",
    from: "พฤษภ",
    to: "เมษ",
    date: "2027-09-19",
    time: "10.46",
    note: "เกตุแบบไทยเดินถอยหลัง ย้ายราศีทุกราว 56 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-19-09-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
    ],
  },
  {
    planet: "mercury",
    kind: "retrograde-period",
    to: "กันย์",
    date: "2027-09-25",
    end: "2027-10-14",
    note: "พุธเดินถอยหลังในราศีกันย์ ช่วงดาวเดินช้า (มนฑ์) ก่อน 16-24 ก.ย. และหลัง 15-22 ต.ค. 2570",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
    ],
  },
  {
    planet: "jupiter",
    kind: "ingress",
    from: "สิงห์",
    to: "กันย์",
    date: "2027-11-14",
    time: "20.14",
    note: "แล้วจะเดินถอยกลับเข้าราศีสิงห์ 16 มี.ค. 2571",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-14-11-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2571",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
    ],
  },
  {
    planet: "ketu",
    kind: "ingress",
    from: "เมษ",
    to: "มีน",
    date: "2027-11-15",
    time: "00.46",
    note: "เกตุแบบไทยเดินถอยหลัง ย้ายราศีทุกราว 56 วัน",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-15-11-2570.aspx",
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2570",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://astro.meemodel.com/ปฏิทินโหราศาสตร์ไทย/พศ2570/",
    ],
  },
  {
    planet: "saturn",
    kind: "ingress",
    from: "มีน",
    to: "เมษ",
    date: "2028-04-12",
    note: "เสาร์อยู่ราศีมีนตลอดปี 2570 บางแหล่งระบุ 11 เม.ย.",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2571",
      "https://myduang.com/ปฏิทินดาวย้าย/2570/",
      "https://readinglounge.co/transits-2026-saturn-pisces/",
    ],
  },
  {
    planet: "rahu",
    kind: "ingress",
    from: "มังกร",
    to: "ธนู",
    date: "2028-06-10",
    note: "ราหูย้ายครั้งถัดไป บางแหล่งระบุ 9 มิ.ย.",
    sources: [
      "https://myhora.com/calendar/astro-suriyayas-info.aspx?year=2571",
      "https://myduang.com/ผูกดวง/ราหูย้าย/",
    ],
  },
];
