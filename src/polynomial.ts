import {Number} from './common';
import {Felt} from './felt';
import {Field} from './field';

// https://zcash.github.io/halo2/background/polynomials.html

/** A polynomial. */
export class Polynomial {
  readonly field: Field;
  /** Coefficients in reverse order, i.e. `coeff[i]` stands for the coefficient of `x^i`  */
  readonly coeffs: Felt[];

  /**
   * Create a polynomial with the provided coefficients within a finite field of given order.
   * If no coefficients are given, it is treated like a zero polynomial.
   *
   * Right-padded zeros are ignored.
   */
  constructor(field: Field, coefficients: (Number | Felt)[]) {
    this.field = field;
    this.coeffs = coefficients.map(n => (n instanceof Felt ? n : new Felt(this.field, n)));

    // remove right-padded zeros
    while (this.coeffs.at(-1)?.eq(0)) {
      this.coeffs.pop();
    }
  }

  /** Leading coefficient. */
  get lead(): Felt {
    return this.coeffs.at(this.degree) || this.field.zero;
  }

  /** Degree of the polynomial, corresponding to the largest power of a term. */
  get degree(): number {
    return Math.max(this.coeffs.length - 1, 0);
  }

  /** Polynomial addition in field. */
  add(q: Polynomial): Polynomial {
    const ans = Array.from({length: 1 + Math.max(this.degree, q.degree)}, (_, i) => {
      const l = this.coeffs.at(i) || this.field.zero;
      const r = q.coeffs.at(i) || this.field.zero;
      return l.add(r);
    });

    return new Polynomial(this.field, ans);
  }

  /** Polynomial subtraction in field. */
  sub(q: Polynomial): Polynomial {
    const ans = Array.from({length: 1 + Math.max(this.degree, q.degree)}, (_, i) => {
      const l = this.coeffs.at(i) || this.field.zero;
      const r = q.coeffs.at(i) || this.field.zero;
      return l.sub(r);
    });

    return new Polynomial(this.field, ans);
  }

  /** Polynomial multiplication in field. */
  mul(q: Polynomial): Polynomial {
    const ans = Array.from({length: this.degree + q.degree + 1}, () => this.field.zero);
    this.coeffs.forEach((l, i) => {
      q.coeffs.forEach((r, j) => {
        ans[i + j] = ans[i + j].add(l.mul(r));
      });
    });

    return new Polynomial(this.field, ans);
  }

  /** Quotient after polynomial long-division in field. */
  div(q: Polynomial): Polynomial {
    return this.quotrem(q)[0];
  }

  /** Remainder after polynomial long-division in field. */
  rem(q: Polynomial): Polynomial {
    return this.quotrem(q)[1];
  }

  /** Polynomial long-division in field, returns the quotient and remainder. */
  quotrem(q: Polynomial): [quotient: Polynomial, remainder: Polynomial] {
    const deg_q = q.degree;
    let deg_p = this.degree;

    let diff = deg_p - deg_q;
    if (diff < 0) {
      throw new Error('Cant divide with a polynomial of higher degree.');
    }

    const quot = Array.from({length: diff + 1}, () => this.field.zero);
    const rem = this.coeffs.slice();

    for (let p = quot.length - 1; diff >= 0; diff--, deg_p--, p--) {
      quot[p] = rem[deg_p].div(q.lead);

      // subtract the newly obtained (quotient * q) from our polynomial
      // effectively getting rid of current degree
      q.coeffs.forEach((q_i, i) => {
        rem[diff + i] = rem[diff + i].sub(q_i.mul(quot[p]));
      });
    }

    return [new Polynomial(this.field, quot), new Polynomial(this.field, rem)];
  }

  /** Multiply all coefficients with a scalar. */
  scale(s: Number | Felt): Polynomial {
    return new Polynomial(
      this.field,
      this.coeffs.map(c => c.mul(s))
    );
  }

  /** Equality check with a polynomial or an array of coefficients. */
  eq(q: Polynomial | Number[]): boolean {
    const coeffs = q instanceof Polynomial ? q.coeffs : q;

    if (this.coeffs.length !== coeffs.length) {
      return false;
    }

    for (let i = 0; i < this.coeffs.length; ++i) {
      if (!this.coeffs[i].eq(coeffs[i])) {
        return false;
      }
    }

    return true;
  }

  /** Evaluate polynomial at the given point via [Horner's rule](https://zcash.github.io/halo2/background/polynomials.html#aside-horners-rule). */
  eval(p: Number | Felt): Felt {
    return this.coeffs.reduceRight((ans, cur) => cur.add(ans.mul(p)), this.field.zero);
  }

  /** Returns a string representation of the polynomial with optional symbol in place of `x`. */
  toString(symbol = 'x'): string {
    return this.coeffs
      .map((a_i, i) => {
        if (a_i.eq(0)) {
          return '';
        }

        if (i === 0) {
          return `${a_i}`;
        } else if (i === 1) {
          return `${a_i}*${symbol}`;
        } else {
          return `${a_i}*${symbol}^${i}`;
        }
      })
      .filter(s => s !== '')
      .reverse()
      .join(' + ');
  }

  /** Lagrange interpolation in a given field. */
  static lagrange(field: Field, points: [Number, Number][]): Polynomial {
    const ps = points.map(p => [field.Felt(p[0]), field.Felt(p[1])]);
    const n = points.length;

    // compute basis
    const basis = Array.from({length: n}, () => field.Polynomial([1]));
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        if (i !== j) {
          basis[i] = basis[i].mul(field.Polynomial([ps[j][0].neg(), 1]));
          basis[i] = basis[i].div(field.Polynomial([ps[i][0].sub(ps[j][0])]));
        }
      }
    }

    // interpolate
    let p = field.Polynomial([0]);
    for (let i = 0; i < n; ++i) {
      p = p.add(basis[i].scale(ps[i][1]));
    }

    return p;
  }
}
