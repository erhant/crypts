import {Field} from '../src/fields';
import {ShortWeierstrassCurve} from '../src/curves';

describe('short weierstrass', () => {
  const tests = [
    {
      p: ['0x9', '0x9'],
      q: ['0xc', '0x5'],
      o: '0xd',
      ab: [8, 8],
      double: '(5, 2)',
      scale: '(6, 8)',
      add: '(1, 2)',
      sub: '(8, 8)',
      neg: '(9, 4)',
    },
  ];

  tests.map(test => {
    const F = new Field(test.o);
    const E = new ShortWeierstrassCurve(F, test.ab as [number, number]);
    const p = E.Point(test.p as [string, string]);
    const q = E.Point(test.q as [string, string]);

    describe(`${E}: p = ${p}, q = ${q}`, () => {
      it('addition', () => {
        expect(p.add(p).toString()).toEqual(test.double);
        expect(p.add(q).toString()).toEqual(test.add);
      });

      it('subtraction', () => {
        expect(p.neg().toString()).toEqual(test.neg);
        expect(p.sub(q).toString()).toEqual(test.sub);
      });

      it('scaling', () => {
        expect(p.scale(5).toString()).toEqual(test.scale);
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
