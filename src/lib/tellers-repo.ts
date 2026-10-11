import 'server-only';
import type { FortuneTeller } from '@/data/fortune-tellers';
import { createDirectoryRepo } from '@/lib/directory-repo';

export const tellersRepo = createDirectoryRepo<FortuneTeller>('fortune_tellers');

/** หมอดูที่เผยแพร่แล้ว (cache จนกว่าจะมีการนำเข้า/แก้ไข) */
export const listPublishedTellers = tellersRepo.listPublished;
