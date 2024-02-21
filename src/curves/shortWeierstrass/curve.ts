import {Field} from '../../fields';
import type {CurveInterface} from '../interfaces';
import {ShortWeierstrassCurvePoint} from './point';
import {ffSqrt} from '../..';

/**
 * An elliptic curve with Short Weierstrass form over affine points.
 *
 * The curve is composed of points `(x, y)` on the elliptic curve over a base field such that
 * `(x, y)` satisfy the  Short Weierstrass curve equation:
 *
 * ```py
 * y^2 = x^3 + a(x) + b
 * ```
 */
export class ShortWeierstrassCurve implements CurveInterface<ShortWeierstrassCurve.Point, ShortWeierstrassCurve.Value> {
  readonly base: Field;
  readonly scalar?: Field;
  readonly generator?: ShortWeierstrassCurvePoint;

  /** Curve parameter `a`. */
  readonly a: ShortWeierstrassCurve.Value;
  /** Curve parameter `b`. */
  readonly b: ShortWeierstrassCurve.Value;

  constructor(
    field: Field,
    params: ShortWeierstrassCurve.Params,
    args?: {
      scalarOrder?: bigint;
      generator?: ShortWeierstrassCurve.Point;
    }
  ) {
    this.a = field.Element(params[0]);
    this.b = field.Element(params[1]);
    this.base = field;

    if (args?.scalarOrder) this.scalar = new Field(args.scalarOrder);
    if (args?.generator) this.generator = this.Point(args.generator);
  }

  Point(point: ShortWeierstrassCurve.Point) {
    return new ShortWeierstrassCurvePoint(this, point);
  }

  random() {
    // pick random X until you find a quadratic residue for the
    // right hand-side of the equation, meaning that a Y must exist.
    // after that, use Tonelli-Shanks to find the two square roots,
    // and finally do a coin-flip to return one of them.
    let x = this.base.random();
    let y: ShortWeierstrassCurve.Value | undefined = undefined;
    while (y === undefined) {
      const yy = x.exp(3).add(x.mul(this.a)).add(this.b); // x^3 + ax + b
      const roots = ffSqrt(yy);
      if (roots) {
        y = Math.random() < 0.5 ? roots[0] : roots[1];
      } else {
        // try again with another X
        x = this.base.random();
      }
    }

    return new ShortWeierstrassCurvePoint(this, [x, y]);
  }

  get inf() {
    return new ShortWeierstrassCurvePoint(this);
  }

  satisfies(point: ShortWeierstrassCurve.Point) {
    const [x, y] = [this.base.Element(point[0]), this.base.Element(point[1])];
    const lhs = y.exp(2); // y^2
    const rhs = x.exp(3).add(x.mul(this.a)).add(this.b); // x^3 + ax + b
    return lhs.eq(rhs);
  }

  toString() {
    return `y^2 = x^3 + ${this.a}*x + ${this.b}`;
  }
}

export namespace ShortWeierstrassCurve {
  export type Value = Field.Element;
  export type Params = [a: Field.Input, b: Field.Input];
  export type Point = [Field.Input, Field.Input];
}
