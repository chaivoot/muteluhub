import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * ล็อกอินหลังบ้านด้วยรหัสผ่านเดียว (env ADMIN_PASSWORD)
 * cookie เก็บ HMAC ของรหัสผ่าน ไม่เก็บรหัสผ่านจริง เปลี่ยนรหัสใน Vercel = ทุก session หลุด
 */
const COOKIE = 'mh_admin';
const MAX_AGE = 60 * 60 * 24 * 14;

const password = () => process.env.ADMIN_PASSWORD ?? '';

export const adminConfigured = () => password().length >= 8;

function token(pw: string): string {
  return createHmac('sha256', pw).update('muteluhub-admin-v1').digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(value && safeEqual(value, token(password())));
}

export async function login(input: string): Promise<boolean> {
  if (!adminConfigured() || !safeEqual(token(input), token(password()))) return false;
  (await cookies()).set(COOKIE, token(password()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** ใช้ใน server action ทุกตัวของหลังบ้าน */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
}
