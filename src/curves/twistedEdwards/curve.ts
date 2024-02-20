import {Field} from '../../fields';
import {CurveInterface} from '../interfaces';
import {TwistedEdwardsCurvePoint} from './point';
import {ffSqrt} from '../..';

/** An elliptic curve with Twisted Edwards form over affine points.
 *
 * The curve is composed of points `(x, y)` on the elliptic curve over a base field such that
 * `(x, y)` satisfy the Twisted Edwards curve equation:
 *
 * ```py
 * a(x^2) + y^2 = 1 + d(x^2)(y^2)
 * ```
 */
export class TwistedEdwardsCurve implements CurveInterface<TwistedEdwardsCurve.Point, TwistedEdwardsCurve.Value> {
  readonly base: Field;
  readonly scalar?: Field;
  readonly generator?: TwistedEdwardsCurvePoint;

  /** Curve parameter `a`. */
  readonly a: TwistedEdwardsCurve.Value;
  /** Curve parameter `d`. */
  readonly d: TwistedEdwardsCurve.Value;

  constructor(
    field: Field,
    params: TwistedEdwardsCurve.Params,
    args?: {
      scalarOrder?: bigint;
      generator?: TwistedEdwardsCurve.Point;
    }
  ) {
    this.a = field.Element(params[0]);
    this.d = field.Element(params[1]);
    this.base = field;

    if (args?.scalarOrder) this.scalar = new Field(args.scalarOrder);
    if (args?.generator) this.generator = this.Point(args.generator);
  }

  Point(point: TwistedEdwardsCurve.Point) {
    return new TwistedEdwardsCurvePoint(this, point);
  }

  random() {
    // rearrange the curve equation as:
    //
    //  a(x^2) + y^2 = 1 + d(x^2)(y^2)
    //  a(x^2) - 1 = d(x^2)(y^2) - y^2
    //  (a(x^2) - 1)/(d(x^2) - 1) = y^2
    //
    // pick random X until you find a quadratic residue for the
    // right hand-side of the equation, meaning that a Y must exist.
    // after that, use Tonelli-Shanks to find the two square roots,
    // and finally do a coin-flip to return one of them.
    let x = this.base.random();
    let y: TwistedEdwardsCurve.Value | undefined = undefined;
    while (y === undefined) {
      const xx = x.mul(x);
      const yy = this.a.mul(xx).sub(1).div(this.d.mul(xx).sub(1)); // (a(x^2) - 1)/(d(x^2) - 1)
      const roots = ffSqrt(yy);
      if (roots) {
        y = Math.random() < 0.5 ? roots[0] : roots[1];
      } else {
        // try again with another X
        x = this.base.random();
      }
    }

    return new TwistedEdwardsCurvePoint(this, [x, y]);
  }

  get inf() {
    return new TwistedEdwardsCurvePoint(this, [0, 1]);
  }

  satisfies(point: TwistedEdwardsCurve.Point) {
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

export namespace TwistedEdwardsCurve {
  export type Value = Field.Element;
  export type Params = [a: Field.Input, d: Field.Input];
  export type Point = [Field.Input, Field.Input];
}
