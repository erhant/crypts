import {expect, describe, it} from 'bun:test';
import {FieldExtension, Field} from '../../src/fields';
import {Polynomial} from '../../src';
import tests from '../data/extension.json';

tests satisfies {
  p: string[];
  q: string[];
  m: string[];
  o: number;
  add: string;
  sub: string;
  neg: string;
  mul: string;
  div: string;
  inv: string;
  exp: string;
}[];

describe('field extension', () => {
  tests.map(test => {
    const F = new Field(test.o);
    const m = new Polynomial(F, test.m);

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
