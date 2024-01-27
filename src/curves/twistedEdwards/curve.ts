import {PointInput, FieldElementInput} from '../../types';
import {Field, FieldElement} from '../../fields';
import {CurveInterface} from '../interfaces';
import {TwistedEdwardsCurvePoint} from './point';

/** An elliptic curve with Twisted Edwards form over affine points.
 *
 * The curve is composed of points `(x, y)` on the elliptic curve over a base field such that
 * `(x, y)` satisfy the Twisted Edwards curve equation:
 *
 * ```py
 * a(x^2) + y^2 = 1 + d(x^2)(y^2)
 * ```
 */
export class TwistedEdwardsCurve implements CurveInterface<PointInput, FieldElement> {
  readonly base: Field;
  readonly scalar?: Field;
  readonly generator?: TwistedEdwardsCurvePoint;

  /** Curve parameter `a`. */
  readonly a: FieldElement;
  /** Curve parameter `d`. */
  readonly d: FieldElement;

  constructor(
    field: Field,
    params: [a: FieldElementInput, d: FieldElementInput],
    args?: {
      scalarOrder?: bigint;
      generator?: PointInput;
    }
  ) {
    this.a = field.Element(params[0]);
    this.d = field.Element(params[1]);
    this.base = field;

    if (args?.scalarOrder) this.scalar = new Field(args.scalarOrder);
    if (args?.generator) this.generator = this.Point(args.generator);
  }

  Point(point: PointInput) {
    return new TwistedEdwardsCurvePoint(this, point);
  }

  get inf() {
    return new TwistedEdwardsCurvePoint(this, [0, 1]);
  }

  satisfies(point: PointInput) {
    const [x, y] = [this.base.Element(point[0]), this.base.Element(point[1])];
    const [xx, yy] = [x.exp(2), y.exp(2)];
    const lhs = this.a.mul(xx).add(yy); // a*x^2 + y^2
    const rhs = this.base.one.add(this.d.mul(xx).mul(yy)); // 1 + d*x^2*y^2
    return lhs.eq(rhs);
  }

  toString() {
    return `${this.a}*x^2 + y^2 = 1 + ${this.d}*x^2*y^2`;
  }
}
