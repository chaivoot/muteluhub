'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';

/**
 * PostHog (สถิติผู้เข้าชม) เปิดเมื่อมี NEXT_PUBLIC_POSTHOG_KEY เท่านั้น
 * - cookieless: ไม่ตั้งคุกกี้ ไม่ใช้ local storage จึงไม่ต้องมีแบนเนอร์ขอคุกกี้ (เว็บไม่มี pop-up)
 *   ต้องเปิด Cookieless server hash mode ในหน้าตั้งค่าโปรเจกต์ของ PostHog ด้วย ไม่งั้น event ถูกทิ้ง
 * - ส่งผ่าน /ingest ของเว็บเอง (rewrite ใน next.config) ตัวบล็อกโฆษณาจะไม่ตัดทิ้ง
 * - ไม่อัดหน้าจอ (session recording) ไม่เก็บค่าที่พิมพ์ ส่วนที่มีข้อมูลส่วนตัว (เบอร์ วันเกิด ทะเบียน) ใส่ class ph-no-capture
 * - ไม่นับหน้าหลังบ้าน
 */
export function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || window.location.pathname.startsWith('/admin')) return;
    posthog.init(key, {
      api_host: '/ingest',
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST?.includes('eu.') ? 'https://eu.posthog.com' : 'https://us.posthog.com',
      defaults: '2025-05-24',
      capture_pageview: 'history_change',
      cookieless_mode: 'always',
      person_profiles: 'never',
      disable_session_recording: true,
      before_send: (event) => {
        const url = String(event?.properties?.$current_url ?? '');
        return url.includes('/admin') ? null : event;
      },
    });
  }, []);
  return null;
}
