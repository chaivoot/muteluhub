import { describe, expect, it } from 'vitest';
import type { Festival } from '@/data/festivals';
import { currentFestivalDate, upcomingFestivals } from '@/lib/festivals';

const kinje: Festival = {
  slug: 'kinje',
  name: 'เทศกาลกินเจ',
  tagline: '',
  goals: [],
  dates: [{ year: 2026, start: '2026-10-10', end: '2026-10-18' }],
};

describe('upcomingFestivals', () => {
  it('marks a running festival as ongoing', () => {
    expect(upcomingFestivals('2026-10-11', 45, [kinje])[0].status).toBe('ongoing');
  });

  it('includes festivals starting within the window', () => {
    expect(upcomingFestivals('2026-09-01', 45, [kinje])[0].status).toBe('upcoming');
    expect(upcomingFestivals('2026-08-01', 45, [kinje])).toHaveLength(0);
  });

  it('drops festivals that have ended', () => {
    expect(upcomingFestivals('2026-10-19', 45, [kinje])).toHaveLength(0);
  });
});

describe('currentFestivalDate', () => {
  it('falls back to the latest year once all dates have passed', () => {
    expect(currentFestivalDate(kinje, '2027-01-01')?.year).toBe(2026);
  });
});
