import {expect, describe, test} from 'bun:test';
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
  tests.map(t => {
    const F = new Field(t.o);
    const m = new Polynomial(F, t.m);

    const Fm = new FieldExtension(m);
    const p = Fm.Element(t.p);
    const q = Fm.Element(t.q);

    return describe(`${Fm}: p = ${p}, q = ${q}`, () => {
      test('addition', () => {
        expect(p.add(q).toString()).toEqual(t.add);

        expect(p.neg().toString()).toEqual(t.neg);
        expect(p.sub(q).toString()).toEqual(t.sub);

        expect(p.add(Fm.zero).eq(p)).toBeTruthy();
        expect(p.sub(p).eq(Fm.zero)).toBeTruthy();
      });

      test('multiplication', () => {
        expect(p.mul(q).toString()).toEqual(t.mul);

        expect(p.inv().toString()).toEqual(t.inv);
        expect(p.div(q).toString()).toEqual(t.div);

        expect(p.mul(Fm.one).eq(p)).toBeTruthy();
        expect(p.div(p).eq(Fm.one)).toBeTruthy();
      });

      test('exponentation', () => {
        expect(p.exp(5).toString()).toEqual(t.exp);
      });
    });
  });
});
