import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

let cache: Promise<string> | undefined;

/** โลโก้แบบย่อ (SVG) สำหรับภาพแชร์ ใช้สีจริงแทน CSS variable */
export function logoMarkSvg(): Promise<string> {
  cache ??= readFile(join(process.cwd(), 'public/logo-mark.svg'), 'utf8');
  return cache;
}
