import { describe, expect, it } from 'vitest';
import { distanceKm, formatDistance, sortByDistance } from '@/lib/geo';

describe('geo', () => {
  it('computes great-circle distance', () => {
    // ศาลพระพรหมเอราวัณ -> วัดพระธาตุดอยสุเทพ ราว 590 กม.
    const km = distanceKm({ lat: 13.74413, lng: 100.54091 }, { lat: 18.80492, lng: 98.92163 });
    expect(km).toBeGreaterThan(570);
    expect(km).toBeLessThan(610);
    expect(distanceKm({ lat: 13, lng: 100 }, { lat: 13, lng: 100 })).toBe(0);
  });

  it('formats distance in Thai units with Arabic numerals', () => {
    expect(formatDistance(0.004)).toBe('10 ม.');
    expect(formatDistance(0.853)).toBe('850 ม.');
    expect(formatDistance(3.24)).toBe('3.2 กม.');
    expect(formatDistance(1234.4)).toBe('1,234 กม.');
  });

  it('sorts nearest first and puts items without coords last', () => {
    const r = sortByDistance(
      [
        { id: 'far', lat: 18.8, lng: 98.9 },
        { id: 'none', lat: null, lng: null },
        { id: 'near', lat: 13.75, lng: 100.54 },
      ],
      { lat: 13.74, lng: 100.54 },
    );
    expect(r.map((x) => x.item.id)).toEqual(['near', 'far', 'none']);
    expect(r[2].km).toBeNull();
  });
});
