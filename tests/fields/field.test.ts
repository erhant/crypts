import {expect, describe, it} from 'bun:test';
import {Field, legendreSymbol} from '../../src/fields';
import tests from '../data/field.json';

tests satisfies {
  n: string;
  m: string;
  o: string;
  add: string;
  sub: string;
  neg: string;
  mul: string;
  div: string;
  inv: string;
  exp: string;
  legendre: number;
}[];

describe('prime field', () => {
  tests.map(test => {
    const F = new Field(test.o);
    const n = F.Element(test.n);
    const m = F.Element(test.m);

    return describe(`${F}: n = ${n}, m = ${m}`, () => {
      it('addition', () => {
        expect(n.add(m).eq(test.add)).toBeTruthy();

        expect(n.neg().eq(test.neg)).toBeTruthy();
        expect(n.sub(m).eq(test.sub)).toBeTruthy();

        expect(n.add(F.zero).eq(n)).toBeTruthy();
        expect(n.sub(F.zero).eq(n)).toBeTruthy();
      });

      it('multiplication', () => {
        expect(n.mul(m).eq(test.mul)).toBeTruthy();

        expect(n.inv().eq(test.inv)).toBeTruthy();
        expect(n.div(m).eq(test.div)).toBeTruthy();

        expect(n.mul(F.one).eq(n)).toBeTruthy();
        expect(n.div(F.one).eq(n)).toBeTruthy();
      });

      it('exponentation', () => {
        expect(n.exp(5).value).toBe(BigInt(test.exp));
        expect(n.exp(1).eq(n)).toBeTruthy();
        expect(n.exp(0).eq(F.one)).toBeTruthy();
      });

      it('legendre symbol', () => {
        expect(legendreSymbol(n)).toEqual(test.legendre);
      });
    });
  });
});
