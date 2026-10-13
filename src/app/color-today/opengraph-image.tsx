import { ImageResponse } from 'next/og';
import { ColorOgImage, OG_SIZE } from '@/lib/og/color-card';
import { ogFonts } from '@/lib/og/fonts';
import { logoMarkUri } from '@/lib/og/logo';
import { ogThai } from '@/lib/og/thai';

// ภาพแชร์ของหน้า /color-today ไม่ผูกกับวัน (ภาพ metadata ถูก cache แบบ immutable)
export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'สีเสื้อมงคลวันนี้ ตามหลักทักษา';

export default async function OgImage() {
  const [fonts, logoSrc] = await Promise.all([ogFonts(), logoMarkUri()]);
  return new ImageResponse(ogThai(<ColorOgImage logoSrc={logoSrc} />), { ...size, fonts });
}
