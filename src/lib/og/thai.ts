import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

/**
 * Satori (next/og) ไม่จัดตำแหน่งวรรณยุกต์ตาม OpenType วรรณยุกต์เหนือสระบนจึงทับสระ (ที่ เรื่อง)
 * สลับเป็นวรรณยุกต์ยกสูงที่ U+F70A-U+F70E ซึ่งเพิ่มไว้ในฟอนต์ src/assets/og (scripts/og-thai-marks.py)
 */
const RAISE_AFTER_UPPER_VOWEL = /([ัิ-ื็ํ])([่-์])/g;
// น้ำ: วรรณยุกต์มาก่อนสระอำ ซึ่งมีนิคหิตอยู่ด้านบน
const RAISE_BEFORE_SARA_AM = /([่-์])(?=ำ)/g;

const raised = (tone: string) => String.fromCharCode(0xf70a + tone.charCodeAt(0) - 0x0e48);

export function shapeThai(text: string): string {
  return text
    .replace(RAISE_AFTER_UPPER_VOWEL, (_, vowel: string, tone: string) => vowel + raised(tone))
    .replace(RAISE_BEFORE_SARA_AM, (tone: string) => raised(tone));
}

/** แปลงข้อความทุกจุดใน element tree ก่อนส่งให้ ImageResponse (component แบบฟังก์ชันธรรมดาจะถูกเรียกเพื่อกาง tree) */
export function shapeThaiTree(node: ReactNode): ReactNode {
  if (typeof node === 'string') return shapeThai(node);
  if (Array.isArray(node)) return node.map(shapeThaiTree);
  if (!isValidElement(node)) return node;
  const el = node as ReactElement<{ children?: ReactNode }>;
  if (typeof el.type === 'function') {
    return shapeThaiTree((el.type as (p: unknown) => ReactNode)(el.props));
  }
  if (el.props.children === undefined) return el;
  return cloneElement(el, undefined, shapeThaiTree(el.props.children));
}

/** สำหรับส่งเข้า ImageResponse โดยตรง */
export const ogThai = (element: ReactElement): ReactElement => shapeThaiTree(element) as ReactElement;
