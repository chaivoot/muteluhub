import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** ฟอนต์สำหรับ OG image (TTF แปลงจากไฟล์ self-host ใน public/fonts) */
const DIR = join(process.cwd(), 'src/assets/og');

let cache: Promise<{ name: string; data: Buffer; weight: 500 | 600; style: 'normal' }[]> | undefined;

export function ogFonts() {
  cache ??= Promise.all(
    [
      ['Trirong', 'trirong-thai-600.ttf', 600],
      ['Trirong', 'trirong-latin-600.ttf', 600],
      ['Noto Sans Thai', 'noto-sans-thai-thai-500.ttf', 500],
      ['Noto Sans Thai', 'noto-sans-thai-latin-500.ttf', 500],
    ].map(async ([name, file, weight]) => ({
      name: name as string,
      data: await readFile(join(DIR, file as string)),
      weight: weight as 500 | 600,
      style: 'normal' as const,
    })),
  );
  return cache;
}
