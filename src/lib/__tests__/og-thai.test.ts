import { describe, expect, it } from 'vitest';
import { shapeThai } from '@/lib/og/thai';

const R = (n: number) => String.fromCharCode(0xf70a + n);

describe('shapeThai', () => {
  it('raises tone marks above upper vowels', () => {
    expect(shapeThai('ที่')).toBe(`ที${R(0)}`);
    expect(shapeThai('เรื่อง')).toBe(`เรื${R(0)}อง`);
    expect(shapeThai('เสื้อ')).toBe(`เสื${R(1)}อ`);
    expect(shapeThai('กั๊ก')).toBe(`กั${R(2)}ก`);
  });

  it('raises tone marks before sara am', () => {
    expect(shapeThai('น้ำ')).toBe(`น${R(1)}ำ`);
  });

  it('leaves tone marks without an upper vowel and other text alone', () => {
    expect(shapeThai('ไม่ ก่อน MuteluHub 2569')).toBe('ไม่ ก่อน MuteluHub 2569');
  });
});
