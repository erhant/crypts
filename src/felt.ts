import {Number} from './common';
import {Field} from './field';

/** An element in the finite field. */
export class Felt {
  readonly field: Field;
  readonly n: bigint;

  constructor(field: Field, number: Number) {
    this.field = field;
    this.n = BigInt(number) % BigInt(field.order);
    if (this.n < 0n) {
      this.n += BigInt(field.order);
    }
  }

  /** Convert to an element in the field. */
  into(n: Number | Felt): Felt {
    return new Felt(this.field, n instanceof Felt ? n.n : n);
  }

  /** Equality check with a field elements or number. */
  eq(n: Number | Felt): boolean {
    return this.n === this.into(n).n;
  }

  /** Addition in the field. */
  add(n: Number | Felt): Felt {
    return new Felt(this.field, this.n + this.into(n).n);
  }

  /** Addition with additive inverse in the field. */
  sub(n: Number | Felt): Felt {
    return new Felt(this.field, this.n + this.into(n).neg().n);
  }

  /** Multiplication in the field. */
  mul(n: Number | Felt): Felt {
    return new Felt(this.field, this.n * this.into(n).n);
  }

  /** Multiplication with multiplicative inverse in the field. */
  div(n: Number | Felt): Felt {
    return new Felt(this.field, this.n * this.into(n).inv().n);
  }

  // TODO ?
  exp(n: Number): Felt {
    return new Felt(this.field, this.n ** BigInt(n));
  }

  /** Additive inverse in the field. */
  neg(): Felt {
    return new Felt(this.field, BigInt(this.field.order) - this.n);
  }

  /** Sign in the field, `true` for positive. */
  sign(): boolean {
    return this.n < BigInt(this.field.order) / 2n;
  }

  /** Multiplicative inverse in the field, using Extended Euclidean Algorithm. */
  inv(): Felt {
    let low = this.n;

    // 0 has no inverse, just return 0 (TODO: or error?)
    if (low === 0n) {
      return this.field.zero;
    }

    let lm = 1n;
    let hm = 0n;
    let high = BigInt(this.field.order);

    while (low > 1n) {
      const r = high / low;
      const nm = hm - lm * r;
      const nw = high - low * r;

      high = low;
      hm = lm;
      lm = nm;
      low = nw;
    }
    return new Felt(this.field, lm);
  }

  /** Computes the Legendre Symbol, assuming odd prime order.
   *
   * - `0`: number is zero
   * - `1`: number is quadratic residue
   * - `-1`: number is quadratic non-residue
   */
  legendre(): 0n | 1n | -1n {
    const last = BigInt(this.field.order - 1);

    // l := n ^ (p-1)/2
    const l = this.exp(last / 2n);
    if (l.eq(last)) {
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
