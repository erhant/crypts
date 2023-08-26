import {Field} from '../src/fields';
import {interpolate} from '../src/utils';

describe('polynomials', () => {
  const tests = [
    {
      p: [1, 2, 3],
      q: [3, 2, 1],
      o: 5,
      lead: 3,
      deg: 2,
      add: '4*x^2 + 4*x + 4',
      sub: '2*x^2 + 3',
      mul: '3*x^4 + 3*x^3 + 4*x^2 + 3*x + 3',
      div: '3',
      mod: 'x + 2',
      neg: '2*x^2 + 3*x + 4',
    },
    {
      p: [1, 6, 7],
      q: [2, 3],
      o: 17,
      lead: 7,
      deg: 2,
      add: '7*x^2 + 9*x + 3',
      sub: '7*x^2 + 3*x + 16',
      mul: '4*x^3 + 15*x^2 + 15*x + 2',
      div: '8*x + 8',
      mod: '2',
      neg: '10*x^2 + 11*x + 16',
    },
  ];

  tests.map(test => {
    const F = new Field(test.o);
    const p = F.Polynomial(test.p);
    const q = F.Polynomial(test.q);

    return describe(`${F}: p = ${p}, q = ${q}`, () => {
      it('lead & degree', () => {
        expect(p.lead).toBe(BigInt(test.lead));
        expect(p.degree).toBe(test.deg);
      });

      it('addition & multiplication', () => {
        expect(p.add(q).toString()).toEqual(test.add);
        expect(p.sub(q).toString()).toEqual(test.sub);
        expect(p.mul(q).toString()).toEqual(test.mul);
        expect(p.neg().toString()).toEqual(test.neg);
      });

      it('division & remainder', () => {
        expect(p.div(q).toString()).toEqual(test.div);
        expect(p.mod(q).toString()).toEqual(test.mod);
      });
    });
  });
});

describe('lagrange interpolation', () => {
  const points: [number, number][] = [
    [0, 4],
    [-2, 1],
    [2, 3],
  ];
  const l = interpolate(new Field(13), points);

  it('should interpolate correctly', () => {
    expect(l.eq([4, 7, 6])).toBeTruthy();
  });

  it('should evaluate correctly', () => {
    for (const p of points) {
      expect(l.eval(p[0]).eq(p[1])).toBeTruthy();
    }
  });
});

describe('zero polynomial', () => {
  const F = new Field(13);
  const zero = F.Polynomial([]);

  it('should be equal to an only-zero-padded polynomial', () => {
    expect(zero.eq(F.Polynomial([0, 0, 0]))).toBeTruthy();
  });

  it('should evaluate to zero', () => {
    expect(zero.eval(zero.field.random()).eq(0));
  });
});
