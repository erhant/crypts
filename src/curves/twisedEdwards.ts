import {PointInput, FieldElementInput} from '../types';
import {Field, FieldElement} from '../fields';

/** An elliptic curve with Twisted Edwards form over affine points. */
export class TwistedEdwardsCurve {
  /** Base field. */
  readonly field: Field;
  /** Curve parameter `a`. */
  readonly a: FieldElement;
  /** Curve parameter `d`. */
  readonly d: FieldElement;

  /**
   * An elliptic curve over a base field such that pairs of elements
   * `(x, y)` satisfy the Twisted Edwards curve equation:
   *
   * ```py
   * a*x^2 + y^2 = 1 + d*x^2*y^2
   * ```
   */
  constructor(field: Field, params: readonly [a: FieldElementInput, d: FieldElementInput]) {
    this.a = field.Element(params[0]);
    this.d = field.Element(params[1]);
    this.field = field;
  }

  /** A point on the elliptic curve. */
  Point(point: PointInput): TwistedEdwardsCurvePoint {
    return new TwistedEdwardsCurvePoint(this, point);
  }

  /** Neutral element (point at infinity). */
  get inf(): TwistedEdwardsCurvePoint {
    return new TwistedEdwardsCurvePoint(this, [0, 1]);
  }

  /** Returns `true` if given point `[x, y]` is on the curve, i.e. satisfies the curve equation. */
  satisfies(point: PointInput): boolean {
    const [x, y] = [this.field.Element(point[0]), this.field.Element(point[1])];
    const [xx, yy] = [x.exp(2), y.exp(2)];
    const lhs = this.a.mul(xx).add(yy); // a*x^2 + y^2
    const rhs = this.field.one.add(this.d.mul(xx).mul(yy)); // 1 + d*x^2*y^2
    return lhs.eq(rhs);
  }

  /** String representation of the elliptic curve. */
  toString(): string {
    return `${this.a}*x^2 + y^2 = 1 + ${this.d}*x^2*y^2`;
  }
}

/** An affine point on an elliptic curve with Short Weierstrass form. */
export class TwistedEdwardsCurvePoint {
  readonly curve: TwistedEdwardsCurve;
  // coordinates, no need for inf
  readonly x: FieldElement;
  readonly y: FieldElement;

  constructor(curve: TwistedEdwardsCurve, point: PointInput) {
    this.curve = curve;
    if (!curve.satisfies(point)) {
      throw new Error(`(${point[0]}, ${point[1]}) is not on this curve.`);
    }
    this.x = this.field.Element(point[0]);
    this.y = this.field.Element(point[1]);
  }

  /** Base field of the curve that this point belongs to. */
  get field(): Field {
    return this.curve.field;
  }

  /** Add two points on the curve. */
  add(q: TwistedEdwardsCurvePoint): TwistedEdwardsCurvePoint {
    const x1x2 = this.x.mul(q.x);
    const x1y2 = this.x.mul(q.y);

    const y1x2 = this.y.mul(q.x);
    const y1y2 = this.y.mul(q.y);

    const t = this.curve.d.mul(x1x2).mul(y1y2);

    const xx = x1y2.add(y1x2).div(t.add(1));
    const yy = y1y2.sub(x1x2.mul(this.curve.a)).div(t.neg().add(1));

    return this.curve.Point([xx, yy]);
  }

  /** Subtract a point from another on the curve. */
  sub(q: TwistedEdwardsCurvePoint): TwistedEdwardsCurvePoint {
    return this.add(q.neg());
  }

  /** Additive Inverse of a point. */
  neg(): TwistedEdwardsCurvePoint {
    return this.curve.Point([this.x.neg(), this.y]);
  }

  /** Equality check with a point. */
  eq(q: TwistedEdwardsCurvePoint): boolean {
    return this.x.eq(q.x) && this.y.eq(q.y);
  }

  /** String representation of the affine curve point. */
  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
