import 'server-only';
import type { Planet } from '@/data/daily-colors';
import type { Product, ShirtOffer } from '@/data/products';
import { createDirectoryRepo } from '@/lib/directory-repo';
import { shirtOffers } from '@/lib/products';

export const productsRepo = createDirectoryRepo<Product>('products');

export const listPublishedProducts = productsRepo.listPublished;

/** เสื้อหนึ่งตัวต่อสี สำหรับการ์ดสีเสื้อ */
export async function listShirtOffers(): Promise<Partial<Record<Planet, ShirtOffer>>> {
  return shirtOffers(await listPublishedProducts());
}
