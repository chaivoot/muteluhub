import { ImageResponse } from 'next/og';
import { BG, GOLD, MUTED, OG_SIZE, TEXT } from '@/lib/og/color-card';
import { OG_BODY, OG_DISPLAY, ogFonts } from '@/lib/og/fonts';
import { logoBadgeUri } from '@/lib/og/logo';
import { ogThai } from '@/lib/og/thai';
import { GOALS } from '@/lib/goals';

// ภาพแชร์เริ่มต้นของทั้งเว็บ หน้าที่มีภาพของตัวเอง (สถานที่ หมอดู สีเสื้อ) ใช้ของตัวเองแทน
export const runtime = 'nodejs';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'MuteluHub รวมทุกเรื่องสายมู';

export default async function OgImage() {
  const [fonts, logo] = await Promise.all([ogFonts(), logoBadgeUri()]);
  return new ImageResponse(
    ogThai(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 22,
          background: BG,
          color: TEXT,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img src={logo} width={150} height={150} alt="" />
          <div style={{ display: 'flex', fontFamily: OG_DISPLAY, fontWeight: 600, fontSize: 96 }}>MuteluHub</div>
        </div>
        <div
          style={{ display: 'flex', fontFamily: OG_BODY, fontWeight: 500, fontSize: 52, color: GOLD, lineHeight: 1.5 }}
        >
          รวมทุกเรื่องสายมู ในที่เดียว
        </div>
        <div style={{ display: 'flex', fontFamily: OG_BODY, fontWeight: 500, fontSize: 30, color: MUTED }}>
          สีเสื้อมงคล · เลขมงคล · หมอดู · สถานที่เสริมดวง · ปฏิทินฤกษ์
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 14,
            marginTop: 18,
            maxWidth: 1000,
          }}
        >
          {GOALS.map((g) => (
            <div
              key={g.slug}
              style={{
                display: 'flex',
                fontFamily: OG_BODY,
                fontWeight: 500,
                fontSize: 28,
                padding: '6px 22px',
                borderRadius: 999,
                border: `2px solid ${GOLD}`,
                color: TEXT,
              }}
            >
              {g.short}
            </div>
          ))}
        </div>
      </div>,
    ),
    { ...size, fonts },
  );
}
