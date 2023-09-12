import {PointInput, FieldElementInput, Integer} from '../types';
import {Field, FieldElement} from '../fields';
import {CurveInterface, CurvePointInterface} from './interface';

/** An elliptic curve with Twisted Edwards form over affine points. */
export class TwistedEdwardsCurve implements CurveInterface<PointInput, FieldElement> {
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

  Point(point: PointInput) {
    return new TwistedEdwardsCurvePoint(this, point);
  }

  get inf() {
    return new TwistedEdwardsCurvePoint(this, [0, 1]);
  }

  satisfies(point: PointInput) {
    const [x, y] = [this.field.Element(point[0]), this.field.Element(point[1])];
    const [xx, yy] = [x.exp(2), y.exp(2)];
    const lhs = this.a.mul(xx).add(yy); // a*x^2 + y^2
    const rhs = this.field.one.add(this.d.mul(xx).mul(yy)); // 1 + d*x^2*y^2
    return lhs.eq(rhs);
  }

  toString() {
    return `${this.a}*x^2 + y^2 = 1 + ${this.d}*x^2*y^2`;
  }
}

/** An affine point on an elliptic curve with Short Weierstrass form. */
export class TwistedEdwardsCurvePoint implements CurvePointInterface<PointInput, FieldElement> {
  readonly curve: TwistedEdwardsCurve;
  readonly x: FieldElement;
  readonly y: FieldElement;
  readonly inf: boolean;

  constructor(curve: TwistedEdwardsCurve, point: PointInput) {
    this.curve = curve;
    if (!curve.satisfies(point)) {
      throw new Error(`(${point[0]}, ${point[1]}) is not on this curve.`);
    }
    this.x = curve.field.Element(point[0]);
    this.y = curve.field.Element(point[1]);
    this.inf = this.x.eq(0) && this.y.eq(1);
  }

  add(q: TwistedEdwardsCurvePoint) {
    const x1x2 = this.x.mul(q.x);
    const x1y2 = this.x.mul(q.y);

    const y1x2 = this.y.mul(q.x);
    const y1y2 = this.y.mul(q.y);

    const t = this.curve.d.mul(x1x2).mul(y1y2);

    const xx = x1y2.add(y1x2).div(t.add(1));
    const yy = y1y2.sub(x1x2.mul(this.curve.a)).div(t.neg().add(1));

    return this.curve.Point([xx, yy]);
  }

  sub(q: TwistedEdwardsCurvePoint) {
    return this.add(q.neg());
  }

  neg() {
    return this.curve.Point([this.x.neg(), this.y]);
  }

  scale(s: Integer) {
    let ans = this.curve.inf;
    let base = this.curve.Point([this.x, this.y]);
    for (let e = BigInt(s); e > 0n; e >>= 1n) {
      if (e % 2n === 1n) {
        ans = ans.add(base);
      }
      base = base.add(base);
    }
    return ans;
  }

  eq(q: TwistedEdwardsCurvePoint) {
    return this.x.eq(q.x) && this.y.eq(q.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}
