import type { PromptValues } from '@/lib/prompts';

/**
 * ส่งค่าจากเครื่องมือ (เลขมงคล สีเสื้อ) ไปหน้า prompt ผ่าน sessionStorage
 * ข้อมูลอย่างวันเกิดจึงไม่อยู่ใน URL และไม่ถึง server หรือ log
 */
const KEY = 'mh.prompt-handoff';

export function setPromptHandoff(slug: string, values: PromptValues): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify({ slug, values }));
  } catch {
    // sessionStorage ใช้ไม่ได้ ผู้ใช้กรอกเองในหน้า prompt
  }
}

/** อ่านแล้วลบทิ้งทันที ใช้ได้ครั้งเดียว */
export function takePromptHandoff(slug: string): PromptValues | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(KEY);
    const data = JSON.parse(raw) as { slug?: string; values?: PromptValues };
    return data.slug === slug && data.values ? data.values : null;
  } catch {
    return null;
  }
}
