import {Number} from './common';
import {Felt} from './element';
import 'colors';

// https://zcash.github.io/halo2/background/polynomials.html

export class Polynomial {
  /** Coefficients in reverse order, i.e. `coeff[i]` stands for the coefficient of `x^i`  */
  readonly coeffs: Felt[];
  readonly order: bigint;
  readonly symbol: string;
  readonly zero: Felt;

  /**
   * Create a polynomial with the provided coefficients within a finite field of given order.
   * If no coefficients are given, it is treated like a zero polynomial.
   *
   * Right-padded zeros are ignored.
   */
  constructor(coeffs: (Number | Felt)[], order: Number, symbol: string) {
    this.order = BigInt(order);
    this.symbol = symbol;
    this.coeffs = coeffs.map(n => (n instanceof Felt ? n : new Felt(n, this.order)));
    this.zero = new Felt(0, this.order);

    // remove padded zeros
    while (this.coeffs.at(-1)?.eq(0)) {
      this.coeffs.pop();
    }
  }

  /** Leading coefficient. */
  get lead(): Felt {
    return this.coeffs.length > 0 ? this.coeffs[this.degree] : this.zero;
  }

  /** Degree of the polynomial, corresponding to the largest power of a term. */
  get degree(): number {
    return Math.max(this.coeffs.length - 1, 0);
  }

  /** Polynomial addition in field. */
  add(q: Polynomial): Polynomial {
    const ans = Array.from({length: 1 + Math.max(this.degree, q.degree)}, (_, i) => {
      const l = this.coeffs.at(i) || this.zero;
      const r = q.coeffs.at(i) || this.zero;
      return l.add(r);
    });

    return new Polynomial(ans, this.order, this.symbol);
  }

  /** Polynomial subtraction in field. */
  sub(q: Polynomial): Polynomial {
    const ans = Array.from({length: 1 + Math.max(this.degree, q.degree)}, (_, i) => {
      const l = this.coeffs.at(i) || this.zero;
      const r = q.coeffs.at(i) || this.zero;
      return l.sub(r);
    });

    return new Polynomial(ans, this.order, this.symbol);
  }

  /** Polynomial multiplication in field. */
  mul(q: Polynomial): Polynomial {
    const ans = Array.from({length: this.degree + q.degree + 1}, () => this.zero);
    this.coeffs.forEach((l, i) => {
      q.coeffs.forEach((r, j) => {
        ans[i + j] = ans[i + j].add(l.mul(r));
      });
    });

    return new Polynomial(ans, this.order, this.symbol);
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
  quotrem(q: Polynomial): [Polynomial, Polynomial] {
    const deg_q = q.degree;
    let deg_p = this.degree;

    let diff = deg_p - deg_q;
    if (diff < 0) {
      throw new Error('Cant divide with a polynomial of higher degree.');
    }

    const quot = Array.from({length: diff + 1}, () => this.zero);
    const rem = this.coeffs.slice();

    for (let p = quot.length - 1; diff >= 0; diff--, deg_p--, p--) {
      quot[p] = rem[deg_p].div(q.lead);

      // subtract the newly obtained (quotient * q) from our polynomial
      // effectively getting rid of current degree
      q.coeffs.forEach((q_i, i) => {
        rem[diff + i] = rem[diff + i].sub(q_i.mul(quot[p]));
      });
    }

    return [new Polynomial(quot, this.order, this.symbol), new Polynomial(rem, this.order, this.symbol)];
  }

  /** Multiply all coefficients with a scalar. */
  scale(s: Number | Felt): Polynomial {
    return new Polynomial(
      this.coeffs.map(c => c.mul(s)),
      this.order,
      this.symbol
    );
  }

  /** Equality check with a polynomial or an array of coefficients. */
  eq(q: Polynomial | Number[]): boolean {
    // TODO: allow checks with padded zeros and stuff
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

  /** Evaluate polynomial at `x` via [Horner's rule](https://zcash.github.io/halo2/background/polynomials.html#aside-horners-rule). */
  eval(x: Number | Felt): Felt {
    return this.coeffs.length > 0
      ? this.coeffs
          .slice(1)
          .reduceRight((ans, cur) => ans.add(cur.mul(x)), this.zero)
          .add(this.coeffs[0])
      : this.zero;
  }

  toString(): string {
    return this.coeffs
      .map((a_i, i) => {
        if (a_i.eq(0)) {
          return '';
        }

        if (i === 0) {
          return `${a_i}`;
        } else if (i === 1) {
          return `${a_i}*${this.symbol.blue}`;
        } else {
          return `${a_i}*${this.symbol.blue}^${i}`;
        }
      })
      .filter(s => s !== '')
      .reverse()
      .join(' + ');
  }
}
