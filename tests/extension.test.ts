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
      mul: '2*x + 2',
      div: 'x + 2',
      neg: 'x',
      inv: 'x',
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
      });

      it('subtraction', () => {
        expect(p.sub(q).toString()).toEqual(test.sub);
      });

      it('multiplication', () => {
        expect(p.mul(q).toString()).toEqual(test.mul);
      });

      it('division', () => {
        expect(p.div(q).toString()).toEqual(test.div);
      });

      it('negation', () => {
        expect(p.neg().toString()).toEqual(test.neg);
      });

      it('inverse', () => {
        expect(p.inv().toString()).toEqual(test.inv);
      });
    });
  });
});
