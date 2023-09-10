import {PointInput, FieldElementInput, Integer} from '../types';
import {Field, FieldElement} from '../fields';
import type {CurveInterface, CurvePointInterface} from './interface';

/** An elliptic curve with Short Weierstrass form over affine points. */
export class ShortWeierstrassCurve implements CurveInterface<PointInput> {
  readonly field: Field;
  /** Curve parameter `a`. */
  readonly a: FieldElement;
  /** Curve parameter `b`. */
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
    this.a = field.Element(params[0]);
    this.b = field.Element(params[1]);
    this.field = field;
  }

  Point(point: PointInput) {
    return new ShortWeierstrassCurvePoint(this, point);
  }

  get inf() {
    return new ShortWeierstrassCurvePoint(this);
  }

  satisfies(point: PointInput) {
    const [x, y] = [this.field.Element(point[0]), this.field.Element(point[1])];
    const lhs = y.exp(2); // y^2
    const rhs = x.exp(3).add(x.mul(this.a)).add(this.b); // x^3 + ax + b
    return lhs.eq(rhs);
  }

  toString() {
    return `y^2 = x^3 + ${this.a}*x + ${this.b}`;
  }
}

/** An affine point on an elliptic curve with Short Weierstrass form. */
export class ShortWeierstrassCurvePoint implements CurvePointInterface {
  readonly curve: ShortWeierstrassCurve;
  readonly x: FieldElement;
  readonly y: FieldElement;
  readonly inf: boolean;

  constructor(curve: ShortWeierstrassCurve, point?: PointInput) {
    this.curve = curve;
    if (point) {
      if (!curve.satisfies(point)) {
        throw new Error(`(${point[0]}, ${point[1]}) is not on this curve.`);
      }
      this.x = curve.field.Element(point[0]);
      this.y = curve.field.Element(point[1]);
      this.inf = false;
    } else {
      this.x = curve.field.zero; // arbitrary
      this.y = curve.field.zero; // arbitrary
      this.inf = true;
    }
  }

  /** Adds the point to itself, also known as the Tangent rule. */
  private tangent() {
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
  private chord(q: ShortWeierstrassCurvePoint) {
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

  add(q: ShortWeierstrassCurvePoint) {
    if (this.inf) {
      return q;
    } else if (this.eq(q)) {
      return this.tangent();
    } else {
      return this.chord(q);
    }
  }

  sub(q: ShortWeierstrassCurvePoint) {
    return this.add(q.neg());
  }

  neg() {
    if (this.inf) {
      return this.curve.inf;
    } else {
      return this.curve.Point([this.x, this.y.neg()]);
    }
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

  eq(q: ShortWeierstrassCurvePoint) {
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

  toString(): string {
    return this.inf ? 'inf' : `(${this.x}, ${this.y})`;
  }
}
