import type { PhoneMeaning } from '@/data/phone-pairs';
import type { Planet } from '@/data/daily-colors';

/**
 * เช็กทะเบียนรถมงคล (ความเชื่อ) รวบรวม 2026-10-13 จาก PLATE_SOURCES
 * - ค่าตัวอักษร: ตารางเลขศาสตร์อักษรไทยที่แหล่งส่วนใหญ่ใช้ตรงกัน (ตรวจกับตัวอย่างของแหล่ง เช่น 8กข 4351 = 24)
 * - ผลรวม: ค่าอักษร + ตัวเลขทุกตัวรวมเลขนำหน้าหมวด ไม่นับจังหวัด อ่านความหมายตรง ๆ
 * - อักษรประจำดาวตามทักษา ใช้หาอักษรกาลกิณีและอักษรเสริมตามวันเกิด (หลักเดียวกับสีเสื้อ)
 */

export const LETTER_VALUES: Record<string, number> = {"ก": 1, "ข": 2, "ฃ": 3, "ค": 4, "ฅ": 3, "ฆ": 3, "ง": 2, "จ": 6, "ฉ": 5, "ช": 2, "ซ": 7, "ฌ": 5, "ญ": 4, "ฎ": 5, "ฏ": 9, "ฐ": 9, "ฑ": 3, "ฒ": 3, "ณ": 5, "ด": 1, "ต": 3, "ถ": 1, "ท": 1, "ธ": 4, "น": 5, "บ": 2, "ป": 2, "ผ": 8, "ฝ": 8, "พ": 8, "ฟ": 8, "ภ": 1, "ม": 5, "ย": 8, "ร": 4, "ล": 6, "ว": 6, "ศ": 7, "ษ": 4, "ส": 7, "ห": 5, "ฬ": 5, "อ": 6, "ฮ": 5};

/** อักษรประจำดาว (ทักษา) อาทิตย์ = อ และสระ */
export const PLANET_LETTERS: Record<Planet, string[]> = {"sun": ["อ"], "moon": ["ก", "ข", "ค", "ฆ", "ง"], "mars": ["จ", "ฉ", "ช", "ซ", "ฌ", "ญ"], "mercury": ["ฎ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ"], "jupiter": ["บ", "ป", "ผ", "ฝ", "พ", "ฟ", "ภ", "ม"], "venus": ["ศ", "ษ", "ส", "ห", "ฬ", "ฮ"], "saturn": ["ด", "ต", "ถ", "ท", "ธ", "น"], "rahu": ["ย", "ร", "ล", "ว"]};

/** กลุ่มคู่เลขเฉพาะรถที่แหล่งพูดถึง (ดี: แคล้วคลาด เมตตา การเงิน อำนาจ / เสีย: อุบัติเหตุ รถเสีย ฯลฯ) */
export const PLATE_PAIR_GROUPS: { key: string; label: string; good: boolean; pairs: string[] }[] = [
  { key: 'protection', label: "แคล้วคลาด สิ่งศักดิ์สิทธิ์คุ้มครอง", good: true, pairs: ["15", "51", "35", "53", "49", "94", "55", "59", "95", "99"] },
  { key: 'love', label: "เมตตามหานิยม", good: true, pairs: ["22", "23", "32", "24", "42", "26", "62", "29", "92", "36", "63"] },
  { key: 'money', label: "การเงิน การค้า", good: true, pairs: ["24", "42", "36", "63", "66", "28", "82"] },
  { key: 'career', label: "อำนาจบารมี", good: true, pairs: ["15", "51", "35", "53", "45", "54", "89", "98", "99"] },
  { key: 'accident', label: "เชื่อว่าระวังอุบัติเหตุ", good: false, pairs: ["13", "31", "33", "37", "73", "38", "83"] },
  { key: 'repair', label: "เชื่อว่ารถเสียบ่อย", good: false, pairs: ["01", "10", "02", "20", "03", "30", "13", "31", "33", "06", "60", "67", "76"] },
  { key: 'scratch', label: "เชื่อว่ามีรอยขีดข่วน", good: false, pairs: ["17", "71", "35", "53", "36", "63", "39", "93", "67", "76", "77"] },
  { key: 'electric', label: "เชื่อว่าระบบไฟฟ้ามีปัญหา", good: false, pairs: ["11", "19", "91"] },
  { key: 'temper', label: "เชื่อว่าหงุดหงิดใจร้อนเวลาขับ", good: false, pairs: ["01", "10", "03", "30", "07", "70", "12", "21", "13", "31", "33", "37", "73", "38", "83"] },
];

export const PLATE_SUMS: Record<number, PhoneMeaning> = {
  2: {level: "good", meaning: "เสริมการเงินและงานบริการ ใจเย็น มีเสน่ห์ เหมาะงานค้าขายและการเงิน", goals: ["money", "business"], agreement: "high"},
  3: {level: "bad", meaning: "มีพลังทำงานแต่ใจร้อน เชื่อว่าขับรถต้องระวังเฉี่ยวชน", goals: [], agreement: "medium"},
  4: {level: "good", meaning: "เจรจาเก่ง สื่อสารดี มีชื่อเสียง พูดแล้วคนเชื่อ", goals: ["business", "career"], agreement: "high"},
  5: {level: "good", meaning: "น่าเชื่อถือ มีสติปัญญา เชื่อว่าช่วยให้ขับขี่มีสติและปลอดภัย", goals: ["study", "career", "protection"], agreement: "high"},
  6: {level: "good", meaning: "มีคนอุปถัมภ์ เสน่ห์ดี สมหวังเรื่องเงินและความรัก", goals: ["love", "money"], agreement: "high"},
  7: {level: "bad", meaning: "ตำราผลรวมจัดเป็นเลขเหนื่อย เสี่ยงเสียทรัพย์และอุบัติเหตุ", goals: [], agreement: "medium"},
  8: {level: "neutral", meaning: "เด่นการค้าและความร่ำรวย แต่ใจร้อน กล้าเสี่ยง ต้องระวัง", goals: ["business", "money"], agreement: "medium"},
  9: {level: "good", meaning: "สิ่งศักดิ์สิทธิ์คุ้มครอง แคล้วคลาดปลอดภัย เหมาะกับทุกคน", goals: ["protection", "career"], agreement: "high"},
  10: {level: "neutral", meaning: "ชีวิตมีขึ้นลง ต้องพยายามมากกว่าคนอื่นจึงสำเร็จ", goals: [], agreement: "low"},
  11: {level: "bad", meaning: "เริ่มต้นดีแต่ไปไม่ถึงฝั่ง เรื่องดีมักไม่ยั่งยืน", goals: [], agreement: "high"},
  12: {level: "bad", meaning: "ชีวิตเปลี่ยนแปลงบ่อย มีเรื่องขัดแย้งในบ้าน เหนื่อยใจ", goals: [], agreement: "high"},
  13: {level: "bad", meaning: "หลายตำราเรียกเลขมรณะ เชื่อว่าต้องระวังอุบัติเหตุ", goals: [], agreement: "low"},
  14: {level: "good", meaning: "ผู้ยิ่งใหญ่ เจรจาเก่ง ผู้ใหญ่เมตตา งานและการค้าก้าวหน้า", goals: ["career", "business", "study"], agreement: "high"},
  15: {level: "good", meaning: "ปัญญาดี มีเสน่ห์ มีผู้ใหญ่ช่วย เปลี่ยนร้ายให้กลายเป็นดี", goals: ["career", "study", "love"], agreement: "high"},
  16: {level: "neutral", meaning: "ต้องอดทนกว่าจะสำเร็จ บางเว็บว่าเสริมตำแหน่งงาน", goals: [], agreement: "medium"},
  17: {level: "bad", meaning: "เหนื่อยและวุ่นวาย อำนาจถูกลดทอน งานติดขัด", goals: [], agreement: "high"},
  18: {level: "neutral", meaning: "ชีวิตขึ้นลง ต้องโยกย้ายบ่อย ต้องพยายามหนักจึงสำเร็จ", goals: [], agreement: "low"},
  19: {level: "good", meaning: "ผู้เสวยสุข ก้าวหน้า ผู้ใหญ่อุปถัมภ์ เด่นงานใหญ่และต่างประเทศ", goals: ["career", "business", "study"], agreement: "high"},
  20: {level: "bad", meaning: "คิดการใหญ่แต่เพ้อฝัน อ่อนไหว ทำอะไรไม่ค่อยต่อเนื่อง", goals: [], agreement: "medium"},
  21: {level: "bad", meaning: "ชีวิตพลิกผัน มีเหตุให้แตกหักกลางทาง", goals: [], agreement: "high"},
  22: {level: "neutral", meaning: "เมตตาและเสน่ห์ดี แต่ต้องอดทน เรื่องดีมักสะดุด", goals: ["love"], agreement: "medium"},
  23: {level: "good", meaning: "ยอดเสน่ห์ มีผู้ใหญ่อุปถัมภ์ เด่นงานที่ต้องพบผู้คน", goals: ["love", "business"], agreement: "high"},
  24: {level: "good", meaning: "สมบูรณ์พูนสุข เสน่ห์ เจรจาดี เงินคล่อง ผลรวมยอดนิยมของทะเบียน", goals: ["love", "money", "business"], agreement: "high"},
  25: {level: "neutral", meaning: "มีทั้งสุขและทุกข์ ก้าวหน้าแต่ต้องฝ่าอุปสรรค", goals: [], agreement: "medium"},
  26: {level: "neutral", meaning: "ต้องพยายามจึงได้ผล บางเว็บว่าเด่นงานออนไลน์และต่างประเทศ", goals: [], agreement: "medium"},
  27: {level: "bad", meaning: "เจอแรงกดดัน สูญเสียบ่อย ชีวิตมีความทุกข์", goals: [], agreement: "high"},
  28: {level: "neutral", meaning: "ชอบลุยและเดินทาง ห่างบ้าน ต้องใช้ความพยายามมาก", goals: [], agreement: "medium"},
  29: {level: "bad", meaning: "ชีวิตพลิกผัน ถูกกดดัน เหมือนชดใช้กรรมเก่า", goals: [], agreement: "high"},
  30: {level: "bad", meaning: "งานกำลังดีแล้วมีอุปสรรค ถอยหลังเข้าคลอง", goals: [], agreement: "high"},
  31: {level: "bad", meaning: "ทุกข์ซ้ำซาก เชื่อว่าระวังบาดแผลและความขัดแย้ง", goals: [], agreement: "low"},
  32: {level: "good", meaning: "เสน่ห์แรง คนเอ็นดู งานไปได้ดี แต่ผู้ชายระวังเรื่องผู้หญิง", goals: ["love", "career"], agreement: "medium"},
  33: {level: "bad", meaning: "ขยันแต่เจ้าอารมณ์ ใจร้อน เชื่อว่าระวังอุบัติเหตุ", goals: [], agreement: "high"},
  34: {level: "bad", meaning: "พูดตรงจนมีศัตรู มีเรื่องคับขันบ่อย", goals: [], agreement: "high"},
  35: {level: "neutral", meaning: "เด็ดขาดจริงจัง แต่แตกหักง่าย ต้องใช้ความอดทน", goals: [], agreement: "low"},
  36: {level: "good", meaning: "ความรักสดชื่น เงินทองไม่ขาด มีคนอุปถัมภ์ งานเจรจาก้าวหน้า", goals: ["love", "money", "career"], agreement: "high"},
  37: {level: "bad", meaning: "ปัญหาเรื้อรัง ชีวิตยากลำบาก เชื่อว่าระวังอุบัติเหตุ", goals: [], agreement: "high"},
  38: {level: "neutral", meaning: "ใจร้อน กล้าได้กล้าเสีย บางเว็บว่าเด่นการลงทุนแต่เสี่ยง", goals: [], agreement: "low"},
  39: {level: "neutral", meaning: "มีเรื่องกระทบใจ ต้องอดทนสูงจึงไปได้ดี", goals: [], agreement: "low"},
  40: {level: "good", meaning: "ฐานะมั่นคง ชอบเดินทาง ความคิดสร้างสรรค์ มีชื่อเสียง", goals: ["career", "money"], agreement: "medium"},
  41: {level: "good", meaning: "สำเร็จมั่นคง ปัญญาดี มีวาทศิลป์ เด่นงานบริหารและค้าขาย", goals: ["career", "business", "study"], agreement: "high"},
  42: {level: "good", meaning: "ดวงอุปถัมภ์ มีเสน่ห์ เพื่อนมาก การเงินดี", goals: ["love", "money", "career"], agreement: "high"},
  43: {level: "bad", meaning: "เจออุปสรรคบ่อย ต้องแก้ปัญหาไม่จบ", goals: [], agreement: "medium"},
  44: {level: "good", meaning: "ฝีปากดี สื่อสารเก่ง เด่นงานค้าขายและนายหน้า", goals: ["business", "career"], agreement: "medium"},
  45: {level: "good", meaning: "เทพีแห่งโชค โชคไม่คาดฝัน ปัญญาดี มีสิ่งศักดิ์สิทธิ์คุ้มครอง", goals: ["money", "study", "protection"], agreement: "high"},
  46: {level: "good", meaning: "มีคนสนับสนุน ความรักและครอบครัวมีสุข ค้าขายดี", goals: ["love", "family", "business"], agreement: "high"},
  47: {level: "neutral", meaning: "พูดจริงทำจริง แต่ต้องเหนื่อยกว่าจะได้ผล", goals: [], agreement: "low"},
  48: {level: "bad", meaning: "ดื้อดึง มีศัตรูเพราะคำพูด ลาภไม่ค่อยมา", goals: [], agreement: "high"},
  49: {level: "neutral", meaning: "ต้องระมัดระวังและพยายาม บางตำราว่าทุกข์ซ้ำซาก", goals: [], agreement: "low"},
  50: {level: "good", meaning: "ก้าวไปสู่ความสำเร็จ เด่นงานเดินทางและต่างประเทศ ปัญญาดี", goals: ["career", "study"], agreement: "high"},
  51: {level: "good", meaning: "มีคนช่วยเสมอ ชื่อเสียง การงาน การเงินดี", goals: ["career", "money", "study"], agreement: "high"},
  52: {level: "neutral", meaning: "ให้คุณปานกลาง มีอุปสรรคที่ต้องฝ่าไป", goals: [], agreement: "medium"},
  53: {level: "neutral", meaning: "คิดเฉียบขาด แต่มักถูกเบียดบัง", goals: [], agreement: "medium"},
  54: {level: "good", meaning: "โชคลาภ อำนาจบารมี สำเร็จง่าย มีผู้ใหญ่หนุน", goals: ["money", "career", "business"], agreement: "high"},
  55: {level: "good", meaning: "เจริญก้าวหน้า สุขสบาย มั่นคง เชื่อว่ามีสิ่งศักดิ์สิทธิ์คุ้มครอง", goals: ["career", "money", "protection"], agreement: "high"},
  56: {level: "good", meaning: "มีโอกาสใหม่บ่อย ผู้ใหญ่สนับสนุน งานและความรักดี", goals: ["career", "love", "business"], agreement: "high"},
  57: {level: "bad", meaning: "ดื้อดึง คิดมาก โกรธแล้วหายยาก", goals: [], agreement: "low"},
  58: {level: "bad", meaning: "หลงผิดง่าย เส้นทางชีวิตสะดุด", goals: [], agreement: "low"},
  59: {level: "good", meaning: "ทำอะไรก็สำเร็จ สิ่งศักดิ์สิทธิ์คุ้มครอง เด่นงานราชการ", goals: ["career", "protection", "study"], agreement: "high"},
  60: {level: "good", meaning: "มีเสน่ห์และโชคเรื่องเงิน แต่อาจเพ้อฝัน", goals: ["money", "love"], agreement: "low"},
  61: {level: "bad", meaning: "ความพ่ายแพ้ อารมณ์แรงเรื่องรัก", goals: [], agreement: "low"},
  62: {level: "bad", meaning: "อยู่ในสภาพแวดล้อมไม่ดี มีอิทธิพลมืดรอบตัว", goals: [], agreement: "low"},
  63: {level: "good", meaning: "งานก้าวหน้า มีเงิน ความรัก และความร่วมมือ", goals: ["love", "money", "career"], agreement: "high"},
  64: {level: "good", meaning: "เมตตามหานิยม เสน่ห์ มีคนช่วยทั้งงานและความรัก", goals: ["love", "business"], agreement: "high"},
  65: {level: "good", meaning: "คู่ทรัพย์คู่โชค เงินคล่อง มีคนรักเอ็นดู", goals: ["money", "career"], agreement: "high"},
};

/** ความเชื่อที่พบบ่อย (แสดงในกล่องหลักคำนวณ) */
export const PLATE_RULES: string[] = [
  'เชื่อกันว่าควรเลี่ยงหมวดอักษรและเลขที่เป็นกาลกิณีของวันเกิดเจ้าของรถ ถ้าเลี่ยงไม่ได้อย่าให้เลขกาลกิณีอยู่ตัวท้ายสุด',
  'คู่เลข 13 31 37 73 30 03 ถ้าอยู่ติดกัน เชื่อว่าเสี่ยงอุบัติเหตุ และหลายตำราเลี่ยงผลรวม 13',
  'บางตำราดูคู่หน้า (2 ตัวแรก) และคู่หลัง (2 ตัวท้าย) ของเลข 4 หลัก บวกกันแล้วควรได้ 5 ขึ้นไป',
  'อีกสายนิยมบวกเฉพาะตัวเลขแล้วย่อเหลือหลักเดียว (1-9) เว็บจึงแสดงไว้ทั้งสองแบบ',
  'หมวดอักษรเป็นกาลกิณีก็ห้ามเอาทองหรือสติกเกอร์ปิดป้าย เพราะผิดกฎหมาย และการขับขี่อย่างมีสติสำคัญกว่าตัวเลขเสมอ',
];

export const PLATE_SOURCES: { url: string; title: string }[] = [
  {url: "https://www.thairath.co.th/horoscope/belief/2531598", title: "Thairath: วิธีเลือกทะเบียนรถมงคล 2565-2566 (ผลรวมหลักเดียว คู่เลข อักษร/เลขกาลกิณีตามวันเกิด)"},
  {url: "https://www.thairath.co.th/horoscope/belief/2865096", title: "Thairath: วิธีดูผลรวมเลขทะเบียนรถมงคล ดีมาก ดีปานกลาง และไม่ดี (2568)"},
  {url: "https://www.thairath.co.th/news/local/2810040", title: "Thairath (ข่าวประชาสัมพันธ์, อ้างประกันติดโล่): ทะเบียนรถมงคล ตามวันเกิด ปี 2567"},
  {url: "https://www.ktc.co.th/article/auto/car/lucky-number-plate-registration", title: "KTC: เลขมงคลทะเบียนรถ ตามผลรวมพร้อมความหมาย 0-9 ปี 2569 (ตารางอักษรสลับกลุ่ม 3/4)"},
  {url: "https://www.ktc.co.th/article/knowledge/auspicious-car-plate-numbers-atpb", title: "KTC: เลขทะเบียนรถมงคล เลือกเลขไหนให้ใช่ (2566)"},
  {url: "https://www.ktc.co.th/article/knowledge/the-meanings-of-numbers-in-car-plate-atpb", title: "KTC: ความหมายของเลขทะเบียนรถ แต่ละหลักแทนอะไร (โครงสร้างป้าย ไม่ใช่ความเชื่อ)"},
  {url: "https://www.ktc.co.th/article/auto/drive-maintenance/thai-holoscope", title: "KTC: ทำนายทะเบียนรถ 2568 (บวก 4 ตัวท้ายย่อหลักเดียว)"},
  {url: "https://shopee.co.th/blog/lucky-car-registration-number/amp/", title: "Shopee Blog: ผลรวมเลขทะเบียนรถมงคล และเคล็ดลับเสริมดวง"},
  {url: "https://www.dailynews.co.th/articles/1469136/", title: "เดลินิวส์ (อ.บอย ไพ่ผ่องญาณ): อักษรทะเบียนรถ สมพงศ์ตามวันเกิด (ทักษาและเลขศาสตร์อักษร)"},
  {url: "https://www.dailynews.co.th/articles/1528899/", title: "เดลินิวส์: บทความเดียวกันอีก URL (ไม่นับเป็นแหล่งแยก)"},
  {url: "https://www.sanook.com/horoscope/294243/", title: "Sanook ดูดวง: วิธีคิดผลรวมทะเบียนรถ (ไม่รวมอักษรและเลขหน้าหมวด, 2567)"},
  {url: "https://www.sanook.com/auto/89383/", title: "Sanook Auto: ผลรวมเลขทะเบียนมงคล เลขไหนดี เลขไหนควรเลี่ยง (2567)"},
  {url: "https://www.sanook.com/horoscope/63945/", title: "Sanook ดูดวง: ดูดวงทะเบียนรถ ความหมายเลข 0-9 (2557, อ้าง duangprakasit)"},
  {url: "https://www.wongnai.com/articles/lucky-car-registration", title: "Wongnai: แนะนำวิธีเลือกเลขทะเบียนรถมงคล 2568"},
  {url: "https://car.kapook.com/view54833.html", title: "Kapook: เลขทะเบียนรถมงคล ผลรวมตามวันเกิด 2568 (อ้างหนังสือโหรามหาเวทย์)"},
  {url: "https://www.pptvhd36.com/news/%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%8A%E0%B8%B2%E0%B8%AA%E0%B8%B1%E0%B8%A1%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C/247765", title: "PPTV (advertorial SILKSPAN): วิเคราะห์เลขทะเบียนรถ"},
  {url: "https://www.supertabien.com/meaning/", title: "SuperTabien (ร้านขายทะเบียน): ความหมายผลรวมเลข วิธีคำนวณ อักษร/เลขกาลกิณี"},
  {url: "https://fasttabien.com/horo.html", title: "FastTabien (ร้านขายทะเบียน): ดูดวงทะเบียนรถ 2569"},
  {url: "https://www.tabienkub.com/calculator", title: "TabienKub (ร้านขายทะเบียน): คำนวณผลรวมทะเบียนรถ (ใช้เลขราก)"},
  {url: "https://www.chokdeetabien.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/21/%E0%B8%97%E0%B8%B0%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%96%E0%B8%9C%E0%B8%A5%E0%B8%A3%E0%B8%A7%E0%B8%A1%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%AB%E0%B8%A3%E0%B9%88%E0%B8%96%E0%B8%B6%E0%B8%87%E0%B8%88%E0%B8%B0%E0%B8%94%E0%B8%B5", title: "Chokdee Tabien (ร้านขายทะเบียน): วิเคราะห์ผลรวมทะเบียนรถ"},
  {url: "https://selltabien.com/article_22.php", title: "Selltabien (ร้านขายทะเบียน): 5 อันดับผลรวมทะเบียนรถดี"},
  {url: "https://www.thetabienrod.com/detail.php?pageid=NQ%3D%3D&content=MTM%3D", title: "TheTabienRod (ร้านขายทะเบียน): ผลรวมที่ลูกค้าถามหามากที่สุด"},
  {url: "https://www.bentabien.com/horoscope-thai/", title: "BenTabien (ร้านขายทะเบียน): ดูผลรวมทะเบียนมงคล (รวมเลขหน้าหมวด)"},
  {url: "https://www.thansettakij.com/motor/613355", title: "ฐานเศรษฐกิจ: ประกาศเพิ่มตัวอักษร 36 หมวดป้ายทะเบียนพิเศษ กทม."},
  {url: "https://www.thaipbs.or.th/news/content/341731", title: "Thai PBS: ใช้แล้ว 70 ตัวอักษรป้ายทะเบียนรถใหม่ (2567)"},
  {url: "https://www.thaipost.net/hi-light/84173/", title: "ไทยโพสต์: ประกาศกรมการขนส่งทางบก หลักเกณฑ์กำหนดตัวอักษรประจำหมวด (2565)"},
  {url: "https://mytour.vn/th/blog/horoscope/1737686888770-24012025-mytour.html", title: "Mytour: เคล็ดลับเลือกป้ายทะเบียนรถมงคล (คัดจาก Thairath 2565 ไม่นับเป็นแหล่งอิสระ)"},
];
