import {F} from './common';

const Fx = F.Polynomial();

describe('polynomials', () => {
  const p = new Fx([10, 2, 3]);
  const q = new Fx([3, 2, 1]);

  it('degree', () => {
    expect(p.degree).toBe(3);
    expect(q.degree).toBe(3);
  });

  it('addition', () => {
    expect(p.add(q).eq([0, 4, 4])).toBeTruthy();
  });

  it('subtraction', () => {
    expect(p.sub(q).eq([7, 0, 2])).toBeTruthy();

    // coefficients should remove right-padded zeros
    expect(q.sub(new Fx([0, 2, 1])).eq([3])).toBeTruthy();
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
    expect(p.rem(q).eq([1, 9])).toBeTruthy();
  });

  it('lagrange interpolation', () => {
    const points: [number, number][] = [
      [0, 4],
      [-2, 1],
      [2, 3],
    ];
    const l = Fx.lagrange(points);
    expect(l.eq([4, 7, 6])).toBeTruthy();

    for (const p of points) {
      expect(l.eval(p[0]).eq(p[1])).toBeTruthy();
    }
  });
});

describe('zero polynomial', () => {
  const [z, zz] = [new Fx([]), new Fx([0, 0, 0])];

  it('should equal to an only-zero-padded polynomial', () => {
    expect(z.eq(zz)).toBeTruthy();
  });

  it('should evaluate to zero', () => {
    expect(z.eval(F.random()).eq(0));
  });
});
