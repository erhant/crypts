import {Number} from './common';
import {Felt} from './element';
import 'colors';

// https://zcash.github.io/halo2/background/polynomials.html

export class EllipticCurve {
  // c_i = coeff[i] stands for c_i * x^i
  readonly a: bigint;
  readonly b: bigint;
  readonly p: bigint;

  /** Creates an elliptic curve in Affine Short Weierstrass form.
   *
   * ```py
   * y^2 = x^3 + ax + b
   * ```
   */
  constructor(a: Number, b: Number, p: bigint) {
    this.a = BigInt(a);
    this.b = BigInt(b);
    this.p = p;
  }
}
