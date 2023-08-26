import {Field} from '../src/fields';
import {legendreSymbol} from '../src/utils';

describe('finite field', () => {
  const tests = [
    {n: 1, m: 9, o: 23, add: 10, sub: 15, neg: 22, mul: 9, div: 18, inv: 1, exp: 1, legendre: 1},
    {n: 9, m: 8, o: 13, add: 4, sub: 1, neg: 4, mul: 7, div: 6, inv: 3, exp: 3, legendre: 1},
    {n: 6, m: 12, o: 17, add: 1, sub: 11, neg: 11, mul: 4, div: 9, inv: 3, exp: 7, legendre: -1},
    {
      n: 1298,
      m: 1453,
      o: 2503,
      add: 248,
      sub: 2348,
      neg: 1205,
      mul: 1235,
      div: 1348,
      inv: 1884,
      exp: 1187,
      legendre: -1,
    },
  ];

  tests.map(test => {
    const F = new Field(test.o);
    const n = F.Element(test.n);
    const m = F.Element(test.m);

    return describe(`${F}: n = ${n}, m = ${m}`, () => {
      it('additive operations', () => {
        expect(n.add(m).eq(test.add)).toBeTruthy();

        expect(n.neg().eq(test.neg)).toBeTruthy();
        expect(n.sub(m).eq(test.sub)).toBeTruthy();

        expect(n.add(F.zero).eq(n)).toBeTruthy();
        expect(n.sub(F.zero).eq(n)).toBeTruthy();
      });

      it('multiplicative operations', () => {
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
        expect(legendreSymbol(n.value, BigInt(test.o))).toEqual(BigInt(test.legendre));
      });
    });
  });
});
