import { describe, expect, it } from 'vitest';
import type { Product } from '@/data/products';
import { colorFromThai, parseProductImport } from '@/lib/import/product-schema';
import { shirtOffers } from '@/lib/products';

const valid = {
  name: 'เสื้อยืดสีเขียว (สมมติ)',
  slug: 'test-shirt-green',
  brand: 'แบรนด์ทดสอบ',
  url: 'https://s.shopee.co.th/abc123',
  image: { src: '/images/shirts/test-green.jpg', alt: 'เสื้อยืดสีเขียว' },
  color: 'เขียว',
  checkedAt: '2026-10-12',
};

describe('product import', () => {
  it('maps Thai color names to taksa planets and shades', () => {
    expect(colorFromThai('เขียว')).toEqual({ planet: 'mercury' });
    expect(colorFromThai('สีแดง')).toEqual({ planet: 'sun' });
    expect(colorFromThai('ครีม')).toEqual({ planet: 'moon', shade: 'ครีม' });
    expect(colorFromThai('ดำ')).toEqual({ planet: 'saturn', shade: 'ดำ' });
    expect(colorFromThai('ขาว')).toBeNull();
  });

  it('converts a valid item', () => {
    const r = parseItem(valid);
    expect(r.ok).toBe(true);
    expect(r.item).toMatchObject({ slug: 'test-shirt-green', shirtColor: 'mercury', published: false, notes: [] });
  });

  it('accepts only Shopee affiliate links and known colors', () => {
    expect(parseItem({ ...valid, url: 'https://shope.ee/xyz' }).ok).toBe(true);
    const plain = parseItem({ ...valid, url: 'https://shopee.co.th/product/1/2' });
    expect(plain.ok).toBe(false);
    expect(plain.errors.join(' ')).toContain('affiliate');
    expect(parseItem({ ...valid, color: 'ขาว' }).ok).toBe(false);
    expect(parseItem({ ...valid, image: { src: 'http://x.com/a.jpg', alt: 'a' } }).ok).toBe(false);
  });
});

function parseItem(v: object) {
  return parseProductImport(JSON.stringify(v)).items[0];
}

describe('shirtOffers', () => {
  const p = (slug: string, shirtColor: Product['shirtColor'], shade?: string): Product => ({
    slug,
    name: slug,
    url: 'https://s.shopee.co.th/x',
    image: { src: '/a.jpg', alt: 'a' },
    shirtColor,
    shade,
    checkedAt: '2026-10-12',
    published: true,
    notes: [],
  });

  it('picks one shirt per color, main shade first', () => {
    const r = shirtOffers([p('cream', 'moon', 'ครีม'), p('yellow-b', 'moon'), p('yellow-a', 'moon'), p('mug', undefined)]);
    expect(r.moon?.slug).toBe('yellow-a');
    expect(Object.keys(r)).toEqual(['moon']);
  });

  it('falls back to a shade when the main color is missing', () => {
    expect(shirtOffers([p('black', 'saturn', 'ดำ')]).saturn?.slug).toBe('black');
  });
});
