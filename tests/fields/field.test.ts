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
    const order = BigInt(test.o);
    const F = new Field(order);
    const n = F.Element(test.n);
    const m = F.Element(test.m);

    return describe(`${F}: n = ${n}, m = ${m}`, () => {
      it('addition', () => {
        expect(n.add(m).eq(test.add)).toBeTrue();

        expect(n.neg().eq(test.neg)).toBeTrue();
        expect(n.sub(m).eq(test.sub)).toBeTrue();

        expect(n.add(F.zero).eq(n)).toBeTrue();
        expect(n.sub(F.zero).eq(n)).toBeTrue();

        expect(F.zero.eq(0)).toBeTrue();
        expect(F.one.eq(1)).toBeTrue();
        expect(F.one.neg().eq(order - 1n)).toBeTrue();
      });

      it('multiplication', () => {
        expect(n.mul(m).eq(test.mul)).toBeTrue();

        expect(n.inv().eq(test.inv)).toBeTrue();
        expect(n.div(m).eq(test.div)).toBeTrue();

        expect(n.mul(F.one).eq(n)).toBeTrue();
        expect(n.div(F.one).eq(n)).toBeTrue();
      });

      it('exponentation', () => {
        expect(n.exp(5).value).toBe(BigInt(test.exp));
        expect(n.exp(1).eq(n)).toBeTrue();
        expect(n.exp(0).eq(F.one)).toBeTrue();
      });

      it('legendre symbol', () => {
        expect(legendreSymbol(n)).toEqual(test.legendre as -1 | 0 | 1);
      });
    });
  });
});
