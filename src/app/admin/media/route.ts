import { isAdmin } from '@/lib/admin-auth';
import { saveMedia } from '@/lib/articles-repo';

/** อัปโหลดรูปจากหลังบ้าน (ฝั่งเบราว์เซอร์ย่อเป็น webp ไม่เกิน 1600px ก่อนส่ง) */
const MAX_BYTES = 3 * 1024 * 1024;

function sniff(b: Buffer): string | null {
  if (b.length > 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length > 8 && b[0] === 0x89 && b.toString('ascii', 1, 4) === 'PNG') return 'image/png';
  return null;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'ต้องเข้าสู่ระบบก่อน' }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'ไม่พบไฟล์' }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: 'ไฟล์ใหญ่เกิน 3 MB' }, { status: 413 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = sniff(bytes);
  if (!mime) return Response.json({ error: 'รองรับเฉพาะ JPG PNG WebP' }, { status: 415 });
  const num = (v: FormDataEntryValue | null | undefined) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 && n < 20000 ? Math.round(n) : null;
  };
  const id = await saveMedia(bytes, mime, num(form?.get('width')), num(form?.get('height')));
  return Response.json({ src: `/media/${id}` });
}
