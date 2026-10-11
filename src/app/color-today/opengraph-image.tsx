import { ImageResponse } from 'next/og';
import { ColorOgImage, OG_SIZE } from '@/lib/og/color-card';
import { ogFonts } from '@/lib/og/fonts';
import { logoMarkSvg } from '@/lib/og/logo';

// ภาพแชร์ของหน้า /color-today ไม่ผูกกับวัน (ภาพ metadata ถูก cache แบบ immutable)
export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'สีเสื้อมงคลวันนี้ ตามหลักทักษา';

export default async function OgImage() {
  const [fonts, logoSvg] = await Promise.all([ogFonts(), logoMarkSvg()]);
  return new ImageResponse(<ColorOgImage logoSvg={logoSvg} />, { ...size, fonts });
}
