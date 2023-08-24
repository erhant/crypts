import {interpolate} from '../src/polynomials';
import {F13} from './common';

const F = F13;

describe('polynomials', () => {
  const p = F.Polynomial([10, 2, 3]);
  const q = F.Polynomial([3, 2, 1]);

  it('degree', () => {
    expect(p.degree).toBe(2);
    expect(q.degree).toBe(2);
  });

  it('addition', () => {
    expect(p.add(q).eq([0, 4, 4])).toBeTruthy();
  });

  it('subtraction', () => {
    expect(p.sub(q).eq([7, 0, 2])).toBeTruthy();

    // coefficients should remove right-padded zeros
    expect(q.sub(F.Polynomial([0, 2, 1])).eq([3])).toBeTruthy();
  });

  it('multiplication', () => {
    expect(p.mul(q).eq([4, 0, 10, 8, 3])).toBeTruthy();
  });

  it('scale', () => {
    expect(p.scale(2).eq([7, 4, 6])).toBeTruthy();
  });

  it('division', () => {
    expect(p.div(q).eq([3])).toBeTruthy();
  });

  it('remainder', () => {
    expect(p.mod(q).eq([1, 9])).toBeTruthy();
  });
});

describe('lagrange interpolation', () => {
  const points: [number, number][] = [
    [0, 4],
    [-2, 1],
    [2, 3],
  ];
  const l = interpolate(F, points);

  it('should interpolate correctly', () => {
    expect(l.eq([4, 7, 6])).toBeTruthy();
  });

  it('should evaluate correctly', () => {
    for (const p of points) {
      expect(l.eval(p[0]).eq(p[1])).toBeTruthy();
    }
  });
});

describe('zero polynomial', () => {
  const zero = F.Polynomial([]);

  it('should be equal to an only-zero-padded polynomial', () => {
    expect(zero.eq(F.Polynomial([0, 0, 0]))).toBeTruthy();
  });

  it('should evaluate to zero', () => {
    expect(zero.eval(zero.field.random()).eq(0));
  });
});
