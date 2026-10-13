/**
 * สถานที่ยอดนิยม / กำลังเป็นกระแส สำหรับเรียงในหน้าแรกและหน้าเป้าหมาย (เรียงจากนิยมมากไปน้อย)
 * คัดจากสถานที่สายมูที่คนรู้จักและพูดถึงบ่อย ปรับรายการได้ที่นี่ หรือปักหมุด "หน้าแรก" จาก /admin (มาก่อนรายการนี้)
 * สถานที่ที่ไม่มีภาพไม่ขึ้นหน้าแรกเลย ไม่ว่าจะอยู่ในรายการนี้หรือไม่
 */
export const POPULAR_PLACE_SLUGS: string[] = [
  'erawan-shrine',
  'trimurti-shrine-centralworld',
  'ganesha-shrine-huai-khwang',
  'wat-khaek-silom',
  'kham-chanot-udon-thani',
  'wat-chedi-ai-khai',
  'lak-mueang-bangkok',
  'chao-pho-suea-shrine',
  'wat-saman-rattanaram-chachoengsao',
  'wat-sothon',
  'wat-leng-noei-yi-bangkok',
  'wat-mahabut-mae-nak',
  'lakshmi-shrine-gaysorn',
  'wat-rakhang',
  'guan-yu-shrine-khlong-san',
  'wat-suthat-bangkok',
  'wat-saket-golden-mount',
  'wat-phra-kaew-bangkok',
  'wat-rai-khing-nakhon-pathom',
  'wat-phanan-choeng-ayutthaya',
  'wat-bang-phli-yai-nai',
  'wat-ban-rai-nakhon-ratchasima',
  'wat-phra-that-doi-suthep',
  'wat-phra-that-phanom-nakhon-phanom',
  'wat-pho-chai-nong-khai',
  'wat-chalong-phuket',
  'wat-rong-khun-chiang-rai',
  'wat-leng-noei-yi-2-nonthaburi',
  'uma-devi-shrine-ratchaprasong',
  'ganesha-shrine-centralworld',
  'thao-suranari-monument-korat',
  'wat-phra-mahathat-nakhon-si-thammarat',
];

/** ค่าปักหมุดสถานที่ให้ขึ้นหน้าแรก (คอลัมน์ pinned_in) */
export const PIN_HOME = 'home';
