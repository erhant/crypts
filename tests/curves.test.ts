import {expect, describe, it} from 'bun:test';
import {Field} from '../src/fields';
import {MontgomeryCurve, ShortWeierstrassCurve} from '../src/curves';

const tests = [
  {
    o: '0xd',
    sw: {
      p: ['0x9', '0x4'],
      q: ['0xc', '0x8'],
      params: [8, 8],
      double: '(5, 11)',
      scale: '(6, 5)',
      add: '(1, 11)',
      sub: '(8, 5)',
      neg: '(9, 9)',
    },
    mont: {
      p: ['0x9', '0x2'],
      q: ['0x4', '0x4'],
      params: [6, 7],
      double: '(7, 12)',
      add: '(5, 12)',
      sub: '(2, 9)',
      neg: '(9, 11)',
    },
  },
];

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
    });
  });
});

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
