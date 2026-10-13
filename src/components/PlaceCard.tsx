import Link from 'next/link';
import type { Place } from '@/data/places';
import { getGoal } from '@/lib/goals';
import { placeholderFor } from '@/lib/place-placeholder';
import { placeLocation } from '@/lib/places';
import { CreditBadge } from './CreditBadge';

export function PlaceImageBox({ place, className }: { place: Place; className: string }) {
  const image = place.images[0];
  return (
    <span className={className}>
      {image ? (
        <>
          <img src={image.src} alt={image.alt} loading="lazy" />
          <CreditBadge credit={`${image.author} / ${image.license}`} />
        </>
      ) : (
        <>
          <img src={placeholderFor(place).srcSmall} alt={placeholderFor(place).alt} loading="lazy" className="place-img-placeholder" />
          <CreditBadge credit={placeholderFor(place).credit} />
        </>
      )}
    </span>
  );
}

/** การ์ดสถานที่: ภาพบน ชื่อ + จังหวัด · เป้าหมาย */
export function PlaceCard({ place, distance }: { place: Place; distance?: string }) {
  const goals = place.goals.slice(0, 2).map((g) => getGoal(g).short).join(' ');
  return (
    <Link href={`/places/${place.slug}`} className="place-card">
      <PlaceImageBox place={place} className="place-card__img" />
      <span className="place-card__name">{place.name}</span>
      <span className="place-card__meta">
        {distance && <span className="place-card__dist">{distance} · </span>}
        {placeLocation(place)}
        {goals && ` · ${goals}`}
      </span>
    </Link>
  );
}
