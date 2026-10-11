import { ImageResponse } from 'next/og';
import { CHANNEL_LABEL } from '@/data/fortune-tellers';
import { provinceShortName } from '@/data/provinces';
import { artVariantFor, disciplineArtSvg } from '@/lib/art/discipline-art';
import { getDiscipline } from '@/lib/disciplines';
import { OG_BODY, OG_DISPLAY, ogFonts } from '@/lib/og/fonts';
import { ogThai } from '@/lib/og/thai';
import { listPublishedTellers } from '@/lib/tellers-repo';

// OG image อัตโนมัติ: ภาพ default ตามศาสตร์ + ชื่อหมอดู + ศาสตร์ (spec ข้อ 3.1)
export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'MuteluHub หมอดู';

const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tellers = await listPublishedTellers();
  const teller = tellers.find((t) => t.slug === slug);
  const disciplineSlug = teller ? teller.disciplines[0] : slug;
  const discipline = getDiscipline(disciplineSlug);
  const art = disciplineArtSvg(disciplineSlug, teller ? artVariantFor(teller.slug) : 0);

  const title = teller ? teller.name : `หมอดู${discipline?.name ?? ''}`;
  const tags = teller
    ? teller.disciplines.map((d) => getDiscipline(d)?.name ?? d)
    : discipline
      ? [discipline.groupName]
      : [];
  const meta = teller
    ? [
        ...teller.channels.map((c) => CHANNEL_LABEL[c]),
        teller.provinceSlug ? provinceShortName(teller.provinceSlug) : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : 'รวมหมอดูตามศาสตร์และเรื่องที่ถนัด';

  return new ImageResponse(
    ogThai(
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#172038', color: '#F3ECDD' }}>
        <img src={svgDataUri(art)} width={630} height={630} alt="" />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 56px',
            gap: 22,
            borderLeft: '3px solid #D6B064',
          }}
        >
          <div style={{ fontFamily: OG_BODY, fontSize: 28, color: '#D6B064' }}>MuteluHub · หมอดู</div>
          <div style={{ fontFamily: OG_DISPLAY, fontSize: title.length > 18 ? 52 : 64, lineHeight: 1.45 }}>{title}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {tags.slice(0, 3).map((t) => (
              <div
                key={t}
                style={{
                  fontFamily: OG_BODY,
                  fontSize: 28,
                  background: '#D6B064',
                  color: '#172038',
                  padding: '2px 20px',
                  borderRadius: 999,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: OG_BODY, fontSize: 28, color: '#B9B2A3' }}>{meta}</div>
        </div>
      </div>,
    ),
    { ...size, fonts: await ogFonts() },
  );
}
