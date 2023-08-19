import {F13 as F, F13} from './common';

describe('polynomials', () => {
  const Fx = F.Polynomial();
  const p = new Fx([10, 2, 3]);
  const q = new Fx([3, 2, 1]);

  it('addition', () => {
    expect(p.add(q).eq([0, 4, 4])).toBeTruthy();
  });

  it('subtraction', () => {
    expect(p.sub(q).eq([7, 0, 2])).toBeTruthy();
  });

  it('multiplication', () => {
    expect(p.mul(q).eq([4, 0, 10, 8, 3])).toBeTruthy();
  });

  it('division', () => {
    expect(p.div(q).eq([3])).toBeTruthy();
  });

  it('remainder', () => {
    expect(p.rem(q).eq([1, 9])).toBeTruthy();
  });

  it('lagrange', () => {
    const l = Fx.lagrange([
      [0, 4],
      [-2, 1],
      [2, 3],
    ]);
    expect(l.eq([4, 7, 6])).toBeTruthy();
  });

  describe('zero polynomial', () => {
    const z = new Fx([]);
    const zz = new Fx([0, 0, 0]);

    it('should equal to an only-zero-padded polynomial', () => {
      expect(z.eq(zz)).toBeTruthy();
    });

    it('should evaluate to zero', () => {
      expect(z.eval(F13.random()).eq(0));
    });
  });
});
