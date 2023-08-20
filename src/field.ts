import {randomBytes} from 'crypto';
import {Number} from './common';
import {Felt} from './felt';
import {Polynomial} from './polynomial';
import {AffineShortWeierstrassCurve} from './curves';
import {Extension} from './extension';

// https://github.com/microsoft/TypeScript/issues/30355

/** A finite field. */
export class Field {
  readonly order: number;

  /** A finite field with the given order.
   *
   * To see the elements in the field, you can use the iterator:
   *
   * ```ts
   * const F13 = new Field(13);
   * for (const n of F13) {
   *    console.log(""+n) // or `n.toString()`
   * }
   * ```
   */
  constructor(order: number) {
    this.order = order;
    if (this.order < 2n) {
      throw new Error('Order must be larger than 1.');
    }
  }

  /** A field element in modulo `order`. */
  Felt(n: Number | Felt): Felt {
    return new Felt(this, n instanceof Felt ? n.n : n);
  }

  /** A field extension with an irreducible polynomial with the given coefficients. */
  Extension(coefficients: (Number | Felt)[]) {
    return new Extension(this.Polynomial(coefficients));
  }

  /** A polynomial with coefficients defined over this field, and an optional symbol (defaults to `x`).
   *
   * ```ts
   * const F13 = Field(13);
   * const F13x = F13.Polynomial;
   * const p = F13x([4, 0, 2]);
   * console.log(`${p}`); // 2*x^2 + 4
   * ```
   */
  Polynomial(coefficients: (Number | Felt)[]) {
    return new Polynomial(this, coefficients);
  }

  /** An elliptic curve with this base finite field. */
  AffineShortWeierstrassCurve(params: [a: Number, b: Number]) {
    return new AffineShortWeierstrassCurve(this, params);
  }

  /** Get elements in the field. */
  *[Symbol.iterator]() {
    for (let n = 0n; n < this.order; n++) {
      yield this.Felt(n);
    }
  }

  /** The multiplicative identity. */
  get one(): Felt {
    return this.Felt(1);
  }

  /** The additive identity. */
  get zero(): Felt {
    return this.Felt(0);
  }

  /** Characteristic of this field. */
  get characteristic(): number {
    return this.order;
  }

  /** Returns a random field element. */
  random(): Felt {
    return this.Felt(BigInt('0x' + randomBytes(this.order.toString(8).length).toString('hex')));
  }

  /** Lagrange interpolation in this field. */
  lagrange(points: [Number, Number][]): Polynomial {
    return Polynomial.lagrange(this, points);
  }
}
