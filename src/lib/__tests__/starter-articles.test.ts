import { describe, expect, it } from 'vitest';
import { starterArticles } from '@/lib/starter-articles';

describe('starter articles', () => {
  const list = starterArticles();
  it('ผ่าน schema และ slug ไม่ซ้ำ', () => {
    expect(new Set(list.map((a) => a.slug)).size).toBe(list.length);
  });
  it('ไม่มี em dash และนำเข้าเป็นฉบับร่าง', () => {
    for (const a of list) {
      expect(`${a.title}${a.excerpt}${a.body}`).not.toContain('—');
      expect(a.published).toBe(false);
    }
  });
});
