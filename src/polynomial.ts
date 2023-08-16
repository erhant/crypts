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

  add(q: Polynomial): Polynomial {
    const ans = Array.from({length: 1 + Math.max(this.degree, q.degree)}, (_, i) => {
      const l = this.coeffs.at(i) || this.zero;
      const r = q.coeffs.at(i) || this.zero;
      return l.add(r);
    });

    return new Polynomial(ans, this.order, this.symbol);
  }

  sub(q: Polynomial): Polynomial {
    const ans = Array.from({length: 1 + Math.max(this.degree, q.degree)}, (_, i) => {
      const l = this.coeffs.at(i) || this.zero;
      const r = q.coeffs.at(i) || this.zero;
      return l.sub(r);
    });

    return new Polynomial(ans, this.order, this.symbol);
  }

  mul(q: Polynomial): Polynomial {
    const ans = Array.from({length: this.degree + q.degree + 1}, () => this.zero);
    this.coeffs.forEach((a, i) => {
      q.coeffs.forEach((b, j) => {
        ans[i + j] = ans[i + j].add(a.mul(b));
      });
    });

    return new Polynomial(ans, this.order, this.symbol);
  }

  div(q: Polynomial): Polynomial {
    if (q.degree > this.degree) {
      throw new Error('Cant divide with a polynomial of higher degree.');
    }
    const ans = Array.from({length: this.degree - q.degree + 1}, () => this.zero);

    return new Polynomial(ans, this.order, this.symbol);
  }

  scale(s: Number | Felt): Polynomial {
    return new Polynomial(
      this.coeffs.map(c => c.mul(s)),
      this.order,
      this.symbol
    );
  }

  // horners method
  eval(x: Number | Felt): Felt {
    return this.coeffs
      .slice(1)
      .reduceRight((ans, cur) => ans.add(cur.mul(x)), this.zero)
      .add(this.coeffs[0]);
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
