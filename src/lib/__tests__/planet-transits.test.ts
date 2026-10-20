import { describe, expect, it } from 'vitest';
import { PLANET_BASELINES, PLANET_TRANSITS, ZODIAC_SIGNS, type PlanetTransit } from '@/data/planet-transits';
import { planetPositions, thaiDigits, transitTitle, upcomingTransits } from '@/lib/planet-transits';

describe('planet transits data', () => {
  it('every event has a source and a valid date', () => {
    for (const t of PLANET_TRANSITS) {
      expect(t.sources.length, `${t.planet} ${t.date}`).toBeGreaterThan(0);
      expect(t.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (t.end) expect(t.end >= t.date).toBe(true);
      if (t.kind === 'ingress') expect(ZODIAC_SIGNS).toContain(t.to);
    }
  });

  it('ingresses chain: each move starts from the sign the previous one entered', () => {
    const planets = new Set(PLANET_TRANSITS.map((t) => t.planet));
    for (const planet of planets) {
      const moves = PLANET_TRANSITS.filter((t) => t.planet === planet && t.kind === 'ingress').sort((a, b) => a.date.localeCompare(b.date));
      const base = PLANET_BASELINES.find((b) => b.planet === planet);
      let current = base?.sign ?? moves[0]?.from;
      for (const m of moves) {
        if (m.from) expect(m.from, `${planet} ${m.date}`).toBe(current);
        current = m.to;
      }
    }
  });
});

describe('planetPositions', () => {
  const transits: PlanetTransit[] = [
    { planet: 'jupiter', kind: 'ingress', from: 'กรกฎ', to: 'สิงห์', date: '2026-10-20', sources: ['x'] },
    { planet: 'jupiter', kind: 'ingress', from: 'สิงห์', to: 'กรกฎ', date: '2027-02-09', sources: ['x'] },
    { planet: 'rahu', kind: 'ingress', from: 'กุมภ์', to: 'มังกร', date: '2026-01-01', sources: ['x'] },
    { planet: 'mercury', kind: 'retrograde-period', to: 'พิจิก', date: '2026-11-01', end: '2026-11-20', sources: ['x'] },
  ];
  const base = [{ planet: 'jupiter' as const, sign: 'กรกฎ' as const, asOf: '2026-05-31', sources: ['x'] }];

  it('uses the baseline before the first move and the move on its day', () => {
    expect(planetPositions('2026-10-19', transits, base).find((p) => p.planet.slug === 'jupiter')?.sign).toBe('กรกฎ');
    const on = planetPositions('2026-10-20', transits, base).find((p) => p.planet.slug === 'jupiter')!;
    expect(on.sign).toBe('สิงห์');
    expect(on.since).toBe('2026-10-20');
    expect(on.next?.date).toBe('2027-02-09');
  });

  it('puts ketu opposite rahu when ketu has no data', () => {
    const ketu = planetPositions('2026-10-20', transits, base).find((p) => p.planet.slug === 'ketu');
    expect(ketu?.sign).toBe('กรกฎ');
  });

  it('skips planets with no data and flags a retrograde period', () => {
    const list = planetPositions('2026-11-05', transits, base);
    expect(list.some((p) => p.planet.slug === 'saturn')).toBe(false);
    expect(list.some((p) => p.planet.slug === 'mercury')).toBe(false);
  });

  it('lists ongoing and upcoming events within the window', () => {
    expect(upcomingTransits('2026-10-10', 14, transits).map((t) => t.date)).toEqual(['2026-10-20']);
    expect(upcomingTransits('2026-11-10', 14, transits).map((t) => t.date)).toEqual(['2026-11-01']);
  });
});

it('formats Thai digits and titles', () => {
  expect(thaiDigits('20 ต.ค. 2569')).toBe('๒๐ ต.ค. ๒๕๖๙');
  expect(transitTitle({ planet: 'jupiter', kind: 'ingress', from: 'กรกฎ', to: 'สิงห์', date: '2026-10-20', sources: [] })).toBe(
    'พฤหัสบดี (๕) ย้ายจากราศีกรกฎเข้าราศีสิงห์',
  );
});
