import {Field} from '../fields';

/** A univariate polynomial over a finite field, with coefficients as elements of that field. */
export class Polynomial {
  /** Field of the coefficients. */
  readonly field: Field;
  /** Coefficients in reverse order, i.e. `coeff[i]` stands for the coefficient of `x^i`  */
  readonly coeffs: Field.Element[];
  /** Leading coefficient. */
  readonly lead: bigint;
  /** Degree of the polynomial, corresponding to the largest power of a term. */
  readonly degree: number;

  /**
   * Create a polynomial with the provided coefficients within a finite field of given order.
   * If no coefficients are given, it is treated like a zero polynomial.
   *
   * Right-padded zeros are ignored.
   */
  constructor(field: Field, coefficients: Field.Input[]) {
    this.field = field;
    this.coeffs = coefficients.map(c => field.Element(c));

    // remove right-padded zeros
    while (this.coeffs.at(-1)?.isZero()) {
      this.coeffs.pop();
    }

    this.degree = Math.max(this.coeffs.length - 1, 0);
    this.lead = (this.coeffs.at(this.degree) ?? this.field.zero).value;
  }

  static random(field: Field, degree: number): Polynomial {
    return new Polynomial(
      field,
      Array.from({length: degree}, () => field.random())
    );
  }

  /** Polynomial addition in field. */
  add(q: Polynomial): Polynomial {
    const ans = Array.from({length: 1 + Math.max(this.degree, q.degree)}, (_, i) => {
      const l = this.coeffs.at(i) ?? this.field.zero;
      const r = q.coeffs.at(i) ?? this.field.zero;
      return l.add(r);
    });

    return new Polynomial(this.field, ans);
  }

  /** Polynomial subtraction in field. */
  sub(q: Polynomial): Polynomial {
    const ans = Array.from({length: 1 + Math.max(this.degree, q.degree)}, (_, i) => {
      const l = this.coeffs.at(i) ?? this.field.zero;
      const r = q.coeffs.at(i) ?? this.field.zero;
      return l.sub(r);
    });

    return new Polynomial(this.field, ans);
  }

  /** Additive inverse of this polynomial. */
  neg(): Polynomial {
    return new Polynomial(
      this.field,
      this.coeffs.map(c => c.neg())
    );
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
    return this.quorem(q)[0];
  }

  /** Remainder after polynomial long-division in field. */
  mod(q: Polynomial): Polynomial {
    return this.quorem(q)[1];
  }

  /** Polynomial long-division in field, returns the quotient and remainder. */
  quorem(q: Polynomial): [quotient: Polynomial, remainder: Polynomial] {
    const deg_q = q.degree;
    let deg_p = this.degree;
    let diff = deg_p - deg_q;

    const rem = this.coeffs.slice();
    const quot = diff < 0 ? [] : Array.from({length: diff + 1}, () => this.field.zero);

    // if difference is negative, we return a zero quotient and remainder is the dividend polynomial itself
    // otherwise, we can continue with the long-division logic
    if (diff >= 0) {
      for (let p = quot.length - 1; diff >= 0; diff--, deg_p--, p--) {
        quot[p] = rem[deg_p].div(q.lead);

        // subtract the newly obtained (quotient * q) from our polynomial
        // effectively getting rid of current degree
        q.coeffs.forEach((q_i, i) => {
          rem[diff + i] = rem[diff + i].sub(q_i.mul(quot[p]));
        });
      }
    }

    return [new Polynomial(this.field, quot), new Polynomial(this.field, rem)];
  }

  /** Multiply all coefficients with a scalar. */
  scale(s: Field.Input): Polynomial {
    return new Polynomial(
      this.field,
      this.coeffs.map(c => c.mul(s))
    );
  }

  /** Equality check with a polynomial or an array of coefficients. */
  eq(q: Polynomial | Field.Input[]): boolean {
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
  eval(p: Field.Input): Field.Element {
    return this.coeffs.reduceRight((ans, cur) => cur.add(ans.mul(p)), this.field.zero);
  }

  /** Returns a string representation of the polynomial with optional symbol in place of `x`. */
  toString(symbol = 'x'): string {
    const coeffs = this.coeffs
      .map((a_i, i) => {
        // coefficient is zero
        if (a_i.isZero()) return null;
        // constant term (x^0)
        if (i === 0) return `${a_i}`;
        // coefficient of x^1
        if (i === 1) return a_i.eq(1) ? `${symbol}` : `${a_i}*${symbol}`;
        // coefficient of x^i for i > 1
        return a_i.eq(1) ? `${symbol}^${i}` : `${a_i}*${symbol}^${i}`;
      })
      .filter((s): s is string => s !== null);
    return coeffs.length === 0 ? '0' : coeffs.reverse().join(' + ');
  }
}
