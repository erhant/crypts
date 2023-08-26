import {Field} from '../src/fields';
import {AffineShortWeierstrassCurve} from '../src/curves';

describe('affine short weierstrass', () => {
  const tests = [
    {
      p: [10, 10],
      q: [1, 2],
      o: 13,
      ab: [8, 8],
      double: '(5, 2)',
      scale: '(8, 5)',
      add: '(6, 8)',
      sub: '(11, 6)',
      neg: '(10, 3)',
    },
  ];

  tests.map(test => {
    const F = new Field(test.o);
    const E = new AffineShortWeierstrassCurve(F, test.ab as [number, number]);
    const p = E.Point(test.p as [number, number]);
    const q = E.Point(test.q as [number, number]);

    describe(`${E}: p = ${p}, q = ${q}`, () => {
      it('doubling', () => {
        expect(p.add(p).toString()).toEqual(test.double);
      });

      it('addition', () => {
        expect(p.add(q).toString()).toEqual(test.add);
      });

      it('subtraction', () => {
        expect(p.sub(q).toString()).toEqual(test.sub);
      });

      it('negation', () => {
        expect(p.neg().toString()).toEqual(test.neg);
      });

      it('point at infinity', () => {
        const inf = E.inf;

        expect(p.add(inf).eq(p)).toBeTruthy();
        expect(p.sub(inf).eq(p)).toBeTruthy();

        expect(p.sub(p).eq(inf)).toBeTruthy();
        expect(p.add(p.neg()).eq(inf)).toBeTruthy();
      });
    });
  });
});
