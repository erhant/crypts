import {PointInput, FieldElementInput} from '../../types';
import {Field, FieldElement} from '../../fields';
import type {CurveInterface} from '../interfaces';
import {MontgomeryCurvePoint} from './point';

/** An elliptic curve with Montgomery form over affine points.
 *
 * The curve is composed of points `(x, y)` on the elliptic curve over a base field such that
 * `(x, y)` satisfy the Montgomery curve equation:
 *
 * ```py
 * B(y^2) = x^3 + A(x^2) + x
 * ```
 */
export class MontgomeryCurve implements CurveInterface<PointInput, FieldElement> {
  readonly base: Field;
  readonly scalar?: Field;
  readonly generator?: MontgomeryCurvePoint;

  /** Curve parameter `A`. */
  readonly A: FieldElement;
  /** Curve parameter `B`. */
  readonly B: FieldElement;

  constructor(
    field: Field,
    params: [A: FieldElementInput, B: FieldElementInput],
    args?: {
      scalarOrder?: bigint;
      generator?: PointInput;
    }
  ) {
    this.A = field.Element(params[0]);
    this.B = field.Element(params[1]);
    this.base = field;

    if (args?.scalarOrder) this.scalar = new Field(args.scalarOrder);
    if (args?.generator) this.generator = this.Point(args.generator);
  }

  Point(point: PointInput) {
    return new MontgomeryCurvePoint(this, point);
  }

  get inf() {
    return new MontgomeryCurvePoint(this);
  }

  satisfies(point: PointInput) {
    const [x, y] = [this.base.Element(point[0]), this.base.Element(point[1])];
    const lhs = y.exp(2).mul(this.B); // B*y^2
    const rhs = x.exp(3).add(x.exp(2).mul(this.A)).add(x); // x^3 + A*x^2 + x
    return lhs.eq(rhs);
  }

  toString(): string {
    return `${this.B}*y^2 = x^3 + ${this.A}*x^2 + x`;
  }
}
