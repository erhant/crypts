import {Number} from './common';

export class Felt {
  readonly order: bigint;
  readonly n: bigint;

  constructor(n: Number, p: Number) {
    this.order = BigInt(p);
    this.n = BigInt(n) % this.order;
    if (this.n < 0n) {
      this.n += this.order;
    }
  }

  /** Convert to an element in the field. */
  into(n: Number | Felt): Felt {
    return new Felt(n instanceof Felt ? n.n : n, this.order);
  }

  /** Equality check with a field elements or number. */
  eq(n: Number | Felt): boolean {
    return this.n === this.into(n).n;
  }

  /** Addition in the field. */
  add(n: Number | Felt): Felt {
    return new Felt(this.n + this.into(n).n, this.order);
  }

  /** Addition with additive inverse in the field. */
  sub(n: Number | Felt): Felt {
    return new Felt(this.n + this.into(n).neg().n, this.order);
  }

  /** Multiplication in the field. */
  mul(n: Number | Felt): Felt {
    return new Felt(this.n * this.into(n).n, this.order);
  }

  /** Multiplication with multiplicative inverse in the field. */
  div(n: Number | Felt): Felt {
    return new Felt(this.n * this.into(n).inv().n, this.order);
  }

  exp(n: Number): Felt {
    // TODO ?
    return new Felt(this.n ** BigInt(n), this.order);
  }

  /** Sign in the field, `true` for positive. */
  sign(): boolean {
    return this.n < this.order / 2n;
  }

  /** Additive inverse in the field. */
  neg(): Felt {
    return new Felt(this.order - this.n, this.order);
  }

  /** Multiplicative inverse in the field, using Extended Euclidean Algorithm. */
  inv(): Felt {
    let low = this.n;

    // 0 has no inverse, just return 0 (TODO: or error?)
    if (low === 0n) {
      return new Felt(0, this.order);
    }

    let lm = 1n;
    let hm = 0n;
    let high = this.order;

    while (low > 1n) {
      const r = high / low;
      const nm = hm - lm * r;
      const nw = high - low * r;

      high = low;
      hm = lm;
      lm = nm;
      low = nw;
    }
    return new Felt(lm, this.order);
  }

  /** Computes the Legendre Symbol, assuming odd prime order.
   *
   * - `0`: number is zero
   * - `1`: number is quadratic residue
   * - `-1`: number is quadratic non-residue
   */
  legendre(): 0n | 1n | -1n {
    const l = this.exp((this.order - 1n) / 2n);
    if (l.eq(this.order - 1n)) {
      return -1n;
    } else {
      return l.n as 0n | 1n;
    }
  }

  /** Is number a quadratic residue in field? */
  isQuadraticResidue(): boolean {
    return this.legendre() !== -1n;
  }

  /** String representation of the field element, with optional radix. */
  toString(radix?: number): string {
    return this.n.toString(radix);
  }
}
