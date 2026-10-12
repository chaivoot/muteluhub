/**
 * รหัส Agoda สำหรับลิงก์ที่พัก (ดึงจาก autosuggest ของ Agoda 2026-10-12)
 * - AGODA_CITY: จังหวัด -> city id (ใช้เมื่อสถานที่ไม่มี poi)
 * - AGODA_ABROAD_CITY: เมืองต่างประเทศ (ชื่อไทยตามช่อง city) -> city id
 * - AGODA_POI: slug สถานที่ -> landmark (poi) ใน Agoda ผลค้นหาจะเรียงที่พักใกล้สถานที่นั้น
 * จับคู่ด้วยชื่อ + เมือง แล้วตรวจด้วยตา รายการที่ไม่แน่ใจไม่ใส่ (ใช้ city ของจังหวัดแทน)
 * สถานที่ใหม่: ใส่ agodaLinkOverride ตอนนำเข้า หรือเพิ่ม poi ที่นี่
 */
export const AGODA_CITY: Record<string, number> = {
  bangkok: 9395,
  krabi: 14865,
  kanchanaburi: 16223,
  kalasin: 17788,
  'kamphaeng-phet': 19341,
  'khon-kaen': 7233,
  chanthaburi: 19433,
  chachoengsao: 127844,
  chonburi: 17787,
  'chai-nat': 213492,
  chaiyaphum: 214879,
  chumphon: 17383,
  'chiang-rai': 4234,
  'chiang-mai': 7401,
  trang: 4682,
  trat: 17798,
  tak: 19704,
  'nakhon-nayok': 17789,
  'nakhon-pathom': 17022,
  'nakhon-phanom': 17791,
  'nakhon-ratchasima': 702243,
  'nakhon-si-thammarat': 17790,
  'nakhon-sawan': 15308,
  nonthaburi: 17764,
  narathiwat: 21529,
  nan: 16115,
  'bueng-kan': 513148,
  buriram: 105938,
  'pathum-thani': 127869,
  'prachuap-khiri-khan': 18732,
  prachinburi: 17794,
  pattani: 17792,
  ayutthaya: 214377,
  phayao: 127871,
  phangnga: 102461,
  phatthalung: 214338,
  phichit: 127873,
  phitsanulok: 15936,
  phetchaburi: 17793,
  phetchabun: 16089,
  phrae: 11743,
  phuket: 16056,
  'maha-sarakham': 214043,
  mukdahan: 17041,
  'mae-hong-son': 15395,
  yasothon: 17800,
  yala: 127901,
  'roi-et': 17795,
  ranong: 1037,
  rayong: 217,
  ratchaburi: 102464,
  lopburi: 17762,
  lampang: 12384,
  lamphun: 21253,
  loei: 17036,
  sisaket: 105945,
  'sakon-nakhon': 214070,
  songkhla: 17392,
  satun: 17797,
  'samut-prakan': 214541,
  'samut-songkhram': 214543,
  'samut-sakhon': 214542,
  'sa-kaeo': 512735,
  saraburi: 17796,
  'sing-buri': 214610,
  sukhothai: 12546,
  'suphan-buri': 127898,
  'surat-thani': 2570,
  surin: 17765,
  'nong-khai': 105626,
  'nong-bua-lamphu': 513171,
  'ang-thong': 204080,
  'amnat-charoen': 214025,
  'udon-thani': 10787,
  uttaradit: 17766,
  'uthai-thani': 17799,
  'ubon-ratchathani': 6771,
};

export const AGODA_ABROAD_CITY: Record<string, number> = {
  เกียวโต: 1784,
  โตเกียว: 5085,
  ฮ่องกง: 16808,
  ไทเป: 4951,
  หนานโถว: 18346,
};

export const AGODA_POI: Record<string, { poi: number; city: number }> = {
  'chao-mae-soi-dok-mak-ayutthaya': { poi: 57001, city: 17704 }, // วัดพนัญเชิง
  'chao-pho-phraya-lae-shrine-chaiyaphum': { poi: 2028294, city: 214879 }, // หนองปลาเฒ่า
  'chao-pho-suea-shrine': { poi: 238780, city: 9395 }, // ศาลเจ้าพ่อเสือ
  'chao-pu-ya-shrine-udon-thani': { poi: 149715, city: 10787 }, // ศาลเจ้าปู่-ย่า
  'che-kung-temple-sha-tin': { poi: 39475, city: 16808 }, // วัดชีคุง
  'fushimi-inari-taisha': { poi: 22287, city: 1784 }, // ศาลเจ้าฟูชิมิอินาริ
  'guanyin-shrine-thian-fah': { poi: 246492, city: 9395 }, // ศาลเจ้าแม่กวนอิม (มูลนิธิเทียนฟ้า)
  'kathu-shrine-phuket': { poi: 148013, city: 16056 }, // ศาลเจ้ากะทู้
  'kham-chanot-udon-thani': { poi: 149721, city: 10787 }, // วัดคำชะโนด
  'kian-an-keng-shrine': { poi: 1456123, city: 9395 }, // ศาลเจ้าเกียนอันเกง
  'king-mangrai-monument-chiang-rai': { poi: 24649, city: 4234 }, // อนุสาวรีย์พ่อขุนเม็งรายมหาราช
  'king-taksin-shrine-chanthaburi': { poi: 2002813, city: 19433 }, // ศาลสมเด็จพระเจ้าตากสินมหาราช
  'krom-luang-prachak-monument-udon-thani': { poi: 1868643, city: 10787 }, // อนุสาวรีย์กรมหลวงประจักษ์ศิลปาคม
  'lak-mueang-bangkok': { poi: 277114, city: 9395 }, // ศาลหลักเมืองกรุงเทพมหานคร
  'lak-mueang-chachoengsao': { poi: 257879, city: 127844 }, // ศาลหลักเมือง
  'lak-mueang-chiang-rai': { poi: 249569, city: 4234 }, // เสาสะดือเมืองเชียงราย
  'lak-mueang-khon-kaen': { poi: 131692, city: 16223 }, // ศาลเจ้าพ่อหลักเมือง
  'lak-mueang-krabi': { poi: 147461, city: 14865 }, // ศาลหลักเมืองกระบี่
  'lak-mueang-nan': { poi: 148261, city: 16115 }, // วัดมิ่งเมือง
  'lak-mueang-phrae': { poi: 221752, city: 11743 }, // ศาลหลักเมืองแพร่
  'lak-mueang-rayong': { poi: 131834, city: 217 }, // ศาลหลักเมือง
  'lak-mueang-songkhla': { poi: 257885, city: 17392 }, // ศาลเจ้าพ่อหลักเมืองสงขลา
  'lak-mueang-sukhothai': { poi: 24119, city: 12546 }, // อุทยานประวัติศาสตร์สุโขทัย
  'lak-mueang-surat-thani': { poi: 253685, city: 2570 }, // ศาลหลักเมืองสุราษฎร์ธานี
  'lak-mueang-trat': { poi: 1507704, city: 17798 }, // ศาลหลักเมือง
  'lak-mueang-ubon-ratchathani': { poi: 152645, city: 6771 }, // ศาลหลักเมืองอุบลราชธานี
  'lak-mueang-udon-thani': { poi: 254786, city: 10787 }, // ศาลหลักเมือง (อุดรธานี)
  'lungshan-temple-taipei': { poi: 1514602, city: 4951 }, // Longshan Temple Underground Shopping Bazaar
  'man-mo-temple-hong-kong': { poi: 22853, city: 16808 }, // วัดหม่านโหมว
  'meiji-jingu': { poi: 22592, city: 5085 }, // ศาลเจ้าเมจิ
  'phanthai-norasing-historical-park-shrine': { poi: 139214, city: 214542 }, // ศาลพันท้ายนรสิงห์
  'phanthai-norasing-shrine-khok-kham': { poi: 139214, city: 214542 }, // ศาลพันท้ายนรสิงห์
  'phra-mahathat-kaen-nakhon-khon-kaen': { poi: 254294, city: 7233 }, // วัดหนองแวง
  'phra-that-phu-phek-sakon-nakhon': { poi: 2739479, city: 214330 }, // พระธาตุภูเพ็ก
  'taipei-xia-hai-city-god-temple': { poi: 235661, city: 4951 }, // Taipei Xia-Hai City God Temple
  'thao-suranari-monument-korat': { poi: 212691, city: 702243 }, // อนุสาวรีย์ท้าวสุรนารี
  'tokyo-daijingu': { poi: 153594, city: 5085 }, // Tokyo Daijingu Shrine
  'wat-ban-laem-samut-songkhram': { poi: 253414, city: 214543 }, // วัดเพชรสมุทรวรวิหาร (วัดบ้านแหลม)
  'wat-ban-rai-nakhon-ratchasima': { poi: 255294, city: 702243 }, // วัดบ้านไร่
  'wat-bang-phli-yai-nai': { poi: 34593, city: 9395 }, // วัดบางพลีใหญ่ใน
  'wat-buppharam-trat': { poi: 162428, city: 17798 }, // วัดบุปผาราม (วัดปลายคลอง)
  'wat-chalong-phuket': { poi: 1502560, city: 16056 }, // วัดไชยธาราราม (วัดฉลอง)
  'wat-chong-kham-mae-hong-son': { poi: 26872, city: 15395 }, // วัดจองคำ
  'wat-huai-mongkhon-prachuap-khiri-khan': { poi: 22707, city: 17019 }, // วัดห้วยมงคล
  'wat-huay-pla-kang-chiang-rai': { poi: 239481, city: 4234 }, // วัดห้วยปลากั้ง
  'wat-intharawihan-bangkok': { poi: 227779, city: 9395 }, // วัดอินทรวิหาร
  'wat-khaek-silom': { poi: 23127, city: 9395 }, // วัดพระศรีมหาอุมาเทวี (วัดแขกสีลม)
  'wat-khao-sukim-chanthaburi': { poi: 131944, city: 19433 }, // วัดเขาสุกิม
  'wat-leng-noei-yi-2-nonthaburi': { poi: 2708277, city: 17764 }, // วัดบรมราชากาญจนาภิเษกอนุสรณ์
  'wat-leng-noei-yi-bangkok': { poi: 23126, city: 9395 }, // วัดมังกรกมลาวาส (วัดเล่งเน่ยยี่)
  'wat-lum-mahachai-chumphon-rayong': { poi: 2035713, city: 217 }, // วัดลุ่มมหาชัยชุมพล
  'wat-mahabut-mae-nak': { poi: 242261, city: 9395 }, // วัดมหาบุศย์ (แม่นาคพระโขนง)
  'wat-pa-phu-kon-udon-thani': { poi: 281067, city: 10787 }, // วัดป่าภูก้อน
  'wat-pa-pradu-rayong': { poi: 131859, city: 217 }, // วัดป่าประดู่
  'wat-phanan-choeng-ayutthaya': { poi: 1507068, city: 17704 }, // วัดพนัญเชิงวรวิหาร
  'wat-pho-chai-nong-khai': { poi: 1509144, city: 105626 }, // วัดโพธิ์ชัย
  'wat-phra-kaew-bangkok': { poi: 215636, city: 9395 }, // วัดพระศรีรัตนศาสดาราม (วัดพระแก้ว)
  'wat-phra-pathom-chedi-nakhon-pathom': { poi: 1969142, city: 17022 }, // สวนวัดพระปฐมเจดีย์ราชวรมหาวิหาร
  'wat-phra-phutthachai-saraburi': { poi: 24100, city: 17796 }, // วัดพระพุทธฉาย
  'wat-phra-si-rattana-mahathat-phitsanulok': { poi: 206214, city: 15936 }, // วัดพระศรีรัตนมหาธาตุวรมหาวิหาร (วัดใหญ่)
  'wat-phra-that-chae-haeng-nan': { poi: 1933629, city: 16115 }, // วัดพระธาตุแช่แห้ง
  'wat-phra-that-cho-hae-phrae': { poi: 24703, city: 11743 }, // วัดพระธาตุช่อแฮ
  'wat-phra-that-doi-kham-chiang-mai': { poi: 29076, city: 7401 }, // วัดพระธาตุดอยคำ
  'wat-phra-that-doi-kong-mu-mae-hong-son': { poi: 24679, city: 15395 }, // วัดพระธาตุดอยกองมู
  'wat-phra-that-doi-tung-chiang-rai': { poi: 222711, city: 4234 }, // วัดพระธาตุดอยตุง
  'wat-phra-that-hariphunchai-lamphun': { poi: 206725, city: 21253 }, // วัดพระธาตุหริภุญชัยวรมหาวิหาร
  'wat-phra-that-lampang-luang': { poi: 206768, city: 12384 }, // วัดพระธาตุลำปางหลวง
  'wat-phra-that-narai-cheng-weng-sakon-nakhon': { poi: 151134, city: 214070 }, // วัดพระธาตุนารายณ์เจงเวง
  'wat-phra-that-pha-son-kaeo-phetchabun': { poi: 252825, city: 205026 }, // วัดพระธาตุผาซ่อนแก้ว
  'wat-phra-that-phanom-nakhon-phanom': { poi: 24042, city: 17791 }, // วัดพระธาตุพนมวรมหาวิหาร
  'wat-phra-that-su-thon-mongkhon-khiri-phrae': { poi: 1507711, city: 11743 }, // วัดพระธาตุสุโทนมงคลคีรี
  'wat-phra-yai-ko-samui': { poi: 22176, city: 17198 }, // วัดพระใหญ่
  'wat-phu-tok-bueng-kan': { poi: 2761496, city: 513148 }, // วัดภูทอก
  'wat-phumin-nan': { poi: 127956, city: 16115 }, // วัดภูมินทร์
  'wat-phuttha-nimit-phu-khao-kalasin': { poi: 255422, city: 17788 }, // วัดพุทธนิมิตภูค่าว
  'wat-plai-laem-ko-samui': { poi: 146566, city: 17198 }, // วัดปลายแหลม
  'wat-rai-khing-nakhon-pathom': { poi: 253422, city: 17022 }, // วัดไร่ขิง
  'wat-rong-khun-chiang-rai': { poi: 207693, city: 4234 }, // วัดร่องขุ่น
  'wat-sala-loi-nakhon-ratchasima': { poi: 150353, city: 702243 }, // วัดศาลาลอย
  'wat-suthat-bangkok': { poi: 23129, city: 9395 }, // วัดสุทัศน์
  'wat-suwan-khuha-phang-nga': { poi: 280779, city: 102461 }, // วัดสุวรรณคูหา
  'wat-tantayaphirom-trang': { poi: 2739510, city: 4682 }, // วัดตันตยาภิรม พระอารามหลวง
  'wat-tham-suea-kanchanaburi': { poi: 258121, city: 16223 }, // วัดถ้ำเสือ
  'wat-tham-suea-krabi': { poi: 206234, city: 14865 }, // วัดถ้ำเสือ
  'wat-yai-intharam-chonburi': { poi: 149868, city: 17787 }, // วัดใหญ่อินทาราม พระอารามหลวง
  'wong-tai-sin-temple': { poi: 1513253, city: 16808 }, // Wong Tai Sin Temple Spring Festival Ceremony
};
