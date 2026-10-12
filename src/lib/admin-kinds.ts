import type { DirectoryKind } from '@/lib/directory-repo';

/** ประเภทข้อมูลในหลังบ้าน */
export const ADMIN_KINDS: { kind: DirectoryKind; label: string; publicPath: string }[] = [
  { kind: 'places', label: 'สถานที่', publicPath: '/places' },
  { kind: 'fortune_tellers', label: 'หมอดู', publicPath: '/fortune-tellers' },
  { kind: 'products', label: 'สินค้า', publicPath: '/color-today' },
];

export const isDirectoryKind = (v: unknown): v is DirectoryKind => ADMIN_KINDS.some((k) => k.kind === v);

export const kindLabel = (kind: DirectoryKind) => ADMIN_KINDS.find((k) => k.kind === kind)!.label;
