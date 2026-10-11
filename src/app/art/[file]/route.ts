import { ALL_ART_FILES, disciplineArtSvg } from '@/lib/art/discipline-art';

// ภาพ default หมอดู สร้างเป็นไฟล์ static ตอน build
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_ART_FILES.map(({ file }) => ({ file }));
}

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const art = ALL_ART_FILES.find((a) => a.file === file);
  if (!art) return new Response('Not found', { status: 404 });
  return new Response(disciplineArtSvg(art.discipline, art.variant), {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
