import { describe, expect, it } from 'vitest';
import { ECLIPSES } from '@/data/eclipses';
import { eclipseEndDate, eclipseTitle, pastEclipses, upcomingEclipses } from '@/lib/eclipses';

describe('eclipses', () => {
  it('data is sorted, times are HH:MM and totality sits inside the eclipse', () => {
    const dates = ECLIPSES.map((e) => e.date);
    expect([...dates].sort()).toEqual(dates);
    for (const e of ECLIPSES) {
      for (const t of [e.start, e.max, e.end]) expect(t).toMatch(/^\d{2}:\d{2}$/);
      expect(e.sources.length).toBeGreaterThan(0);
      if (e.totality) expect(e.type).toBe('total');
    }
  });

  it('an eclipse crossing midnight ends the next day', () => {
    const nye = ECLIPSES.find((e) => e.date === '2028-12-31')!;
    expect(eclipseEndDate(nye)).toBe('2029-01-01');
    expect(upcomingEclipses('2029-01-01').map((e) => e.date)).toContain('2028-12-31');
    expect(eclipseTitle(nye)).toBe('จันทรุปราคาเต็มดวง');
  });

  it('splits upcoming and past by today, with a look-ahead window', () => {
    expect(upcomingEclipses('2026-10-29')[0].date).toBe('2027-08-02');
    expect(upcomingEclipses('2026-10-29', 30)).toEqual([]);
    expect(upcomingEclipses('2027-07-10', 30).map((e) => e.date)).toEqual(['2027-08-02']);
    expect(pastEclipses('2026-10-29').map((e) => e.date)).toEqual(['2026-03-03']);
  });
});
