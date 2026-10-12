/**
 * กลุ่มองค์เทพสำหรับตัวกรองสถานที่
 * ชื่อองค์เทพในข้อมูลเขียนได้หลายแบบ (กวนอู / เทพเจ้ากวนอู / เจ้าพ่อกวนอู) ตัวกรองจึงจับกลุ่มด้วย pattern
 * สถานที่ที่ไม่เข้ากลุ่มไหนยังหาเจอด้วยเป้าหมายและจังหวัด เพิ่มกลุ่มใหม่ได้ที่นี่
 */
export interface DeityGroup {
  slug: string;
  label: string;
  match: RegExp;
}

export const DEITY_GROUPS: DeityGroup[] = [
  { slug: 'guan-yu', label: 'เทพเจ้ากวนอู', match: /กวนอู/ },
  { slug: 'guan-yin', label: 'เจ้าแม่กวนอิม', match: /กวนอิม/ },
  { slug: 'ganesha', label: 'พระพิฆเนศ', match: /พิฆเนศ|คเณศ/ },
  { slug: 'brahma', label: 'พระพรหม', match: /พระพรหม|ท้าวมหาพรหม/ },
  { slug: 'trimurti', label: 'พระตรีมูรติ', match: /ตรีมูรติ/ },
  { slug: 'lakshmi', label: 'พระแม่ลักษมี', match: /ลักษมี/ },
  { slug: 'uma', label: 'พระแม่อุมาเทวี', match: /อุมาเทวี/ },
  { slug: 'vessavana', label: 'ท้าวเวสสุวรรณ', match: /เวสสุวรรณ/ },
  { slug: 'rahu', label: 'พระราหู', match: /ราหู/ },
  { slug: 'sangkachai', label: 'พระสังกัจจายน์', match: /สังกัจจายน์/ },
  { slug: 'mazu', label: 'เจ้าแม่ทับทิม (หม่าโจ้ว)', match: /ทับทิม|หม่าโจ้ว|หม่าจู่|ม่าจ้อ|มาจู/ },
  { slug: 'lim-ko-niao', label: 'เจ้าแม่ลิ้มกอเหนี่ยว', match: /ลิ้มกอเหนี่ยว/ },
  { slug: 'caishen', label: 'ไฉ่ซิงเอี๊ย (เทพเจ้าแห่งโชคลาภ)', match: /ไฉ่ซ/ },
  { slug: 'yue-lao', label: 'เทพเยว่เหล่า', match: /เยว่เหล่า/ },
  { slug: 'wenchang', label: 'เทพเจ้าบุ๋นเชียง', match: /บุ๋นเชียง|เหวินชาง/ },
  { slug: 'tai-hong', label: 'หลวงปู่ไต้ฮง', match: /ไต้ฮง/ },
  { slug: 'tua-lao-ia', label: 'เจ้าพ่อเสือ', match: /เจ้าพ่อเสือ/ },
  { slug: 'nine-emperor-gods', label: 'กิ๋วอ๋องไต่เต่ (เก้าอ๋อง)', match: /อ๋องไต่เต่|อ่องไต่เต่|อ้วงฮุดโจ้ว/ },
  { slug: 'earth-god', label: 'เทพเจ้าที่ (ปึงเถ่ากง / ตี่จู๋เอี๊ย)', match: /ตี่จู|เจ้าที่|เถ่ากง|เถ้ากง|แป๊ะกง/ },
  {
    slug: 'city-pillar',
    label: 'เจ้าพ่อหลักเมือง / เสาหลักเมือง',
    match: /หลักเมือง|อินทขิล|เฉิงหวง|เสื้อเมือง|ทรงเมือง/,
  },
  { slug: 'healer', label: 'พระหมอ / เทพแห่งการรักษา', match: /พระหมอ|จ้อซู|โจ๊วซูกง|ซือกง|ชีวก|ฮัวโต๋|ไภษัชยคุรุ/ },
  { slug: 'phan-thai', label: 'พันท้ายนรสิงห์', match: /พันท้ายนรสิงห์/ },
  { slug: 'relics', label: 'พระธาตุ / พระบรมสารีริกธาตุ', match: /ธาตุ/ },
  { slug: 'reclining-buddha', label: 'พระพุทธไสยาสน์ (พระนอน)', match: /ไสยาสน์|พระนอน/ },
  { slug: 'footprint', label: 'รอยพระพุทธบาท', match: /พระพุทธบาท/ },
  {
    slug: 'buddha-image',
    label: 'พระพุทธรูปศักดิ์สิทธิ์ / หลวงพ่อ',
    match: /หลวงพ่อ|พระพุทธ(?!บาท)|พระประธาน|พระศรีศากยมุนี|พระแก้วมรกต|พระเจ้าองค์|พระเจ้าล้านทอง|พระมงคล/,
  },
  { slug: 'phra-chinnarat', label: 'พระพุทธชินราช', match: /ชินราช/ },
  { slug: 'than-jai', label: 'พระเจ้าทันใจ', match: /ทันใจ/ },
  { slug: 'naga', label: 'พญานาค', match: /พญานาค|ปู่ศรี|ย่าศรี|นาคราช/ },
  { slug: 'ai-khai', label: 'ไอ้ไข่', match: /ไอ้ไข่/ },
  { slug: 'luang-pu-thuat', label: 'หลวงปู่ทวด', match: /หลวงปู่ทวด/ },
  { slug: 'jatukam', label: 'จตุคามรามเทพ', match: /จตุคาม/ },
  { slug: 'mae-nak', label: 'แม่นาคพระโขนง', match: /แม่นาค/ },
  { slug: 'takhian', label: 'เจ้าแม่ตะเคียนทอง', match: /เจ้าแม่ตะเคียน/ },
  { slug: 'taksin', label: 'สมเด็จพระเจ้าตากสินมหาราช', match: /ตากสิน|เจ้าพ่อตาก|พระเจ้าตาก/ },
  { slug: 'naresuan', label: 'สมเด็จพระนเรศวรมหาราช', match: /สมเด็จพระนเรศวรมหาราช/ },
  { slug: 'krom-luang-chumphon', label: 'กรมหลวงชุมพรฯ (เสด็จเตี่ย)', match: /กรมหลวงชุมพร/ },
  { slug: 'ya-mo', label: 'ท้าวสุรนารี (ย่าโม)', match: /สุรนารี|ย่าโม/ },
  { slug: 'mangrai', label: 'พญามังราย', match: /พญามังราย/ },
  { slug: 'inari', label: 'เทพเจ้าอินาริ', match: /อินาริ/ },
];

export const deityGroup = (slug: string) => DEITY_GROUPS.find((g) => g.slug === slug);

/** องค์เทพของสถานที่อยู่ในกลุ่มนี้ไหม */
export const inDeityGroup = (group: DeityGroup, deities: string[]) => deities.some((d) => group.match.test(d));
