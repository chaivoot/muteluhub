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

import { festivalPhase } from '@/lib/festivals';

describe('festivalPhase', () => {
  const d = { year: 2026, start: '2026-10-10', end: '2026-10-18', prep: '2026-10-09' };
  it('counts days during the festival', () => {
    expect(festivalPhase(d, '2026-10-11')).toEqual({ phase: 'ongoing', day: 2, totalDays: 9 });
    expect(festivalPhase(d, '2026-10-18')).toEqual({ phase: 'ongoing', day: 9, totalDays: 9 });
  });
  it('handles prep day, upcoming and ended', () => {
    expect(festivalPhase(d, '2026-10-09')).toEqual({ phase: 'prep' });
    expect(festivalPhase(d, '2026-09-30')).toEqual({ phase: 'upcoming', daysUntil: 10 });
    expect(festivalPhase(d, '2026-10-19')).toEqual({ phase: 'ended' });
  });
});

import { FESTIVALS } from '@/data/festivals';

describe('festival content', () => {
  it.each(FESTIVALS.filter((f) => f.content).map((f) => [f.slug, f] as const))('%s content is sourced and clean', (_, f) => {
    const c = f.content!;
    expect(c.sources.length).toBeGreaterThan(0);
    for (const v of c.venues) expect(v.sources.length).toBeGreaterThan(0);
    const text = JSON.stringify(c);
    expect(text).not.toContain('—');
    for (const url of [...c.sources, ...c.venues.flatMap((v) => v.sources)]) expect(() => new URL(url)).not.toThrow();
  });
});
