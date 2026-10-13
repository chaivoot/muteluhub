/** ขนาดตัวอักษรทั้งเว็บ: เก็บใน localStorage แล้วตั้ง html[data-text-size] (CSS คูณด้วย --fs) */
// ค่าเริ่มต้น = ขนาดกลาง (l) เจ้าของขอ 2026-10-13 เปลี่ยน key ใหม่ให้ทุกคนเริ่มที่ขนาดกลาง (key เดิม mh_text_size เก็บ m ไว้)
export const TEXT_SIZE_KEY = 'mh_fs';
export const DEFAULT_TEXT_SIZE = 'l';

/** ตั้งขนาดก่อนวาดหน้า (ใส่ใน <head>) กันตัวอักษรกระโดด */
export const TEXT_SIZE_SCRIPT = `try{var s=localStorage.getItem('${TEXT_SIZE_KEY}');if(s==='m'||s==='xl')document.documentElement.dataset.textSize=s}catch(e){}`;
