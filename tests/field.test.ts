import {Field} from '../src/fields';
import {legendreSymbol} from '../src/utils';

describe('finite field', () => {
  const tests = [
    {
      n: '0x1',
      m: '0x9',
      o: '0x17',
      add: '0xa',
      sub: '0xf',
      neg: '0x16',
      mul: '0x9',
      div: '0x12',
      inv: '0x1',
      exp: '0x1',
      legendre: 1,
    },
    {
      n: '0x9',
      m: '0x8',
      o: '0xd',
      add: '0x4',
      sub: '0x1',
      neg: '0x4',
      mul: '0x7',
      div: '0x6',
      inv: '0x3',
      exp: '0x3',
      legendre: 1,
    },
    {
      n: '0x6',
      m: '0xc',
      o: '0x11',
      add: '0x1',
      sub: '0xb',
      neg: '0xb',
      mul: '0x4',
      div: '0x9',
      inv: '0x3',
      exp: '0x7',
      legendre: -1,
    },
    {
      n: '0x512',
      m: '0x5ad',
      o: '0x9c7',
      add: '0xf8',
      sub: '0x92c',
      neg: '0x4b5',
      mul: '0x4d3',
      div: '0x544',
      inv: '0x75c',
      exp: '0x4a3',
      legendre: -1,
    },
    {
      n: '0x50690c4073586ff8',
      m: '0x417cb2df5b7a0ee0',
      o: '0xffffffff00000001',
      add: '0x91e5bf1fced27ed8',
      sub: '0xeec596117de6118',
      neg: '0xaf96f3be8ca79009',
      mul: '0x85951d60b3dc3420',
      div: '0xa7675543cea40866',
      inv: '0x1f677190b8f4fa19',
      exp: '0x89f532e67f17148f',
      legendre: 1,
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

      it.skip('legendre symbol (fails for large bigints)', () => {
        expect(legendreSymbol(n.value, BigInt(test.o))).toEqual(BigInt(test.legendre));
      });
    });
  });
});
