import {Number} from './common';
import {Felt} from './element';
import 'colors';

// https://zcash.github.io/halo2/background/polynomials.html

export class Polynomial {
  // c_i = coeff[i] stands for c_i * x^i
  readonly coeffs: Felt[];
  readonly order: bigint;
  readonly symbol: string;
  readonly degree: number;
  readonly zero: Felt;

  constructor(coeffs: (Number | Felt)[], order: Number, symbol: string) {
    if (coeffs.length === 0) {
      throw new Error('No coefficients given.');
    }

    this.order = BigInt(order);

    this.symbol = symbol;
    this.coeffs = coeffs.map(n => (n instanceof Felt ? n : new Felt(n, this.order)));
    this.degree = this.coeffs.length - 1;
    this.zero = new Felt(0, this.order);
  }

  /** Leading coefficient along with its index. */
  get lead(): [Felt, number] {
    const i = this.coeffs.length - 1;
    return [this.coeffs[i], i];
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

  /** Polynomial long-division in field. */
  div(q: Polynomial): Polynomial {
    const P = this.coeffs.slice();
    const Q = q.coeffs.slice();
    const deg_q = q.degree;
    let deg_p = this.degree;

    if (deg_q > deg_p) {
      throw new Error('Cant divide with a polynomial of higher degree.');
    }

    let diff = deg_p - deg_q;
    const R = Array.from({length: diff + 1}, () => this.zero);

    for (let p = R.length - 1; diff >= 0; diff--, deg_p--, p--) {
      const quot = P[deg_p].div(Q[deg_q]);
      R[p] = quot;
      for (let i = deg_q; i >= 0; i--) {
        P[diff + i] = P[diff + i].sub(Q[i].mul(quot));
      }
    }

    return new Polynomial(R, this.order, this.symbol);
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
    return this.coeffs
      .slice(1)
      .reduceRight((ans, cur) => ans.add(cur.mul(x)), this.zero)
      .add(this.coeffs[0]);
  }

  valueOf(): bigint[] {
    return this.coeffs.map(c => c.n);
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
