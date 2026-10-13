/** ขนาดตัวอักษรทั้งเว็บ: เก็บใน localStorage แล้วตั้ง html[data-text-size] (CSS คูณด้วย --fs) */
export const TEXT_SIZE_KEY = 'mh_text_size';

/** ตั้งขนาดก่อนวาดหน้า (ใส่ใน <head>) กันตัวอักษรกระโดด */
export const TEXT_SIZE_SCRIPT = `try{var s=localStorage.getItem('${TEXT_SIZE_KEY}');if(s==='l'||s==='xl')document.documentElement.dataset.textSize=s}catch(e){}`;
