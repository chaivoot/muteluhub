import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * โลโก้สำหรับภาพแชร์ (data URI ให้ Satori)
 * mark = เหรียญทอง M (ใช้ขนาดเล็ก), badge = โลโก้เต็ม MUTELU HUB (ใช้ขนาดใหญ่)
 * ต้นฉบับจากเจ้าของ: design/logo/logo-original.jpg
 */
const cache = new Map<string, Promise<string>>();

function pngUri(file: string): Promise<string> {
  let p = cache.get(file);
  if (!p) {
    p = readFile(join(process.cwd(), 'public', file)).then((b) => `data:image/png;base64,${b.toString('base64')}`);
    cache.set(file, p);
  }
  return p;
}

export const logoMarkUri = () => pngUri('logo-mark.png');
export const logoBadgeUri = () => pngUri('logo-badge.png');
