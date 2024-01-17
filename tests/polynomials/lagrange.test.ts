import {expect, describe, it} from 'bun:test';
import {interpolate} from '~/polynomials';
import {Field} from '~/fields';

describe('lagrange interpolation', () => {
  const points: [number, number][] = [
    [0, 4],
    [-2, 1],
    [2, 3],
  ];
  const l = interpolate(new Field(13), points);

  it('should interpolate correctly', () => {
    expect(l.eq([4, 7, 6])).toBeTruthy();
  });

  it('should evaluate correctly', () => {
    for (const p of points) {
      expect(l.eval(p[0]).eq(p[1])).toBeTruthy();
    }
  });
});
