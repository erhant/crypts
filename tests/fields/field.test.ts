import {expect, describe, test} from 'bun:test';
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
  tests.map(t => {
    const order = BigInt(t.o);
    const F = new Field(order);
    const n = F.Element(t.n);
    const m = F.Element(t.m);

    return describe(`${F}: n = ${n}, m = ${m}`, () => {
      test('addition', () => {
        expect(n.add(m).eq(t.add)).toBeTrue();

        expect(n.neg().eq(t.neg)).toBeTrue();
        expect(n.sub(m).eq(t.sub)).toBeTrue();

        expect(n.add(F.zero).eq(n)).toBeTrue();
        expect(n.sub(F.zero).eq(n)).toBeTrue();

        expect(F.zero.eq(0)).toBeTrue();
        expect(F.one.eq(1)).toBeTrue();
        expect(F.one.neg().eq(order - 1n)).toBeTrue();
      });

      test('multiplication', () => {
        expect(n.mul(m).eq(t.mul)).toBeTrue();

        expect(n.inv().eq(t.inv)).toBeTrue();
        expect(n.div(m).eq(t.div)).toBeTrue();

        expect(n.mul(F.one).eq(n)).toBeTrue();
        expect(n.div(F.one).eq(n)).toBeTrue();
      });

      test('exponentation', () => {
        expect(n.exp(5).value).toBe(BigInt(t.exp));
        expect(n.exp(1).eq(n)).toBeTrue();
        expect(n.exp(0).eq(F.one)).toBeTrue();
      });

      test('legendre symbol', () => {
        expect(legendreSymbol(n)).toEqual(t.legendre as -1 | 0 | 1);
      });
    });
  });
});
