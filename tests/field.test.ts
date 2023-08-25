import {Field} from '../src/fields';
import {legendreSymbol} from '../src/utils';

describe('finite field', () => {
  const tests = [
    {n: 1, m: 9, o: 23, add: 10, sub: 15, mul: 9, div: 18, exp: 1, neg: 22, inv: 1, legendre: 1, xgcd: [1, 1, 0]},
    {n: 9, m: 8, o: 13, add: 4, sub: 1, mul: 7, div: 6, exp: 3, neg: 4, inv: 3, legendre: 1, xgcd: [1, 3, 0]},
    {n: 2, m: 1, o: 5, add: 3, sub: 1, mul: 2, div: 2, exp: 2, neg: 3, inv: 3, legendre: -1, xgcd: [1, 3, 0]},
    {n: 6, m: 12, o: 17, add: 1, sub: 11, mul: 4, div: 9, exp: 13, neg: 11, inv: 3, legendre: -1, xgcd: [1, 3, 0]},
  ];

  tests.map(test =>
    describe(`GF(${test.o}) : n = ${test.n}, m = ${test.m}`, () => {
      const F = new Field(test.o);
      const n = F.Element(test.n);
      const m = F.Element(test.m);

      it('addition', () => {
        expect(n.add(m).eq(test.add)).toBeTruthy();
        expect(n.add(F.zero).eq(n)).toBeTruthy();
      });

      it('subtraction', () => {
        expect(n.sub(m).eq(test.sub)).toBeTruthy();
        expect(n.sub(F.zero).eq(n)).toBeTruthy();
      });

      it('multiplication', () => {
        expect(n.mul(m).eq(test.mul)).toBeTruthy();
        expect(n.mul(F.one).eq(n)).toBeTruthy();
      });

      it('division', () => {
        expect(n.div(m).eq(test.div)).toBeTruthy();
        expect(n.div(F.one).eq(n)).toBeTruthy();
      });

      it('exponentiation', () => {
        expect(n.exp(m).eq(test.exp)).toBeTruthy();
        expect(n.exp(F.one).eq(n)).toBeTruthy();
        expect(n.exp(F.zero).eq(F.one)).toBeTruthy();
      });

      it('negation', () => {
        expect(n.neg().eq(test.neg)).toBeTruthy();
      });

      it('inversion', () => {
        expect(n.inv().eq(test.inv)).toBeTruthy();
      });

      it('legendre symbol', () => {
        expect(legendreSymbol(n.value, BigInt(test.o))).toEqual(BigInt(test.legendre));
      });

      // it('extended euclidean algorithm', () => {
      //   const xgcd = extendedEuclideanAlgorithm(n.value, m.value).map(x => x % BigInt(test.o));
      //   const xgcdRev = extendedEuclideanAlgorithm(m.value, n.value).map(x => x % BigInt(test.o));
      //   console.log({received: xgcd, reverse: xgcdRev, expected: test.xgcd});
      //   // expect(xgcd[0]).toBe(BigInt(test.xgcd[0]));
      //   // expect(xgcd[1]).toBe(BigInt(test.xgcd[1]));
      //   // expect(xgcd[2]).toBe(BigInt(test.xgcd[2]));
      // });
    })
  );
});
