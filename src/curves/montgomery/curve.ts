import {PointInput} from '../../types';
import {Field, FieldElement} from '../../fields';
import type {CurveInterface} from '../interfaces';
import {MontgomeryCurvePoint} from './point';
import {ffSqrt} from '../..';

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
    params: [A: Field.Input, B: Field.Input],
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

  random() {
    // rearrange the curve equation as:
    //
    //  y^2 = (x^3 + A(x^2) + x) / B
    //
    // pick random X until you find a quadratic residue for the
    // right hand-side of the equation, meaning that a Y must exist.
    // after that, use Tonelli-Shanks to find the two square roots,
    // and finally do a coin-flip to return one of them.
    let x = this.base.random();
    let y: FieldElement | undefined = undefined;
    while (y === undefined) {
      const yy = x.exp(3).add(x.exp(2).mul(this.A)).add(x).div(this.B); // (x^3 + A(x^2) + x) / B
      const roots = ffSqrt(yy);
      if (roots) {
        y = Math.random() < 0.5 ? roots[0] : roots[1];
      } else {
        // try again with another X
        x = this.base.random();
      }
    }

    return new MontgomeryCurvePoint(this, [x, y]);
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
