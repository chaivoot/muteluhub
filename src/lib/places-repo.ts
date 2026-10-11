import 'server-only';
import type { Place } from '@/data/places';
import { createDirectoryRepo } from '@/lib/directory-repo';

export const placesRepo = createDirectoryRepo<Place>('places');

/** สถานที่ที่เผยแพร่แล้ว (cache จนกว่าจะมีการนำเข้า/แก้ไข) */
export const listPublishedPlaces = placesRepo.listPublished;
