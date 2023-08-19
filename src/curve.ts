import {Number} from './common';
import {Felt} from './element';
import 'colors';

// https://zcash.github.io/halo2/background/curves.html

// random point https://crypto.stackexchange.com/questions/68601/generating-a-random-point-on-an-elliptic-curve-over-a-finite-field

export class EllipticCurve {
  // curve parameters
  readonly a: bigint;
  readonly b: bigint;
  readonly p: bigint;
  // point
  readonly x: bigint;
  readonly y: bigint;

  /** Creates an elliptic curve in Affine Short Weierstrass form with the given order of base field.
   *
   * ```py
   * y^2 = x^3 + ax + b
   * ```
   */
  constructor(x: Number, y: Number, params: [Number, Number], order: Number) {
    /** Curve parameter `a`. */
    this.a = BigInt(params[0]);
    /** Curve parameter `b`. */
    this.b = BigInt(params[1]);
    /** Order of the base field. */
    this.p = BigInt(order);

    this.x = BigInt(x);
    this.y = BigInt(y);

    if (!this.isOnCurve(x, y)) {
      throw new Error(`(${x}, ${y}) not on this curve.`);
    }
  }

  /** Returns `true` if given point `(x, y)` is on the curve, i.e. satisfies the curve equation. */
  isOnCurve(x: Number, y: Number): boolean {
    x = BigInt(x);
    y = BigInt(y);
    const lhs = (y * y) % this.p;
    const rhs = (x * x * x + this.a * x + this.b) % this.p;
    return lhs === rhs;
  }

  toString(): string {
    return `(${this.x}, ${this.y}) ${'on'.gray} ${'y'.green}^2 = ${'x'.blue}^3 + ${this.a}*${'x'.blue} + ${this.b}`;
  }
}
