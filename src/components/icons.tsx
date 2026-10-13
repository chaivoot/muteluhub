import type { ReactNode } from 'react';
import type { GoalSlug } from '@/lib/goals';

// path จาก design/icons/**/*.svg (viewBox 24, stroke = currentColor)
const GOAL_PATHS: Record<GoalSlug, ReactNode> = {
  love: <path fill="currentColor" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  career: <path d="M4 8h16v11H4z M9 8V5.5h6V8 M4 13h16" />,
  // สัญลักษณ์บาท ฿
  money: <path d="M8 5.5h4.8a3.1 3.1 0 0 1 0 6.2H8z M8 11.7h5.6a3.4 3.4 0 0 1 0 6.8H8z M11 3v2.5 M11 18.5V21" />,
  business: <path d="M4 10h16 M5.5 10L7 5h10l1.5 5 M6 10v9h12v-9 M10 19v-5h4v5" />,
  // คนแข็งแรงเกร็งกล้ามแขน
  health: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M8 21l1.5-7h5L16 21 M9.5 14L9 9.5h6l-.5 4.5 M9 9.5c-2 0-3.5-1-3.5-3.5 0-1 .8-1.8 1.8-1.8 M15 9.5c2 0 3.5-1 3.5-3.5 0-1-.8-1.8-1.8-1.8" />
    </>
  ),
  study: <path d="M4 5h5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4z M20 5h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h6z" />,
  family: <path d="M4 11l8-6 8 6 M6 9.5V19h12V9.5 M10 19v-4h4v4" />,
  // พระเครื่องห้อยคอ (แคล้วคลาด)
  protection: (
    <>
      <path d="M9.5 4.5a2.5 2.5 0 0 1 5 0 M6.5 21V12a5.5 5.5 0 0 1 11 0v9z M9.5 21v-5a2.5 2.5 0 0 1 5 0v5" />
      <circle cx="12" cy="11" r="1.4" />
    </>
  ),
};

const UI_PATHS = {
  abroad: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18" />
    </>
  ),
  calendar: <path d="M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5" />,
  filter: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  'fortune-tellers': <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7z" />,
  places: <path d="M3 20h18 M5 20v-7h14v7 M12 3l-8 7h16z M9 20v-4h6v4" />,
  share: <path d="M12 15V4M7 9l5-5 5 5M5 14v6h14v-6" />,
  shirt: <path d="M8 4L3 7l2 4 3-1v10h8V10l3 1 2-4-5-3c-.5 1.5-2 2.5-4 2.5S8.5 5.5 8 4z" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  back: <path d="M15 6l-6 6 6 6" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  bed: <path d="M3 18V6 M3 14h18v4 M21 14v-2a3 3 0 0 0-3-3h-7v5 M7 12.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z" />,
  locate: <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
} satisfies Record<string, ReactNode>;

export type UiIconName = keyof typeof UI_PATHS;

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function Svg({ size = 24, strokeWidth = 1.8, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function GoalIcon({ slug, ...props }: IconProps & { slug: GoalSlug }) {
  return <Svg {...props}>{GOAL_PATHS[slug]}</Svg>;
}

export function UiIcon({ name, ...props }: IconProps & { name: UiIconName }) {
  return <Svg {...props}>{UI_PATHS[name]}</Svg>;
}

/** เสื้อทึบ ใช้ในวงกลมสีเสื้อ */
export function ShirtSolid({ size = 32, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      {UI_PATHS.shirt}
    </svg>
  );
}

/** โลโก้แบบย่อ: เหรียญทอง M จากโลโก้ของเจ้าของ (ต้นฉบับ design/logo/logo-original.jpg) */
export function LogoMark({ size = 36 }: { size?: number }) {
  return <img src="/logo-mark-96.webp" width={size} height={size} alt="" className="logo-mark" />;
}
