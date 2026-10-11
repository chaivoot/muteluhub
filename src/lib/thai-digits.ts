const THAI_DIGITS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

/** เลขไทย ใช้เฉพาะเนื้อหาโหราศาสตร์ไทย เช่น วันจันทรคติ (ดูกติกาตัวเลขใน CLAUDE.md) */
export const toThaiDigits = (n: number | string) => String(n).replace(/\d/g, (d) => THAI_DIGITS[Number(d)]);
