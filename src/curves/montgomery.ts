import {AffinePointInput, FieldElementInput} from '../types';
import {Field, FieldElement} from '../fields';

/** An elliptic curve with Montgomery form over affine points. */
export class MontgomeryCurve {
  readonly field: Field;
  readonly A: FieldElement;
  readonly B: FieldElement;

  /**
   * An elliptic curve over a base field such that pairs of elements
   * `(x, y)` satisfy the Montgomery curve equation:
   *
   * ```py
   * B*y^2 = x^3 + A*x^2 + x
   * ```
   */
  constructor(field: Field, params: readonly [A: FieldElementInput, B: FieldElementInput]) {
    /** Curve parameter `a`. */
    this.A = field.Element(params[0]);
    /** Curve parameter `b`. */
    this.B = field.Element(params[1]);
    /** Base field. */
    this.field = field;
  }

  /** A point on the elliptic curve. */
  Point(point: AffinePointInput): MontgomeryCurvePoint {
    return new MontgomeryCurvePoint(this, point);
  }

  /** Neutral element (point at infinity). */
  get inf(): MontgomeryCurvePoint {
    return new MontgomeryCurvePoint(this);
  }

  /** Returns `true` if given point `[x, y]` is on the curve, i.e. satisfies the curve equation. */
  isOnCurve(point: AffinePointInput): boolean {
    const [x, y] = [this.field.Element(point[0]), this.field.Element(point[1])];
    const lhs = y.exp(2).mul(this.B); // B*y^2
    const rhs = x.exp(3).add(x.exp(2).mul(this.A)).add(x); // x^3 + A*x^2 + x
    return lhs.eq(rhs);
  }

  /** String representation of the elliptic curve. */
  toString(): string {
    return `${this.B}*y^2 = x^3 + ${this.A}*x^2 + x`;
  }
}

/** An affine point on an elliptic curve with Short Weierstrass form. */
export class MontgomeryCurvePoint {
  readonly curve: MontgomeryCurve;
  // coordinates
  readonly x: FieldElement;
  readonly y: FieldElement;
  // is point at infinity
  readonly inf: boolean;

  constructor(curve: MontgomeryCurve, point?: AffinePointInput) {
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
  private tangent(): MontgomeryCurvePoint {
    if (this.inf) {
      return this.curve.inf;
    } else {
      if (this.y.eq(0)) {
        throw new Error('y-coordinate cant be zero.');
      }

      // t := (3x^2 + 2Ax + 1) / 2By
      const t = this.x
        .exp(2)
        .mul(3)
        .add(this.x.mul(this.curve.A.mul(2)))
        .add(1);

      // x' := Bt^2 - 2x - A
      const xx = this.curve.B.mul(t.exp(2)).sub(this.x.mul(2)).sub(this.curve.A);

      // y' := t(x - x') - y
      const yy = t.mul(this.x.sub(xx)).sub(this.y);

      return this.curve.Point([xx, yy]);
    }
  }

  /** Adds the point to another point, also known as the Chord rule. */
  private chord(q: MontgomeryCurvePoint): MontgomeryCurvePoint {
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

      // t := (y2 - y1)(x2 - x1)
      const t = q.y.sub(this.y).div(q.x.sub(this.x));

      // x' := Bt^2 - (x1 + x2) - A
      const xx = this.curve.B.mul(t.exp(2)).sub(this.x.add(q.x)).sub(this.curve.A);

      // y' := t(x1 - x') - y1
      const yy = t.mul(this.x.sub(xx)).sub(this.y);

      return this.curve.Point([xx, yy]);
    }
  }

  /** Add two points on the curve. */
  add(q: MontgomeryCurvePoint): MontgomeryCurvePoint {
    if (this.eq(q)) {
      return this.tangent();
    } else {
      return this.chord(q);
    }
  }

  /** Subtract a point from another on the curve. */
  sub(q: MontgomeryCurvePoint): MontgomeryCurvePoint {
    return this.add(q.neg());
  }

  /** Additive Inverse of a point. */
  neg(): MontgomeryCurvePoint {
    if (this.inf) {
      return this.curve.inf;
    } else {
      return this.curve.Point([this.x, this.y.neg()]);
    }
  }

  /** Equality check with a point. */
  eq(q: MontgomeryCurvePoint): boolean {
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
