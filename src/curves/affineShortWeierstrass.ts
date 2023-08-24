import {Number} from '../common';
import {Felt} from '../fields/field-element';
import {Field} from '../fields';

// https://zcash.github.io/halo2/background/curves.html

// random point https://crypto.stackexchange.com/questions/68601/generating-a-random-point-on-an-elliptic-curve-over-a-finite-field

/** An elliptic curve with Short Weierstrass form over affine points. */
export class AffineShortWeierstrassCurve {
  readonly field: Field;
  readonly a: bigint;
  readonly b: bigint;

  /**
   * An elliptic curve over a base field such that pairs of elements `(x, y)` satisfy
   * the Affine Short Weierstrass curve equation:
   *
   * ```py
   * y^2 = x^3 + ax + b
   * ```
   */
  constructor(field: Field, params: [a: Number, b: Number]) {
    /** Curve parameter `a`. */
    this.a = BigInt(params[0]);
    /** Curve parameter `b`. */
    this.b = BigInt(params[1]);
    /** Base field. */
    this.field = field;
  }

  /** A point on the elliptic curve. */
  Point(point: [Number | Felt, Number | Felt]): AffineShortWeierstrassCurvePoint {
    return new AffineShortWeierstrassCurvePoint(this, point);
  }

  /** Neutral element (point at infinity). */
  get inf(): AffineShortWeierstrassCurvePoint {
    return new AffineShortWeierstrassCurvePoint(this);
  }

  /** Is the curve non-singular? */
  isNonSingular(): boolean {
    const [a, b] = [this.field.Felt(this.a), this.field.Felt(this.b)];
    const l = a.exp(3).mul(4); // 4a^3
    const r = b.exp(2).mul(27); // 27b^2
    return !l.add(r).eq(0); // 4a^3 + 27b^2 != 0
  }

  /** Returns `true` if given point `(x, y)` is on the curve, i.e. satisfies the curve equation. */
  isOnCurve(point: [Number | Felt, Number | Felt]): boolean {
    const [x, y] = [this.field.Felt(point[0]), this.field.Felt(point[1])];
    const lhs = y.exp(2); // y^2
    const rhs = x.exp(3).add(x.mul(this.a)).add(this.b); // x^3 + ax + b
    return lhs.eq(rhs);
  }

  toString(): string {
    return `y^2 = x^3 + ${this.a}*x + ${this.b}`;
  }
}

/** An affine point on an elliptic curve with Short Weierstrass form. */
export class AffineShortWeierstrassCurvePoint {
  readonly curve: AffineShortWeierstrassCurve;
  // coordinates
  x: Felt;
  y: Felt;
  // is point at infinity
  inf: boolean;

  constructor(curve: AffineShortWeierstrassCurve, point?: [Number | Felt, Number | Felt]) {
    this.curve = curve;
    if (point) {
      if (!curve.isOnCurve(point)) {
        throw new Error(`(${point[0]}, ${point[1]}) is not on this curve.`);
      }
      this.x = this.field.Felt(point[0]);
      this.y = this.field.Felt(point[1]);
      this.inf = false;
    } else {
      this.x = this.field.zero; // arbitrary
      this.y = this.field.zero; // arbitrary
      this.inf = true;
    }
  }

  /** Base field of the curve that this point belongs to. */
  get field(): Field {
    return this.curve.field;
  }

  /** Inverse of a point. */
  inv(): AffineShortWeierstrassCurvePoint {
    if (this.inf) {
      return this.curve.inf;
    } else {
      return this.curve.Point([this.x, this.y.neg()]);
    }
  }

  /** Adds the point to itself, also known as the Tangent rule. */
  double(): AffineShortWeierstrassCurvePoint {
    if (this.inf) {
      return this.curve.inf;
    } else {
      if (this.y.eq(0)) {
        throw new Error('y-coordinate cant be zero.');
      }

      // t := (3x^2 + a) / 2y
      const t = this.x.exp(2).mul(3).add(this.curve.a).div(this.y.mul(2));

      const xx = t.exp(2).sub(this.x.mul(2)); //       x' := t^2 - 2x
      const yy = t.mul(this.x.sub(xx)).sub(this.y); // y' := t(x - x') - y
      return this.curve.Point([xx, yy]);
    }
  }

  /** Adds a point to itself, also known as the Chord rule. */
  add(q: AffineShortWeierstrassCurvePoint): AffineShortWeierstrassCurvePoint {
    if (q.inf) {
      // q is neutral element, return the point itself
      return this.inf ? this.curve.inf : this.curve.Point([this.x, this.y]);
    } else {
      if (this.x.eq(q.x)) {
        throw new Error('x-coordinates cant be equal.');
      }

      // t := (y_2 - y_1) / (x_2 - x_1)
      const t = q.y.sub(this.y).div(q.x.sub(this.x));

      const xx = t.exp(2).sub(this.x).sub(q.x); //     x' := t^2 - x_1 - x_2
      const yy = t.mul(this.x.sub(xx)).sub(this.y); // y' := t(x_1 - x_3) - y_1

      return this.curve.Point([xx, yy]);
    }
  }

  /** Equality check with a point. */
  eq(q: AffineShortWeierstrassCurvePoint): boolean {
    if (this.inf && q.inf) {
      // both are inf
      return true;
    } else if (this.inf || q.inf) {
      // one of them is inf
      return false;
    } else {
      // coordinates must match
      return this.x.eq(q.x) && this.y.eq(q.y);
    }
  }
}
