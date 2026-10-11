/** จังหวัด: slug ภาษาอังกฤษใน URL (/places/[province]) ห้ามซ้ำกับ slug ของสถานที่ */
export const PROVINCES: Record<string, string> = {
  bangkok: 'กรุงเทพมหานคร',
  chachoengsao: 'ฉะเชิงเทรา',
  'chiang-mai': 'เชียงใหม่',
  'nakhon-si-thammarat': 'นครศรีธรรมราช',
  nonthaburi: 'นนทบุรี',
  'nakhon-pathom': 'นครปฐม',
  ayutthaya: 'พระนครศรีอยุธยา',
  'chiang-rai': 'เชียงราย',
  phuket: 'ภูเก็ต',
  'khon-kaen': 'ขอนแก่น',
  'udon-thani': 'อุดรธานี',
  'nakhon-phanom': 'นครพนม',
  chonburi: 'ชลบุรี',
};

/** ชื่อสั้นสำหรับการ์ด */
export const provinceShortName = (slug: string) =>
  slug === 'bangkok' ? 'กรุงเทพฯ' : (PROVINCES[slug] ?? slug);
