export const SITE_NAME = 'MuteluHub';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://muteluhub.com';
export const SITE_DESCRIPTION =
  'รวมทุกเรื่องสายมูในที่เดียว เริ่มจากเรื่องที่อยากเสริม สีเสื้อมงคลวันนี้ เลขมงคล หมอดู สถานที่เสริมดวง และเทศกาล';

export interface NavItem {
  href: string;
  label: string;
  icon: 'fortune-tellers' | 'places' | 'abroad' | 'calendar' | 'shirt' | 'sparkle';
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/color-today', label: 'สีเสื้อมงคลวันนี้', icon: 'shirt' },
  { href: '/fortune-tellers', label: 'หมอดู', icon: 'fortune-tellers' },
  { href: '/places', label: 'สถานที่เสริมดวงในไทย', icon: 'places' },
  { href: '/abroad', label: 'มูต่างประเทศ', icon: 'abroad' },
  { href: '/calendar', label: 'ปฏิทินมงคล', icon: 'calendar' },
  { href: '/ai-prompts', label: 'ดูดวงด้วย AI', icon: 'sparkle' },
];
