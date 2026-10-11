import { OG_BODY, OG_DISPLAY } from '@/lib/og/fonts';
import { PLANET_COLOR, TAKSA_ORDER } from '@/data/daily-colors';
import { colorShort, getShirtColor } from '@/lib/daily-colors';
import { GOALS, getGoal, type GoalSlug } from '@/lib/goals';
import { formatThaiFullDate, type ThaiDay } from '@/lib/thai-date';

/**
 * การ์ดสีเสื้อสำหรับแชร์ (Satori / next/og)
 * portrait 1080x1350, story 1080x1920
 */
export type CardSize = 'portrait' | 'story';

export const CARD_DIMENSIONS: Record<CardSize, { width: number; height: number }> = {
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};

const SHIRT = 'M8 4L3 7l2 4 3-1v10h8V10l3 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 5.5 8 4z';
const shirtUri = (fill: string) =>
  `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill}"><path d="${SHIRT}"/></svg>`,
  ).toString('base64')}`;

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

const BG = '#172038';
const GOLD = '#D6B064';
const TEXT = '#F3ECDD';
const MUTED = '#B9B2A3';

function GoalGrid({ day, scale, exclude }: { day: ThaiDay; scale: number; exclude?: GoalSlug }) {
  const goals = GOALS.filter((g) => g.slug !== exclude);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 * scale, justifyContent: 'center', width: '100%' }}>
      {goals.map((g) => {
        const c = getShirtColor(day.weekday, g.slug).lucky.color;
        return (
          <div
            key={g.slug}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14 * scale,
              width: 440 * scale,
              padding: `${12 * scale}px ${18 * scale}px`,
              borderRadius: 24 * scale,
              background: '#1F2A47',
            }}
          >
            <div style={{ width: 48 * scale, height: 48 * scale, borderRadius: 999, background: c.hex, display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: OG_BODY, fontSize: 26 * scale, color: MUTED }}>{g.short}</div>
              <div style={{ fontFamily: OG_DISPLAY, fontSize: 34 * scale, color: TEXT }}>{c.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ColorCard({
  day,
  goal,
  size,
  logoSvg,
}: {
  day: ThaiDay;
  goal: GoalSlug;
  size: CardSize;
  logoSvg: string;
}) {
  const { lucky, avoid } = getShirtColor(day.weekday, goal);
  const g = getGoal(goal);
  const date = formatThaiFullDate(day);

  const story = size === 'story';
  const s = 1;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: BG,
        color: TEXT,
        padding: story ? '120px 64px 96px' : '72px 64px 56px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ fontFamily: OG_BODY, fontSize: 34, color: GOLD }}>{date}</div>
        <div style={{ fontFamily: OG_DISPLAY, fontSize: 64 }}>สีเสื้อมงคลวันนี้</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            width: story ? 420 : 340,
            height: story ? 420 : 340,
            borderRadius: 999,
            background: lucky.color.hex,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 0 16px ${BG}, 0 0 0 20px ${GOLD}`,
          }}
        >
          <img src={shirtUri(lucky.color.ink)} width={story ? 230 : 190} height={story ? 230 : 190} alt="" />
        </div>
        <div style={{ display: 'flex', fontFamily: OG_BODY, fontSize: 36, color: GOLD, marginTop: 24 }}>
          {`${g.name} · ตำแหน่ง${lucky.role}`}
        </div>
        <div style={{ fontFamily: OG_DISPLAY, fontSize: story ? 120 : 104, lineHeight: 1.35 }}>{lucky.color.name}</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontFamily: OG_BODY,
            fontSize: 34,
            color: MUTED,
            padding: '10px 28px',
            borderRadius: 999,
            border: '2px solid #4A5788',
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 999, background: avoid.color.hex, display: 'flex' }} />
          <div style={{ display: 'flex' }}>{`สีที่ควรเลี่ยง ${colorShort(avoid.color)}`}</div>
        </div>
      </div>

      {story ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, width: '100%' }}>
          <div style={{ fontFamily: OG_BODY, fontSize: 30, color: MUTED }}>เรื่องอื่นวันนี้</div>
          <GoalGrid day={day} scale={s} exclude={goal} />
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src={svgUri(logoSvg)} width={56} height={56} alt="" />
        <div style={{ fontFamily: OG_DISPLAY, fontSize: 40 }}>MuteluHub</div>
        <div style={{ fontFamily: OG_BODY, fontSize: 30, color: MUTED }}>muteluhub.com</div>
      </div>
    </div>
  );
}


/**
 * ภาพแชร์ของหน้า /color-today (1200x630) ไม่ผูกกับวัน
 * Next ตั้ง cache แบบ immutable ให้ภาพ metadata ถ้าใส่สีของวันจะค้างบนโซเชียล
 */
export const OG_SIZE = { width: 1200, height: 630 };

export function ColorOgImage({ logoSvg }: { logoSvg: string }) {
  const colors = TAKSA_ORDER.map((p) => PLANET_COLOR[p]);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 28, background: BG, color: TEXT }}>
      <div style={{ display: 'flex', gap: 22 }}>
        {colors.map((c) => (
          <div key={c.hex} style={{ width: 92, height: 92, borderRadius: 999, background: c.hex, display: 'flex', boxShadow: `0 0 0 6px ${BG}, 0 0 0 8px ${GOLD}` }} />
        ))}
      </div>
      <div style={{ display: 'flex', fontFamily: OG_DISPLAY, fontWeight: 600, fontSize: 92, lineHeight: 1.4, marginTop: 20 }}>สีเสื้อมงคลวันนี้</div>
      <div style={{ display: 'flex', fontFamily: OG_BODY, fontWeight: 500, fontSize: 34, color: MUTED }}>ตามหลักทักษา เลือกได้ตามเรื่องที่อยากเสริม พร้อมสีที่ควรเลี่ยง</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
        <img src={svgUri(logoSvg)} width={52} height={52} alt="" />
        <div style={{ display: 'flex', fontFamily: OG_DISPLAY, fontWeight: 600, fontSize: 36 }}>MuteluHub</div>
      </div>
    </div>
  );
}
