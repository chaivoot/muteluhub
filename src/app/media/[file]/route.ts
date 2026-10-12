import { getMedia } from '@/lib/articles-repo';

/** รูปที่อัปโหลดจากหลังบ้าน /media/<id> (id สุ่ม เนื้อหาไม่เปลี่ยน จึง cache ได้ยาว) */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const id = file.replace(/\.(webp|jpe?g|png)$/, '');
  if (!/^[A-Za-z0-9_-]{6,32}$/.test(id)) return new Response('Not found', { status: 404 });
  const media = await getMedia(id);
  if (!media) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(media.bytes), {
    headers: {
      'Content-Type': media.mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
