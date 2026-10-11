import { ImageResponse } from 'next/og';
import { isGoalSlug } from '@/lib/goals';
import { CARD_DIMENSIONS, ColorCard, type CardSize } from '@/lib/og/color-card';
import { ogFonts } from '@/lib/og/fonts';
import { logoMarkSvg } from '@/lib/og/logo';
import { bangkokDay } from '@/lib/thai-date';

/**
 * การ์ดสีเสื้อวันนี้สำหรับบันทึก/แชร์: /color-today/card?goal=money&size=portrait|story
 * สร้างตามวันของเวลาไทย cache สั้น ๆ ที่ CDN
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const goal = params.get('goal');
  const size = (params.get('size') === 'story' ? 'story' : 'portrait') as CardSize;
  if (!isGoalSlug(goal)) return new Response('Unknown goal', { status: 400 });
  const day = bangkokDay();
  const [fonts, logoSvg] = await Promise.all([ogFonts(), logoMarkSvg()]);
  const res = new ImageResponse(<ColorCard day={day} goal={goal} size={size} logoSvg={logoSvg} />, {
    ...CARD_DIMENSIONS[size],
    fonts,
  });
  res.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.headers.set('Content-Disposition', `inline; filename="muteluhub-${day.iso}-${goal}-${size}.png"`);
  return res;
}
