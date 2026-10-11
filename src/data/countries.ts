/**
 * ประเทศสำหรับมูต่างประเทศ (/abroad/[country]) slug ใช้ใน URL, code ตรงกับช่อง country ของสถานที่ (ISO 3166-1)
 * เนื้อหาแนะนำประเทศเขียนเฉพาะสิ่งที่ไม่เปลี่ยนบ่อย (ไม่ใส่วีซ่า ค่าเงิน ราคา)
 */
export interface Country {
  slug: string;
  code: string;
  name: string;
  intro: string;
}

export const COUNTRIES: Country[] = [
  {
    slug: 'japan',
    code: 'JP',
    name: 'ญี่ปุ่น',
    intro: 'ศาลเจ้าชินโตและวัดพุทธของญี่ปุ่นเป็นจุดขอพรยอดนิยมของคนไทย ทั้งเรื่องงาน เงิน และความรัก นิยมซื้อเครื่องรางโอมาโมริและเขียนคำขอพรบนแผ่นไม้เอมะ',
  },
  {
    slug: 'hong-kong',
    code: 'HK',
    name: 'ฮ่องกง',
    intro: 'ฮ่องกงมีศาลเจ้าจีนเก่าแก่หลายแห่งกลางเมือง เดินทางสะดวกด้วยรถไฟใต้ดิน คนไทยนิยมไปไหว้ขอพรเรื่องโชคลาภ การงาน และเสี่ยงเซียมซี',
  },
  {
    slug: 'taiwan',
    code: 'TW',
    name: 'ไต้หวัน',
    intro: 'วัดและศาลเจ้าจีนในไต้หวันขึ้นชื่อเรื่องขอพรความรักกับเทพเยว่เหล่า และขอพรการเรียนการงาน หลายแห่งอยู่ในไทเปเดินทางง่าย',
  },
];

export const getCountry = (slug: string) => COUNTRIES.find((c) => c.slug === slug);
export const countryByCode = (code: string) => COUNTRIES.find((c) => c.code === code);
