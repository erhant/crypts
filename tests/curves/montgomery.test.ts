import {expect, describe, it} from 'bun:test';
import {Field} from '../../src/fields';
import {MontgomeryCurve} from '../../src/curves';
import tests from '../data/curves.json';

tests satisfies {
  o: string;
  mont: {
    p: string[];
    q: string[];
    params: number[];
    double: string;
    add: string;
    sub: string;
    neg: string;
  };
}[];

describe('montgomery', () => {
  tests.map(testall => {
    const test = testall.mont;

    const F = new Field(testall.o);
    const E = new MontgomeryCurve(F, test.params as [number, number]);
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

      it.skip('scaling', () => {
        // TODO
        // expect(p.scale(5).toString()).toEqual(test.scale);
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
