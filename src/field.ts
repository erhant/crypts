import {randomBytes} from 'crypto';
import {Number} from './common';
import {Felt} from './element';
import {Polynomial} from './polynomial';
import {EllipticCurve} from './curve';

// https://github.com/microsoft/TypeScript/issues/30355

/** Creates a field with given order.
 * It is better if you provide a prime number for things to work smoothly.
 */
export function Field(order: Number) {
  if (BigInt(order) < 2n) {
    throw new Error('Order must be larger than 1.');
  }

  return class extends Felt {
    /** Creates a field element. */
    constructor(n: Number) {
      super(n, order);
    }

    /** The multiplicative identity. */
    static get one(): Felt {
      return new this(1);
    }

    /** The additive identity. */
    static get zero(): Felt {
      return new this(0);
    }

    /** Returns a random field element. */
    static random(): Felt {
      return new Felt(BigInt('0x' + randomBytes(order.toString(8).length).toString('hex')), order);
    }

    /** A polynomial with coefficients defined over this field, and an optional symbol (defaults to `x`).
     *
     * ```ts
     * const F13 = Field(13);
     * const F13x = F13.Polynomial();
     * const p = new F13x([4, 0, 2]);
     * console.log(`${p}`); // 2*x^2 + 4
     * ```
     */
    static Polynomial(symbol = 'x') {
      return class extends Polynomial {
        constructor(coeffs: (Number | Felt)[]) {
          super(coeffs, order, symbol);
        }
      };
    }

    /**
     * An elliptic curve over this base field such that pairs of elements `(x, y)` satisfy
     * the Affine Short Weierstrass curve equation:
     *
     * ```py
     * y^2 = x^3 + ax + b
     * ```
     */
    static EllipticCurve(a: Number, b: Number) {
      return class extends EllipticCurve {
        constructor(x: Number, y: Number) {
          super(x, y, [a, b], order);
        }
      };
    }
  };
}
