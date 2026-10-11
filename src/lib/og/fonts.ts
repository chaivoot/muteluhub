import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * ฟอนต์สำหรับ OG image: TTF ที่รวมชุดไทย + ละตินไว้ในไฟล์เดียว (แปลงจากไฟล์ self-host ใน public/fonts)
 * Satori ไม่ fallback ข้ามฟอนต์ชื่อซ้ำได้ดี จึงรวมเป็นไฟล์เดียวต่อฟอนต์
 */
export const OG_DISPLAY = 'Trirong';
export const OG_BODY = 'Noto Sans Thai';

const DIR = join(process.cwd(), 'src/assets/og');

let cache: Promise<{ name: string; data: Buffer; weight: 500 | 600; style: 'normal' }[]> | undefined;

export function ogFonts() {
  cache ??= Promise.all(
    [
      [OG_DISPLAY, 'trirong-600.ttf', 600],
      [OG_BODY, 'noto-sans-thai-500.ttf', 500],
    ].map(async ([name, file, weight]) => ({
      name: name as string,
      data: await readFile(join(DIR, file as string)),
      weight: weight as 500 | 600,
      style: 'normal' as const,
    })),
  );
  return cache;
}
