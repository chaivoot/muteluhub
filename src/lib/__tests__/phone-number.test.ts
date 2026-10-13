import { describe, expect, it } from 'vitest';
import { PHONE_PAIRS, PHONE_SUMS } from '@/data/phone-pairs';
import { analyzePhone, checkPhone, formatPhone, normalizePhone } from '@/lib/phone-number';
import { personalNumbers } from '@/lib/phone-number/personal';

describe('ข้อมูลคู่เลข', () => {
  it('ครบ 00-99 และผลรวม 9-81', () => {
    for (let i = 0; i < 100; i++) expect(PHONE_PAIRS[String(i).padStart(2, '0')]).toBeDefined();
    for (let s = 9; s <= 81; s++) expect(PHONE_SUMS[s]).toBeDefined();
  });
  it('ไม่มี em dash และไม่มีเลขไทย', () => {
    const all = JSON.stringify([PHONE_PAIRS, PHONE_SUMS]);
    expect(all).not.toMatch(/[—–]/);
    expect(all).not.toMatch(/[๐-๙]/);
  });
});

describe('เช็กเบอร์', () => {
  it('รับรูปแบบที่คนพิมพ์จริง', () => {
    expect(normalizePhone('+66 81-234-5678')).toBe('0812345678');
    expect(checkPhone('081 234 5678')).toEqual({ ok: true, digits: '0812345678' });
    expect(checkPhone('02 123 4567')).toEqual({ ok: true, digits: '021234567' });
    expect(checkPhone('0812')).toEqual({ ok: false, reason: 'short' });
    expect(checkPhone('0212345678')).toEqual({ ok: false, reason: 'prefix' });
    expect(formatPhone('0812345678')).toBe('081 234 5678');
  });
  it('อ่าน 7 ตัวท้ายเป็น 6 คู่ 3 คู่สุดท้ายเป็นคู่หลัก ผลรวมนับทุกหลัก', () => {
    const r = analyzePhone('0812345678', 'money');
    expect(r.pairs.map((p) => p.pair)).toEqual(['23', '34', '45', '56', '67', '78']);
    expect(r.pairs.map((p) => p.key)).toEqual([false, false, false, true, true, true]);
    expect(r.sum).toBe(44);
    expect(r.counts.good + r.counts.neutral + r.counts.bad).toBe(6);
    expect(r.goal?.support.every((p) => p.goals.includes('money'))).toBe(true);
  });
});

describe('คู่เลขตามวันเกิด (ทักษา)', () => {
  it('เกิดวันอาทิตย์ เสริมการเงิน = 4 (ศรี พุธ) เลี่ยง 6 (กาลกิณี ศุกร์)', () => {
    const p = personalNumbers('sun', 'money')!;
    expect(p.goalDigit).toBe(4);
    expect(p.avoidDigit).toBe(6);
    expect(p.recommended.length).toBeGreaterThan(0);
    expect(p.recommended.every((x) => !x.includes('6'))).toBe(true);
    expect(p.recommended[0]).toContain('4');
  });
  it('พุธกลางคืน = ราหู กาลกิณีคือพฤหัสบดี (5)', () => {
    expect(personalNumbers('wed-night', 'career')!.avoidDigit).toBe(5);
  });
});
