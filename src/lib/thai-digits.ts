const THAI_DIGITS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

/** 24 -> "๒๔" */
export const toThaiDigits = (n: number | string) => String(n).replace(/\d/g, (d) => THAI_DIGITS[Number(d)]);
