import { describe, expect, it } from 'vitest';
import { LETTER_VALUES, PLATE_SUMS } from '@/data/plate-letters';
import { analyzePlate, parsePlate, platePersonal, plateWarnings } from '@/lib/license-plate';

const parse = (s: string) => {
  const r = parsePlate(s);
  if (!r.ok) throw new Error(r.reason);
  return r.plate;
};

describe('ข้อมูลทะเบียน', () => {
  it('พยัญชนะ ก-ฮ มีค่าครบ', () => {
    for (let c = 0x0e01; c <= 0x0e2e; c++) {
      const ch = String.fromCharCode(c);
      if (ch === 'ฤ' || ch === 'ฦ') continue; // ไม่ใช่พยัญชนะในหมวดทะเบียน
      expect(LETTER_VALUES[ch], ch).toBeGreaterThan(0);
    }
  });
  it('ไม่มี em dash และเลขไทย', () => {
    const s = JSON.stringify(PLATE_SUMS);
    expect(s).not.toMatch(/[—–]/);
    expect(s).not.toMatch(/[๐-๙]/);
  });
});

describe('อ่านทะเบียน', () => {
  it('รับรูปแบบที่คนพิมพ์จริง และตัดจังหวัดทิ้ง', () => {
    expect(parse('1กข 1234')).toEqual({ prefix: '1', letters: 'กข', number: '1234' });
    expect(parse('กข-1234 กรุงเทพมหานคร')).toEqual({ prefix: '', letters: 'กข', number: '1234' });
    expect(parsePlate('1234').ok).toBe(false);
    expect(parsePlate('กข').ok).toBe(false);
  });
  it('ผลรวมตรงกับตัวอย่างของแหล่ง', () => {
    expect(analyzePlate(parse('3กก 343')).total).toBe(15);
    expect(analyzePlate(parse('8กข 4351')).total).toBe(24);
    expect(analyzePlate(parse('งข 1199')).total).toBe(24);
  });
  it('คู่เลขในชุดตัวเลข และผลรวมหลักเดียว', () => {
    const r = analyzePlate(parse('กข 4351'), 'money');
    expect(r.pairs.map((p) => p.pair)).toEqual(['43', '35', '51']);
    expect(r.digitRoot).toBe(4);
  });
});

describe('ตามวันเกิด', () => {
  it('เกิดวันอาทิตย์: กาลกิณี ศ-ฮ เลข 6, การเงิน (ศรี = พุธ) อักษร ฎ-ณ เลข 4', () => {
    const p = platePersonal('sun', 'money')!;
    expect(p.avoidLetters).toContain('ส');
    expect(p.avoidDigit).toBe(6);
    expect(p.goalLetters).toContain('ณ');
    expect(p.goalDigit).toBe(4);
    const w = plateWarnings(analyzePlate(parse('สข 1236')), p);
    expect(w.letters).toEqual(['ส']);
    expect(w.lastIsAvoid).toBe(true);
  });
  it('พุธกลางคืน กาลกิณี บ-ม', () => {
    expect(platePersonal('wed-night', 'career')!.avoidLetters).toContain('ม');
  });
});
