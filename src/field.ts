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

    ['Symbol']() {}
    /** Iterator for the elements in the group. */
    static *[Symbol.iterator]() {
      for (let n = 0n; n < BigInt(order); n++) {
        yield new Felt(n, order);
      }
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

        /** Compute the Lagrange interpolated polynomial for the given pairs of points. */
        static lagrange(points: [Number, Number][]): Polynomial {
          const ps = points.map(p => [new Felt(p[0], order), new Felt(p[1], order)]);
          const n = points.length;

          // compute basis
          const basis = Array.from({length: n}, () => new Polynomial([1], order, symbol));
          for (let i = 0; i < n; ++i) {
            for (let j = 0; j < n; ++j) {
              if (i !== j) {
                basis[i] = basis[i].mul(new Polynomial([ps[j][0].neg(), 1], order, symbol));
                basis[i] = basis[i].div(new Polynomial([ps[i][0].sub(ps[j][0])], order, symbol));
              }
            }
          }

          // interpolate
          let p = new Polynomial([0], order, symbol);
          for (let i = 0; i < n; ++i) {
            p = p.add(basis[i].scale(ps[i][1]));
          }

          return p;
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

        static toString(): string {
          return `${'y'.green}^2 = ${'x'.blue}^3 + ${a}*${'x'.blue} + ${b}`;
        }
      };
    }
  };
}
