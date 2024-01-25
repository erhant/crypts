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
  readonly field: Field;
  /** Curve parameter `a`. */
  readonly a: FieldElement;
  /** Curve parameter `d`. */
  readonly d: FieldElement;

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
