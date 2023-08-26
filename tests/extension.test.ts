import {FieldExtension, Field} from '../src/fields';

describe('field extension', () => {
  const tests = [
    {
      p: [0, 2],
      q: [1, 2],
      m: [1, 0, 1],
      o: 3,
      add: 'x + 1',
      sub: '2',
      neg: 'x',
      mul: '2*x + 2',
      div: 'x + 2',
      inv: 'x',
      exp: '2*x',
    },
    {
      p: [1, 0, 11],
      q: [1, 2, 3],
      m: [7, 0, 9, 1],
      o: 13,
      add: 'x^2 + 2*x + 2',
      sub: '8*x^2 + 11*x',
      neg: '2*x^2 + 12',
      mul: '6*x^2 + 5*x + 2',
      div: '5*x^2 + 5*x + 11',
      inv: '6*x^2 + 7*x + 9',
      exp: 'x^2 + 4*x + 4',
    },
  ];

  tests.map(test => {
    const F = new Field(test.o);
    const m = F.Polynomial(test.m);

    const Fm = new FieldExtension(m);
    const p = Fm.Element(test.p);
    const q = Fm.Element(test.q);

    return describe(`${Fm}: p = ${p}, q = ${q}`, () => {
      it('additive operations', () => {
        expect(p.add(q).toString()).toEqual(test.add);

        expect(p.neg().toString()).toEqual(test.neg);
        expect(p.sub(q).toString()).toEqual(test.sub);

        expect(p.add(Fm.zero).eq(p)).toBeTruthy();
        expect(p.sub(p).eq(Fm.zero)).toBeTruthy();
      });

      it('multiplicative operations', () => {
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
