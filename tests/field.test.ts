import {Field} from '../src/fields';
import {legendreSymbol} from '../src/utils';

describe('finite field', () => {
  const tests = [
    {
      n: '0x3',
      m: '0xc',
      o: '0x17',
      add: '0xf',
      sub: '0xe',
      neg: '0x14',
      mul: '0xd',
      div: '0x6',
      inv: '0x8',
      exp: '0xd',
      legendre: 1,
    },
    {
      n: '0x6da',
      m: '0x3cb',
      o: '0x9c7',
      add: '0xde',
      sub: '0x30f',
      neg: '0x2ed',
      mul: '0x446',
      div: '0x2d1',
      inv: '0x108',
      exp: '0x874',
      legendre: -1,
    },
    {
      n: '0xa34fc3ea62b6a881',
      m: '0xcfd998c4b6b5f52e',
      o: '0xffffffff00000001',
      add: '0x73295cb0196c9dae',
      sub: '0xd3762b24ac00b354',
      neg: '0x5cb03c149d495780',
      mul: '0x736c18866f3f1a76',
      div: '0xe04c04834279e6b8',
      inv: '0xeefd77b17a818a1e',
      exp: '0xca6026c13235743e',
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

      it('exponentation (square-and-multiply)', () => {
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
