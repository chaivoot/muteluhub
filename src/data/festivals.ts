import type { GoalSlug } from '@/lib/goals';

/**
 * เทศกาล: URL ไม่มีปี (/festival/[slug]) เนื้อหาอัปเดตทุกปี
 * วันที่แยกเป็นรายปีใน dates (ตาราง festival_dates ใน spec)
 * ใส่เฉพาะวันที่ที่ยืนยันแล้วเท่านั้น
 */
export interface FestivalDate {
  year: number; // ค.ศ.
  start: string; // YYYY-MM-DD
  end: string;
  prep?: string;
  notes?: string;
}

export interface SourcedText {
  text: string;
  source?: string;
}

export interface FestivalVenue {
  name: string;
  province: string;
  placeName?: string;
  /** วันจัดงานปีนี้ (ถ้าประกาศแล้ว) */
  dates?: string;
  description: string;
  sources: string[];
}

export interface FestivalFaq {
  q: string;
  a: string;
  source?: string;
}

/** เนื้อหาหน้าเทศกาล อัปเดตทุกปี (URL ไม่มีปี) ทุกข้อเท็จจริงต้องมีแหล่งอ้างอิง */
export interface FestivalContent {
  intro: string;
  /** หมายเหตุวันตามจันทรคติ */
  lunarNote?: string;
  rules: SourcedText[];
  /** หัวข้อของรายการพิเศษ เช่น ผักกลิ่นฉุน 5 ชนิด */
  specialList?: { title: string; items: string[]; source?: string };
  venues: FestivalVenue[];
  faq: FestivalFaq[];
  healthNote?: string;
  sources: string[];
  /** วันที่ตรวจเนื้อหาล่าสุด */
  checkedAt: string;
}

export interface Festival {
  slug: string;
  name: string;
  tagline: string;
  goals: GoalSlug[];
  dates: FestivalDate[];
  image?: { src: string; alt: string; credit: string };
  content?: FestivalContent;
}

export const FESTIVALS: Festival[] = [
  {
    slug: 'kinje',
    name: 'เทศกาลกินเจ',
    tagline: 'ข้อควรรู้ ของไหว้ สถานที่จัดงาน ที่พัก',
    goals: ['health', 'protection'],
    dates: [
      // อ้างอิง spec: กินเจ 2569 = 10-18 ต.ค. 2569 (ล้างท้อง 9 ต.ค.)
      { year: 2026, start: '2026-10-10', end: '2026-10-18', prep: '2026-10-09', notes: 'ล้างท้อง 9 ต.ค.' },
    ],
    content: {
      checkedAt: '2026-10-11',
      intro:
        'กินเจเป็นเทศกาลของชาวไทยเชื้อสายจีน จัดปีละ 9 วัน ช่วงขึ้น 1-9 ค่ำ เดือน 9 ตามปฏิทินจีน คำว่าเจมาจากอักษร 齋 ที่หมายถึงการถือศีล สำรวมกาย วาจา ใจ และงดของคาว คนกินเจจึงงดเนื้อสัตว์และผลิตภัณฑ์จากสัตว์ ทำบุญ และรักษาศีลไปด้วยตลอดช่วงเทศกาล',
      lunarNote:
        'ปี 2569 ตรงกับขึ้น 1-9 ค่ำ เดือน 9 ตามปฏิทินจีน รวม 9 วัน 9 คืน ออกเจคืนวันที่ 18 ต่อเนื่องเช้าวันที่ 19 ต.ค. หลายคนเริ่มล้างท้องล่วงหน้า 2-3 วัน',
      rules: [
        { text: 'งดเนื้อสัตว์และผลิตภัณฑ์จากสัตว์ทุกชนิด รวมถึงไข่ นม เนย', source: 'https://www.ktc.co.th/article/lifestyle/misc/vegetarian-festival' },
        { text: 'งดเครื่องปรุงที่ทำจากสัตว์ เช่น น้ำปลา ซอสหอยนางรม', source: 'https://www.thaipbs.or.th/now/content/426' },
        { text: 'งดผักกลิ่นฉุน 5 ชนิด (ดูรายการด้านล่าง)', source: 'https://www.thaipbs.or.th/now/content/426' },
        { text: 'งดอาหารรสจัดและเครื่องเทศรสจัด', source: 'https://www.thansettakij.com/lifestyle/travel-shopping/670317' },
        { text: 'งดเหล้า เครื่องดื่มแอลกอฮอล์ บุหรี่ และของมึนเมา', source: 'https://www.ktc.co.th/article/lifestyle/misc/vegetarian-festival' },
        { text: 'แยกเครื่องครัว จานชาม ช้อนส้อม ไม่ใช้ปนกับอาหารที่มีเนื้อสัตว์', source: 'https://www.thaipbs.or.th/now/content/426' },
        { text: 'ทำบุญ รักษาศีลห้า และรักษาพรหมจรรย์', source: 'https://www.thaipbs.or.th/now/content/426' },
        { text: 'นิยมแต่งกายด้วยชุดสีขาว โดยเฉพาะตอนไปศาลเจ้าหรือร่วมพิธี', source: 'https://www.thaipbs.or.th/now/content/426' },
        { text: 'สายเคร่งจะกินเฉพาะอาหารเจที่คนกินเจด้วยกันเป็นคนปรุง', source: 'https://www.thaipbs.or.th/now/content/426' },
      ],
      specialList: {
        title: 'ผักกลิ่นฉุน 5 ชนิดที่ควรงด',
        items: ['กระเทียม', 'หอมทุกชนิด (หัวหอม หอมแดง หอมหัวใหญ่ ต้นหอม)', 'กุยช่าย', 'หลักเกียว (กระเทียมโทนจีน)', 'ใบยาสูบ'],
        source: 'https://www.thaipbs.or.th/now/content/426',
      },
      venues: [
        {
          name: 'ประเพณีงานเจ เยาวราช',
          province: 'กรุงเทพมหานคร',
          placeName: 'ซุ้มประตูเฉลิมพระเกียรติฯ ถนนเยาวราช',
          dates: '9-18 ต.ค. 2569 (พิธีเปิด 10 ต.ค. ปิดถนนเยาวราช 16.00-22.00 น.)',
          description: 'ร้านอาหารเจตลอดสองฝั่งถนนเยาวราช ไฟประดับ และขบวนแห่เกี้ยวเทพเจ้าจาก 22 ศาลเจ้าในย่านนี้',
          sources: ['https://www.thansettakij.com/lifestyle/travel-shopping/670700'],
        },
        {
          name: 'ประเพณีถือศีลกินผัก ภูเก็ต',
          province: 'ภูเก็ต',
          placeName: 'ศาลเจ้าและอ๊ามกว่า 40 แห่งทั่วภูเก็ต',
          dates: 'ยกเสาโกเต้ง 9 ต.ค., ถือศีลกินผัก 10-18 ต.ค., ขบวนแห่พระรอบเมือง 11-18 ต.ค. 2569',
          description: 'เปิดงานด้วยพิธียกเสาโกเต้ง แล้วอ๊ามต่าง ๆ ผลัดกันจัดขบวนแห่พระรอบเมือง ปีนี้มีขบวนแห่ช่วงกลางคืนด้วย',
          sources: ['https://www.bangkokbiznews.com/economics/1255018', 'https://www.thansettakij.com/lifestyle/670704'],
        },
        {
          name: 'ประเพณีถือศีลกินผัก ศาลเจ้ากระโสม',
          province: 'พังงา',
          placeName: 'ศาลเจ้ากระโสมเต้าโบ้เก้ง อ.ตะกั่วทุ่ง',
          dates: '9-19 ต.ค. 2569',
          description: 'ศาลเจ้าเก่าแก่อายุ 186 ปีของชุมชนกระโสม มีพิธีตามขนบของศาลเจ้า เช่น พิธีซ่งเก้ง การรำธงเอี๋ย และพิธีอิ้วเก้ง',
          sources: ['https://www.thansettakij.com/lifestyle/travel-shopping/671065'],
        },
        {
          name: 'เทศกาลถือศีลกินเจ 9 วันแห่งบุญบารมี (กินเจโคราช)',
          province: 'นครราชสีมา',
          placeName: 'ลานอนุสาวรีย์ท้าวสุรนารี (ย่าโม) และบริเวณโดยรอบ',
          dates: '10-18 ต.ค. 2569',
          description: 'มีพิธีอิ้วเก้งแห่เทพเจ้ารอบเมือง (13 ต.ค.) และพิธีโกยห่านเดินข้ามสะพานสะเดาะเคราะห์ 12 ราศี (15 ต.ค.)',
          sources: ['https://www.thansettakij.com/lifestyle/670740'],
        },
      ],
      faq: [
        {
          q: 'ธงเหลืองตัวอักษรแดงหมายถึงอะไร',
          a: 'ตัวอักษรแดงบนธงคือคำว่า 齋 อ่านว่า ไจ หรือ เจ หมายถึงการถือศีลและงดของคาว ร้านที่ปักธงนี้ขายหรือแจกอาหารเจ สีแดงหมายถึงความเป็นมงคล ส่วนสีเหลืองคือสีของพุทธศาสนาและผู้ถือศีล',
          source: 'https://www.ofm.co.th/blog/?p=25761',
        },
        {
          q: 'กินเจกับกินมังสวิรัติต่างกันอย่างไร',
          a: 'มังสวิรัติงดแค่เนื้อสัตว์ ยังกินไข่ นม เนยได้ และกินผักได้ทุกชนิด ส่วนกินเจงดทั้งเนื้อสัตว์ ผลิตภัณฑ์จากสัตว์ อาหารรสจัด และผักกลิ่นฉุน',
          source: 'https://www.lazada.co.th/blog/?p=15929',
        },
        {
          q: 'ล้างท้องคืออะไร',
          a: 'คือการค่อย ๆ ลดเนื้อสัตว์และกินผักมากขึ้นก่อนเริ่มกินเจ เพื่อให้ระบบย่อยปรับตัว ส่วนใหญ่เริ่มก่อนเทศกาล 2-3 วัน ปี 2569 วันล้างท้องคือ 9 ต.ค.',
          source: 'https://www.thaipbs.or.th/news/content/344640',
        },
        {
          q: 'กินเจดื่มนมได้ไหม',
          a: 'นมวัวและครีมเทียมที่มีนมผสมควรงด เพราะเป็นผลิตภัณฑ์จากสัตว์ ใช้นมถั่วเหลืองหรือนมอัลมอนด์แทนได้ แต่อ่านฉลากก่อนทุกครั้ง',
          source: 'https://www.sanook.com/women/264385/',
        },
        {
          q: 'คนกินเจต้องใส่ชุดขาวไหม',
          a: 'ไม่ได้บังคับ แต่การแต่งชุดขาวเป็นข้อปฏิบัติที่นิยมกันในช่วงกินเจ โดยเฉพาะตอนไปศาลเจ้าหรือร่วมพิธี',
          source: 'https://www.thaipbs.or.th/now/content/426',
        },
      ],
      healthNote:
        'อาหารเจหลายอย่างทั้งเค็มและมัน เลือกรสกลาง ๆ กินโปรตีนเกษตรหรือของที่ทำจากแป้งแต่พอดี และกินผัก ผลไม้ ถั่ว ธัญพืชให้หลากหลาย ใครมีโรคประจำตัว เช่น ความดันหรือโรคไต ควรปรึกษาแพทย์ก่อนเปลี่ยนการกิน',
      sources: [
        'https://www.ktc.co.th/article/lifestyle/misc/vegetarian-festival',
        'https://www.thansettakij.com/lifestyle/travel-shopping/670317',
        'https://www.thansettakij.com/lifestyle/670704',
        'https://www.bangkokbiznews.com/economics/1255018',
        'https://www.thaipbs.or.th/now/content/426',
        'https://www.thaipbs.or.th/news/content/344640',
        'https://www.thansettakij.com/health/541522',
        'https://www.thansettakij.com/lifestyle/travel-shopping/670700',
        'https://www.thansettakij.com/lifestyle/travel-shopping/671065',
        'https://www.thansettakij.com/lifestyle/670740',
        'https://www.ofm.co.th/blog/?p=25761',
        'https://www.lazada.co.th/blog/?p=15929',
        'https://www.sanook.com/women/264385/',
      ],
    },
  },
];
