import {PointInput, FieldElementInput, Number} from '../types';
import {Field, FieldElement} from '../fields';

/** An elliptic curve with Short Weierstrass form over affine points. */
export class ShortWeierstrassCurve {
  readonly field: Field;
  readonly a: FieldElement;
  readonly b: FieldElement;

  /**
   * An elliptic curve over a base field such that pairs of elements
   * `(x, y)` satisfy the  Short Weierstrass curve equation:
   *
   * ```py
   * y^2 = x^3 + a*x + b
   * ```
   */
  constructor(field: Field, params: readonly [a: FieldElementInput, b: FieldElementInput]) {
    /** Curve parameter `a`. */
    this.a = field.Element(params[0]);
    /** Curve parameter `b`. */
    this.b = field.Element(params[1]);
    /** Base field. */
    this.field = field;
  }

  /** A point on the elliptic curve. */
  Point(point: PointInput): ShortWeierstrassCurvePoint {
    return new ShortWeierstrassCurvePoint(this, point);
  }

  /** Neutral element (point at infinity). */
  get inf(): ShortWeierstrassCurvePoint {
    return new ShortWeierstrassCurvePoint(this);
  }

  /** Returns `true` if given point `[x, y]` is on the curve, i.e. satisfies the curve equation. */
  isOnCurve(point: PointInput): boolean {
    const [x, y] = [this.field.Element(point[0]), this.field.Element(point[1])];
    const lhs = y.exp(2); // y^2
    const rhs = x.exp(3).add(x.mul(this.a)).add(this.b); // x^3 + ax + b
    return lhs.eq(rhs);
  }

  /** String representation of the elliptic curve. */
  toString(): string {
    return `y^2 = x^3 + ${this.a}*x + ${this.b}`;
  }
}

/** An affine point on an elliptic curve with Short Weierstrass form. */
export class ShortWeierstrassCurvePoint {
  readonly curve: ShortWeierstrassCurve;
  // coordinates
  readonly x: FieldElement;
  readonly y: FieldElement;
  // is point at infinity
  readonly inf: boolean;

  constructor(curve: ShortWeierstrassCurve, point?: PointInput) {
    this.curve = curve;
    if (point) {
      if (!curve.isOnCurve(point)) {
        throw new Error(`(${point[0]}, ${point[1]}) is not on this curve.`);
      }
      this.x = this.field.Element(point[0]);
      this.y = this.field.Element(point[1]);
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

  /** Adds the point to itself, also known as the Tangent rule. */
  private tangent(): ShortWeierstrassCurvePoint {
    if (this.inf) {
      return this.curve.inf;
    } else {
      if (this.y.eq(0)) {
        throw new Error('y-coordinate cant be zero.');
      }

      // t := (3x^2 + a) / 2y
      const t = this.x.exp(2).mul(3).add(this.curve.a).div(this.y.mul(2));

      // x' := t^2 - 2x
      const xx = t.exp(2).sub(this.x.mul(2));

      // y' := t(x - x') - y
      const yy = t.mul(this.x.sub(xx)).sub(this.y);

      return this.curve.Point([xx, yy]);
    }
  }

  /** Adds the point to another point, also known as the Chord rule. */
  private chord(q: ShortWeierstrassCurvePoint): ShortWeierstrassCurvePoint {
    if (q.inf) {
      // q is neutral element, return the point itself
      return this.inf ? this.curve.inf : this.curve.Point([this.x, this.y]);
    } else {
      if (this.x.eq(q.x)) {
        if (this.y.eq(q.y.neg())) {
          return this.curve.inf;
        } else {
          throw new Error('x-coordinates cant be equal.');
        }
      }

      // t := (y_2 - y_1) / (x_2 - x_1)
      const t = q.y.sub(this.y).div(q.x.sub(this.x));

      const xx = t.exp(2).sub(this.x).sub(q.x); // x' := t^2 - x_1 - x_2
      const yy = t.mul(this.x.sub(xx)).sub(this.y); // y' := t(x_1 - x_3) - y_1

      return this.curve.Point([xx, yy]);
    }
  }

  /** Add two points on the curve. */
  add(q: ShortWeierstrassCurvePoint): ShortWeierstrassCurvePoint {
    if (this.eq(q)) {
      return this.tangent();
    } else {
      return this.chord(q);
    }
  }

  /** Subtract a point from another on the curve. */
  sub(q: ShortWeierstrassCurvePoint): ShortWeierstrassCurvePoint {
    return this.add(q.neg());
  }

  /** Additive Inverse of a point. */
  neg(): ShortWeierstrassCurvePoint {
    if (this.inf) {
      return this.curve.inf;
    } else {
      return this.curve.Point([this.x, this.y.neg()]);
    }
  }

  /** Scale a point via `double-and-add`. */
  scale(s: Number): ShortWeierstrassCurvePoint {
    if (this.inf) {
      return this.curve.inf;
    }

    let e = BigInt(s);
    let ans = this.curve.Point([this.x, this.y]);

    if (e === 1n) {
      return ans;
    }
    if (e === 2n) {
      return ans.add(ans);
    }

    for (e >>= 1n; e > 0n; e >>= 1n) {
      ans = ans.add(ans);
      if (e % 2n === 1n) {
        ans = ans.add(this);
      }
    }
    return ans;
  }

  /** Equality check with a point. */
  eq(q: ShortWeierstrassCurvePoint): boolean {
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

  /** String representation of the affine curve point. */
  toString(): string {
    return this.inf ? 'inf' : `(${this.x}, ${this.y})`;
  }
}
