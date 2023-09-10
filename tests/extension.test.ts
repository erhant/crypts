import {expect, describe, it} from 'bun:test';
import {FieldExtension, Field} from '../src/fields';

describe('field extensions', () => {
  const tests = [
    {
      p: ['0x2', '0x6', '0x12', '0x13'],
      q: ['0x8', '0x2', '0x8', '0x6'],
      m: ['0x5', '0x13', '0x3', '0x0', '0x1'],
      o: 23,
      add: '2*x^3 + 3*x^2 + 8*x + 10',
      sub: '13*x^3 + 10*x^2 + 4*x + 17',
      neg: '4*x^3 + 5*x^2 + 17*x + 21',
      mul: '16*x^3 + 2*x^2 + 4*x + 15',
      div: '18*x^3 + 7*x^2 + 19*x + 7',
      inv: '14*x^3 + 3*x^2 + 8*x + 7',
      exp: '22*x^3 + x^2 + 19*x + 7',
    },
    {
      p: ['0x61f', '0x21e', '0x856', '0x77f'],
      q: ['0x146', '0x591', '0x96a', '0x7c1'],
      m: ['0x3', '0x89f', '0x2', '0x0', '0x1'],
      o: 2503,
      add: '1401*x^3 + 2041*x^2 + 1967*x + 1893',
      sub: '2437*x^3 + 2227*x^2 + 1620*x + 1241',
      neg: '584*x^3 + 369*x^2 + 1961*x + 936',
      mul: '1982*x^3 + 2366*x^2 + 1874*x + 165',
      div: '1118*x^3 + 647*x^2 + 2033*x + 983',
      inv: '1124*x^3 + 1077*x^2 + 2316*x + 2267',
      exp: '2078*x^3 + 1629*x^2 + 1396*x + 105',
    },
  ];

  tests.map(test => {
    const F = new Field(test.o);
    const m = F.Polynomial(test.m);

    const Fm = new FieldExtension(m);
    const p = Fm.Element(test.p);
    const q = Fm.Element(test.q);

    return describe(`${Fm}: p = ${p}, q = ${q}`, () => {
      it('addition', () => {
        expect(p.add(q).toString()).toEqual(test.add);

        expect(p.neg().toString()).toEqual(test.neg);
        expect(p.sub(q).toString()).toEqual(test.sub);

        expect(p.add(Fm.zero).eq(p)).toBeTruthy();
        expect(p.sub(p).eq(Fm.zero)).toBeTruthy();
      });

      it('multiplication', () => {
        expect(p.mul(q).toString()).toEqual(test.mul);

        expect(p.inv().toString()).toEqual(test.inv);
        expect(p.div(q).toString()).toEqual(test.div);

        expect(p.mul(Fm.one).eq(p)).toBeTruthy();
        expect(p.div(p).eq(Fm.one)).toBeTruthy();
      });

      it('exponentation', () => {
        expect(p.exp(5).toString()).toEqual(test.exp);
      });
    });
  });
});
