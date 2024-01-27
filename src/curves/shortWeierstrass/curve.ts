import {PointInput, FieldElementInput} from '../../types';
import {Field, FieldElement} from '../../fields';
import type {CurveInterface} from '../interfaces';
import {ShortWeierstrassCurvePoint} from './point';

/** An elliptic curve with Short Weierstrass form over affine points.
 *
 * The curve is composed of points `(x, y)` on the elliptic curve over a base field such that
 * `(x, y)` satisfy the  Short Weierstrass curve equation:
 *
 * ```py
 * y^2 = x^3 + a(x) + b
 * ```
 */
export class ShortWeierstrassCurve implements CurveInterface<PointInput, FieldElement> {
  readonly base: Field;
  readonly scalar?: Field;
  readonly generator?: ShortWeierstrassCurvePoint;

  /** Curve parameter `a`. */
  readonly a: FieldElement;
  /** Curve parameter `b`. */
  readonly b: FieldElement;

  constructor(
    field: Field,
    params: [a: FieldElementInput, b: FieldElementInput],
    args?: {
      scalarOrder?: bigint;
      generator?: PointInput;
    }
  ) {
    this.a = field.Element(params[0]);
    this.b = field.Element(params[1]);
    this.base = field;

    if (args?.scalarOrder) this.scalar = new Field(args.scalarOrder);
    if (args?.generator) this.generator = this.Point(args.generator);
  }

  Point(point: PointInput) {
    return new ShortWeierstrassCurvePoint(this, point);
  }

  get inf() {
    return new ShortWeierstrassCurvePoint(this);
  }

  satisfies(point: PointInput) {
    const [x, y] = [this.base.Element(point[0]), this.base.Element(point[1])];
    const lhs = y.exp(2); // y^2
    const rhs = x.exp(3).add(x.mul(this.a)).add(this.b); // x^3 + ax + b
    return lhs.eq(rhs);
  }

  toString() {
    return `y^2 = x^3 + ${this.a}*x + ${this.b}`;
  }
}
