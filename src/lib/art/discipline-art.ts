/**
 * ภาพ default หมอดูตามศาสตร์ (ชุดเดียวกันทั้งเว็บ): เส้นทองบนคราม วงแหวนบาง ดาวเล็ก
 * ศาสตร์ละ 3 แบบ (variant) เลือกแบบคงที่จาก hash ของ slug หมอดู (spec ข้อ 3.1)
 * เป็นภาพชั่วคราวจนกว่าจะมีภาพวาดชุดจริงความละเอียดสูง (ดู CLAUDE.md)
 */
import { DISCIPLINES } from '@/lib/disciplines';

export const ART_VARIANTS = 3;

const GOLD = '#D6B064';
const GOLD_SOFT = '#E6C165';

// สัญลักษณ์กลางภาพในพื้นที่ 100x100 (ศูนย์กลาง 50,50 ขนาดราว 44)
const EMBLEMS: Record<string, string> = {
  // ผังดวงไทย: สี่เหลี่ยมและเส้นทแยง
  'thai-astrology': '<rect x="30" y="30" width="40" height="40"/><path d="M30 30L70 70M70 30L30 70M50 30V70M30 50H70"/><circle cx="50" cy="50" r="5"/>',
  // เลข 7 ตัว 9 ฐาน: ตาราง 3x3
  'lek-7-tua': '<rect x="31" y="31" width="38" height="38"/><path d="M43.7 31V69M56.3 31V69M31 43.7H69M31 56.3H69"/><circle cx="37.3" cy="37.3" r="1.6"/><circle cx="50" cy="50" r="1.6"/><circle cx="62.7" cy="62.7" r="1.6"/>',
  // ตะวันตก: วงล้อจักรราศี 12 ช่อง
  'western-astrology': '<circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="14"/>' + spokes(12, 14, 22) + '<circle cx="50" cy="50" r="3"/>',
  // ภารตะ: ผังเหนือ (สี่เหลี่ยม เส้นทแยง ข้าวหลามตัด)
  vedic: '<rect x="30" y="30" width="40" height="40"/><path d="M30 30L70 70M70 30L30 70M50 30L70 50L50 70L30 50Z"/>',
  // ปาจื้อ: สี่เสา
  bazi: '<path d="M30 32H70M30 68H70"/><rect x="33" y="36" width="6" height="28" rx="1"/><rect x="43" y="36" width="6" height="28" rx="1"/><rect x="53" y="36" width="6" height="28" rx="1"/><rect x="63" y="36" width="4" height="28" rx="1" transform="translate(-1 0)"/>',
  // Human Design: ร่างผังศูนย์พลัง
  'human-design': '<path d="M50 27L55 34H45Z"/><path d="M45 38H55V44H45Z"/><path d="M50 47L56 53L50 59L44 53Z"/><path d="M44 62H56V70H44Z"/><path d="M50 34V38M50 44V47M50 59V62"/>',
  // ไพ่ทาโรต์: ไพ่สามใบ
  tarot: '<rect x="25" y="34" width="18" height="30" rx="2" transform="rotate(-14 34 49)"/><rect x="41" y="30" width="18" height="30" rx="2"/><rect x="57" y="34" width="18" height="30" rx="2" transform="rotate(14 66 49)"/><circle cx="50" cy="42" r="3.5"/><path d="M50 49V54M47 51.5H53"/>',
  // ไพ่ยิปซี: ไพ่สองใบมีตาราง
  lenormand: '<rect x="33" y="30" width="22" height="34" rx="2" transform="rotate(-8 44 47)"/><rect x="45" y="34" width="22" height="34" rx="2"/><path d="M50 42H62M50 48H62M50 54H62M56 40V62"/>',
  // ไพ่ออราเคิล: ไพ่ใบเดียวมีดาว
  oracle: '<rect x="37" y="27" width="26" height="42" rx="3"/><path d="M50 37L52.5 45.5L61 48L52.5 50.5L50 59L47.5 50.5L39 48L47.5 45.5Z"/>',
  // เซียมซี: กระบอกและไม้
  'siam-si': '<path d="M38 46H62L59 72H41Z"/><path d="M42 46L40 28M47 46L46 25M52 46L53 26M57 46L60 29"/><path d="M53 26L52 33"/>',
  // ลายมือ: ฝ่ามือ
  palmistry: '<path d="M38 72V48C38 45 42 45 42 48V58M42 52V34C42 31 46 31 46 34V54M46 50V30C46 27 50 27 50 30V54M50 50V33C50 30 54 30 54 33V56M54 54V40C54 37 58 37 58 40V60C58 68 54 72 48 72Z"/><path d="M43 64C47 60 51 61 54 64"/>',
  // โหงวเฮ้ง: หน้าด้านข้าง
  'face-reading': '<path d="M56 26C44 26 38 34 38 44C38 48 36 50 34 53L38 55L37 60C37 63 40 64 43 63L44 68C44 71 47 73 52 72L56 72V78"/><path d="M56 26C64 28 68 34 68 44C68 52 64 58 60 62V78"/><circle cx="45" cy="42" r="1.3"/>',
  // เลขศาสตร์: ตรีโกณ 10 จุด (tetractys)
  numerology: [
    [50, 31],
    [45, 40], [55, 40],
    [40, 49], [50, 49], [60, 49],
    [35, 58], [45, 58], [55, 58], [65, 58],
  ].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6"/>`).join('') + '<path d="M50 24L72 64H28Z"/>',
  // เบอร์มงคล: โทรศัพท์และตัวเลข
  'lucky-numbers': '<rect x="38" y="26" width="24" height="46" rx="4"/><path d="M46 30H54"/>' +
    [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => `<circle cx="${44 + c * 6}" cy="${44 + r * 7}" r="1.6"/>`)).join(''),
  // ตั้งชื่อ: พู่กันและม้วนกระดาษ
  naming: '<path d="M30 40H64C67 40 67 46 64 46H30C27 46 27 40 30 40Z"/><path d="M33 46V66H61V46"/><path d="M38 53H56M38 59H50"/><path d="M68 28L58 50"/><path d="M58 50L56 55L60 52Z"/>',
  // ฮวงจุ้ย: หล่อแก
  'feng-shui': '<circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="15"/><circle cx="50" cy="50" r="8"/>' + spokes(8, 15, 22) + '<path d="M50 43L52 50L50 57L48 50Z"/>',
  // หาฤกษ์: ปฏิทินและดาว
  'auspicious-timing': '<rect x="30" y="32" width="40" height="36" rx="3"/><path d="M30 41H70M40 27V36M60 27V36"/><path d="M50 46L52 52L58 54L52 56L50 62L48 56L42 54L48 52Z"/>',
  // ร่างทรง: เทียนและเปลวไฟ
  medium: '<path d="M50 30C55 36 55 42 50 46C45 42 45 36 50 30Z"/><path d="M50 46V50"/><rect x="44" y="50" width="12" height="20" rx="1"/><path d="M38 72H62"/>',
  // นั่งทางใน: ตาที่สาม
  intuitive: '<path d="M28 50C36 39 64 39 72 50C64 61 36 61 28 50Z"/><circle cx="50" cy="50" r="7"/><circle cx="50" cy="50" r="2.4"/><path d="M50 30V35M38 33L40.5 37.5M62 33L59.5 37.5"/>',
};

// พระจันทร์เสี้ยว ใช้เมื่อไม่มีสัญลักษณ์เฉพาะ
const FALLBACK = '<path d="M57 30A20 20 0 1 0 57 70A16 16 0 1 1 57 30Z"/>';

function spokes(n: number, r1: number, r2: number): string {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    d += `M${(50 + r1 * c).toFixed(2)} ${(50 + r1 * s).toFixed(2)}L${(50 + r2 * c).toFixed(2)} ${(50 + r2 * s).toFixed(2)}`;
  }
  return `<path d="${d}"/>`;
}

function star(x: number, y: number, r: number): string {
  const k = r * 0.28;
  return `<path d="M${x} ${y - r}L${x + k} ${y - k}L${x + r} ${y}L${x + k} ${y + k}L${x} ${y + r}L${x - k} ${y + k}L${x - r} ${y}L${x - k} ${y - k}Z" fill="${GOLD_SOFT}" stroke="none"/>`;
}

const BACKGROUNDS = [
  ['#24315A', '#141C33'],
  ['#2C2A55', '#151A33'],
  ['#1F3A55', '#121B30'],
];

function decoration(variant: number): string {
  if (variant === 1) {
    return (
      `<path d="M14 50A36 36 0 0 1 86 50" stroke-opacity="0.5"/><path d="M20 58A30 30 0 0 0 80 58" stroke-opacity="0.35"/>` +
      star(18, 22, 3.2) + star(26, 30, 1.6) + star(80, 80, 2.2)
    );
  }
  if (variant === 2) {
    let dots = '';
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      dots += `<circle cx="${(50 + 40 * Math.cos(a)).toFixed(2)}" cy="${(50 + 40 * Math.sin(a)).toFixed(2)}" r="0.7" fill="${GOLD}" stroke="none" opacity="0.6"/>`;
    }
    return dots + `<circle cx="50" cy="50" r="33" stroke-opacity="0.4"/>` + star(80, 18, 2.8) + star(20, 82, 1.8);
  }
  return (
    `<circle cx="50" cy="50" r="40" stroke-opacity="0.35"/><circle cx="50" cy="50" r="34" stroke-opacity="0.55"/>` +
    star(80, 20, 3) + star(72, 14, 1.4) + star(20, 78, 2)
  );
}

/** SVG ของภาพ default (สี่เหลี่ยมจัตุรัส) */
export function disciplineArtSvg(discipline: string, variant: number): string {
  const v = ((variant % ART_VARIANTS) + ART_VARIANTS) % ART_VARIANTS;
  const [c1, c2] = BACKGROUNDS[v];
  const emblem = EMBLEMS[discipline] ?? FALLBACK;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">
<defs><radialGradient id="bg" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>
<rect width="100" height="100" fill="url(#bg)"/>
<g fill="none" stroke="${GOLD}" stroke-width="0.6">${decoration(v)}</g>
<g fill="none" stroke="${GOLD}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${emblem}</g>
</svg>`;
}

/** hash คงที่ (FNV-1a) ภาพเดิมทุกครั้งสำหรับหมอดูคนเดิม */
export function artVariantFor(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) % ART_VARIANTS;
}

export const artPath = (discipline: string, variant: number) => `/art/${discipline}-${variant}.svg`;

/** ภาพของหมอดู: ตามศาสตร์หลัก (ตัวแรก) + variant จาก slug */
export function tellerArtPath(teller: { slug: string; disciplines: string[] }): string {
  return artPath(teller.disciplines[0] ?? 'oracle', artVariantFor(teller.slug));
}

export const ALL_ART_FILES = DISCIPLINES.flatMap((d) =>
  Array.from({ length: ART_VARIANTS }, (_, v) => ({ file: `${d.slug}-${v}.svg`, discipline: d.slug, variant: v })),
);
