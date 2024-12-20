import {expect, describe, it} from 'bun:test';
import {Field} from '../../src/fields';
import {ShortWeierstrassCurve} from '../../src/curves';
import tests from '../data/curves.json';

tests satisfies {
  o: string;
  sw: {
    p: string[];
    q: string[];
    params: number[];
    double: string;
    scale: string;
    add: string;
    sub: string;
    neg: string;
  };
}[];

describe('short weierstrass', () => {
  tests.map(testall => {
    const test = testall.sw;

    const F = new Field(testall.o);
    const E = new ShortWeierstrassCurve(F, test.params as [number, number]);
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

      it('should generate random points', () => {
        for (let i = 0; i < 10; i++) {
          const p = E.random();
          E.satisfies([p.x.value, p.y.value]);
        }
      });
    });
  });
});
