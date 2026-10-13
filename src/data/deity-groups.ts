/**
 * กลุ่มองค์เทพสำหรับตัวกรองสถานที่
 * ชื่อองค์เทพในข้อมูลเขียนได้หลายแบบ (กวนอู / เทพเจ้ากวนอู / เจ้าพ่อกวนอู) ตัวกรองจึงจับกลุ่มด้วย pattern
 * สถานที่ที่ไม่เข้ากลุ่มไหนยังหาเจอด้วยเป้าหมายและจังหวัด เพิ่มกลุ่มใหม่ได้ที่นี่
 */
export type DeityFamilySlug = 'chinese' | 'hindu' | 'buddhist' | 'thai' | 'japanese';

export interface DeityGroup {
  slug: string;
  label: string;
  match: RegExp;
  family: DeityFamilySlug;
}

/**
 * หมวดใหญ่ของเทพ สำหรับคนที่ค้นแบบกว้าง ๆ เช่น เทพจีน เทพพราหมณ์ เทพอินเดีย
 * aliases = คำที่คนพิมพ์ (รวมคำสะกดผิดที่พบบ่อย) types = ประเภทสถานที่ที่นับเข้าหมวดนี้ด้วย
 * ค่าในตัวกรองเป็น family:<slug>
 */
export interface DeityFamily {
  slug: DeityFamilySlug;
  label: string;
  aliases: string[];
  types: string[];
}

export const DEITY_FAMILIES: DeityFamily[] = [
  {
    slug: 'chinese',
    label: 'เทพจีนทั้งหมด',
    aliases: ['เทพจีน', 'เจ้าจีน', 'ศาลเจ้าจีน', 'จีน', 'chinese'],
    types: ['chinese-shrine'],
  },
  {
    slug: 'hindu',
    label: 'เทพฮินดู / พราหมณ์ทั้งหมด',
    aliases: [
      'เทพฮินดู',
      'ฮินดู',
      'เทพพราหมณ์',
      'พราหมณ์',
      'พราหม',
      'เทพอินเดีย',
      'อินเดีย',
      'เทวาลัย',
      'เทพแขก',
      'hindu',
    ],
    types: ['devalai'],
  },
  {
    slug: 'buddhist',
    label: 'พระพุทธรูป / พระเกจิทั้งหมด',
    aliases: ['พระพุทธรูป', 'พุทธ', 'พระเกจิ', 'เกจิ', 'หลวงพ่อ', 'หลวงปู่'],
    types: [],
  },
  {
    slug: 'thai',
    label: 'เจ้าพ่อเจ้าแม่ / สิ่งศักดิ์สิทธิ์ไทยทั้งหมด',
    aliases: ['เทพไทย', 'เจ้าพ่อ', 'เจ้าแม่', 'ศาลเจ้าพ่อ', 'บรรพกษัตริย์'],
    types: [],
  },
  { slug: 'japanese', label: 'เทพญี่ปุ่นทั้งหมด', aliases: ['เทพญี่ปุ่น', 'ญี่ปุ่น', 'ชินโต', 'japanese'], types: [] },
];

export const FAMILY_PREFIX = 'family:';

export const DEITY_GROUPS: DeityGroup[] = [
  { slug: 'guan-yu', label: 'เทพเจ้ากวนอู', match: /กวนอู/, family: 'chinese' },
  { slug: 'guan-yin', label: 'เจ้าแม่กวนอิม', match: /กวนอิม/, family: 'chinese' },
  { slug: 'ganesha', label: 'พระพิฆเนศ', match: /พิฆเนศ|คเณศ/, family: 'hindu' },
  { slug: 'brahma', label: 'พระพรหม', match: /พระพรหม|ท้าวมหาพรหม/, family: 'hindu' },
  { slug: 'trimurti', label: 'พระตรีมูรติ', match: /ตรีมูรติ/, family: 'hindu' },
  { slug: 'lakshmi', label: 'พระแม่ลักษมี', match: /ลักษมี/, family: 'hindu' },
  { slug: 'uma', label: 'พระแม่อุมาเทวี', match: /อุมาเทวี/, family: 'hindu' },
  { slug: 'vessavana', label: 'ท้าวเวสสุวรรณ', match: /เวสสุวรรณ/, family: 'hindu' },
  { slug: 'rahu', label: 'พระราหู', match: /ราหู/, family: 'hindu' },
  { slug: 'sangkachai', label: 'พระสังกัจจายน์', match: /สังกัจจายน์/, family: 'buddhist' },
  { slug: 'mazu', label: 'เจ้าแม่ทับทิม (หม่าโจ้ว)', match: /ทับทิม|หม่าโจ้ว|หม่าจู่|ม่าจ้อ|มาจู/, family: 'chinese' },
  { slug: 'lim-ko-niao', label: 'เจ้าแม่ลิ้มกอเหนี่ยว', match: /ลิ้มกอเหนี่ยว/, family: 'chinese' },
  { slug: 'caishen', label: 'ไฉ่ซิงเอี๊ย (เทพเจ้าแห่งโชคลาภ)', match: /ไฉ่ซ/, family: 'chinese' },
  { slug: 'yue-lao', label: 'เทพเยว่เหล่า', match: /เยว่เหล่า/, family: 'chinese' },
  { slug: 'wenchang', label: 'เทพเจ้าบุ๋นเชียง', match: /บุ๋นเชียง|เหวินชาง/, family: 'chinese' },
  { slug: 'tai-hong', label: 'หลวงปู่ไต้ฮง', match: /ไต้ฮง/, family: 'chinese' },
  { slug: 'tua-lao-ia', label: 'เจ้าพ่อเสือ', match: /เจ้าพ่อเสือ/, family: 'chinese' },
  {
    slug: 'nine-emperor-gods',
    label: 'กิ๋วอ๋องไต่เต่ (เก้าอ๋อง)',
    match: /อ๋องไต่เต่|อ่องไต่เต่|อ้วงฮุดโจ้ว/,
    family: 'chinese',
  },
  {
    slug: 'earth-god',
    label: 'เทพเจ้าที่ (ปึงเถ่ากง / ตี่จู๋เอี๊ย)',
    match: /ตี่จู|เจ้าที่|เถ่ากง|เถ้ากง|แป๊ะกง/,
    family: 'chinese',
  },
  {
    slug: 'city-pillar',
    label: 'เจ้าพ่อหลักเมือง / เสาหลักเมือง',
    match: /หลักเมือง|อินทขิล|เฉิงหวง|เสื้อเมือง|ทรงเมือง/,
    family: 'thai',
  },
  {
    slug: 'healer',
    label: 'พระหมอ / เทพแห่งการรักษา',
    match: /พระหมอ|จ้อซู|โจ๊วซูกง|ซือกง|ชีวก|ฮัวโต๋|ไภษัชยคุรุ/,
    family: 'chinese',
  },
  { slug: 'phan-thai', label: 'พันท้ายนรสิงห์', match: /พันท้ายนรสิงห์/, family: 'thai' },
  { slug: 'relics', label: 'พระธาตุ / พระบรมสารีริกธาตุ', match: /ธาตุ/, family: 'buddhist' },
  { slug: 'reclining-buddha', label: 'พระพุทธไสยาสน์ (พระนอน)', match: /ไสยาสน์|พระนอน/, family: 'buddhist' },
  { slug: 'footprint', label: 'รอยพระพุทธบาท', match: /พระพุทธบาท/, family: 'buddhist' },
  {
    slug: 'buddha-image',
    label: 'พระพุทธรูปศักดิ์สิทธิ์ / หลวงพ่อ',
    match: /หลวงพ่อ|พระพุทธ(?!บาท)|พระประธาน|พระศรีศากยมุนี|พระแก้วมรกต|พระเจ้าองค์|พระเจ้าล้านทอง|พระมงคล/,
    family: 'buddhist',
  },
  { slug: 'phra-chinnarat', label: 'พระพุทธชินราช', match: /ชินราช/, family: 'buddhist' },
  { slug: 'than-jai', label: 'พระเจ้าทันใจ', match: /ทันใจ/, family: 'buddhist' },
  { slug: 'naga', label: 'พญานาค', match: /พญานาค|ปู่ศรี|ย่าศรี|นาคราช/, family: 'thai' },
  { slug: 'ai-khai', label: 'ไอ้ไข่', match: /ไอ้ไข่/, family: 'thai' },
  { slug: 'luang-pu-thuat', label: 'หลวงปู่ทวด', match: /หลวงปู่ทวด/, family: 'buddhist' },
  { slug: 'jatukam', label: 'จตุคามรามเทพ', match: /จตุคาม/, family: 'thai' },
  { slug: 'mae-nak', label: 'แม่นาคพระโขนง', match: /แม่นาค/, family: 'thai' },
  { slug: 'takhian', label: 'เจ้าแม่ตะเคียนทอง', match: /เจ้าแม่ตะเคียน/, family: 'thai' },
  { slug: 'taksin', label: 'สมเด็จพระเจ้าตากสินมหาราช', match: /ตากสิน|เจ้าพ่อตาก|พระเจ้าตาก/, family: 'thai' },
  { slug: 'naresuan', label: 'สมเด็จพระนเรศวรมหาราช', match: /สมเด็จพระนเรศวรมหาราช/, family: 'thai' },
  { slug: 'krom-luang-chumphon', label: 'กรมหลวงชุมพรฯ (เสด็จเตี่ย)', match: /กรมหลวงชุมพร/, family: 'thai' },
  { slug: 'ya-mo', label: 'ท้าวสุรนารี (ย่าโม)', match: /สุรนารี|ย่าโม/, family: 'thai' },
  { slug: 'mangrai', label: 'พญามังราย', match: /พญามังราย/, family: 'thai' },
  { slug: 'inari', label: 'เทพเจ้าอินาริ', match: /อินาริ/, family: 'japanese' },
];

export const deityGroup = (slug: string) => DEITY_GROUPS.find((g) => g.slug === slug);

/** องค์เทพของสถานที่อยู่ในกลุ่มนี้ไหม */
export const inDeityGroup = (group: DeityGroup, deities: string[]) => deities.some((d) => group.match.test(d));

export const deityFamily = (slug: string) => DEITY_FAMILIES.find((f) => f.slug === slug);

const norm = (x: string) => x.replace(/\s+/g, '').toLowerCase();

/** หมวดที่ตรงกับคำค้น เช่น "เทพพราหม์" -> hindu (คำค้นมีคำ alias อยู่ หรือ alias ขึ้นต้นด้วยคำค้น) */
export function familiesForQuery(query: string): DeityFamily[] {
  const q = norm(query);
  if (q.length < 2) return [];
  return DEITY_FAMILIES.filter((f) => f.aliases.some((a) => q.includes(norm(a)) || norm(a).startsWith(q)));
}

/** สถานที่อยู่ในหมวดนี้ไหม (มีเทพในหมวด หรือเป็นประเภทสถานที่ของหมวด เช่น ศาลเจ้าจีน เทวาลัย) */
export const inDeityFamily = (family: DeityFamily, place: { deities: string[]; type: string }) =>
  family.types.includes(place.type) ||
  DEITY_GROUPS.some((g) => g.family === family.slug && inDeityGroup(g, place.deities));
