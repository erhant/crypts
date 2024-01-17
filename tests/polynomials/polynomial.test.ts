import {expect, describe, it} from 'bun:test';
import {Field} from '~/fields';
import {Polynomial, interpolate} from '~/polynomials';

describe('polynomials', () => {
  const tests = [
    {
      p: ['0xf', '0xc', '0x10', '0x11', '0xa', '0x12'],
      q: ['0xd', '0x16', '0x10', '0x2'],
      o: '0x17',
      lead: '0x12',
      deg: 5,
      add: '18*x^5 + 10*x^4 + 19*x^3 + 9*x^2 + 11*x + 5',
      sub: '18*x^5 + 10*x^4 + 15*x^3 + 13*x + 2',
      mul: '13*x^8 + 9*x^7 + 15*x^6 + 22*x^5 + 2*x^4 + 13*x^3 + 22*x^2 + 3*x + 11',
      divpq: '9*x^2 + 2*x + 20',
      modpq: '18*x^2 + 6*x + 8',
      divqp: '0',
      modqp: '2*x^3 + 16*x^2 + 22*x + 13',
      neg: '5*x^5 + 13*x^4 + 6*x^3 + 7*x^2 + 11*x + 8',
    },
    {
      p: ['0x8a', '0x7b8', '0x57d', '0xed', '0x939', '0x24', '0x316'],
      q: ['0x90f', '0x1e7', '0x22b'],
      o: '0x9c7',
      lead: '0x316',
      deg: 6,
      add: '790*x^6 + 36*x^5 + 2361*x^4 + 237*x^3 + 1960*x^2 + 2463*x + 2457',
      sub: '790*x^6 + 36*x^5 + 2361*x^4 + 237*x^3 + 850*x^2 + 1489*x + 322',
      mul: '425*x^8 + 1727*x^7 + 1111*x^6 + 691*x^5 + 218*x^4 + 225*x^3 + 1949*x^2 + 1479*x + 2141',
      divpq: '1174*x^4 + 1288*x^3 + 2321*x^2 + 2116*x + 611',
      modpq: '1152*x + 2430',
      divqp: '0',
      modqp: '555*x^2 + 487*x + 2319',
      neg: '1713*x^6 + 2467*x^5 + 142*x^4 + 2266*x^3 + 1098*x^2 + 527*x + 2365',
    },
  ];

  tests.map(test => {
    const F = new Field(test.o);
    const p = new Polynomial(F, test.p);
    const q = new Polynomial(F, test.q);

    return describe(`${F}: p = ${p}, q = ${q}`, () => {
      it('lead & degree', () => {
        expect(p.lead).toEqual(BigInt(test.lead));
        expect(p.degree).toEqual(test.deg);
      });

      it('addition & multiplication', () => {
        expect(p.add(q).toString()).toEqual(test.add);
        expect(p.sub(q).toString()).toEqual(test.sub);
        expect(p.mul(q).toString()).toEqual(test.mul);
        expect(p.neg().toString()).toEqual(test.neg);
      });

      it('division & remainder', () => {
        expect(p.div(q).toString()).toEqual(test.divpq);
        expect(p.mod(q).toString()).toEqual(test.modpq);

        expect(q.div(p).toString()).toEqual(test.divqp);
        expect(q.mod(p).toString()).toEqual(test.modqp);
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
  const zero = new Polynomial(F, []);

  it('should be equal to an only-zero-padded polynomial', () => {
    expect(zero.eq(new Polynomial(F, [0, 0, 0]))).toBeTruthy();
  });

  it('should evaluate to zero on random points', () => {
    expect(zero.eval(F.random()).eq(0));
    expect(zero.eval(F.random()).eq(0));
    expect(zero.eval(F.random()).eq(0));
  });
});
