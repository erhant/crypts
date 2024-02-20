import {Integer} from '../..';
import type {CurvePointInterface} from '../interfaces';
import {MontgomeryCurve} from './curve';

/** An affine point on an elliptic curve with Montgomery form. */
export class MontgomeryCurvePoint implements CurvePointInterface<MontgomeryCurve.Point, MontgomeryCurve.Value> {
  readonly curve: MontgomeryCurve;
  readonly x: MontgomeryCurve.Value;
  readonly y: MontgomeryCurve.Value;
  readonly inf: boolean;

  constructor(curve: MontgomeryCurve, point?: MontgomeryCurve.Point) {
    this.curve = curve;
    if (point) {
      if (!curve.satisfies(point)) {
        throw new Error(`(${point[0]}, ${point[1]}) is not on this curve.`);
      }
      this.x = curve.base.Element(point[0]);
      this.y = curve.base.Element(point[1]);
      this.inf = false;
    } else {
      this.x = curve.base.zero; // arbitrary
      this.y = curve.base.zero; // arbitrary
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

      // t := (3x^2 + 2Ax + 1) / 2By
      const t = this.x
        .exp(2)
        .mul(3)
        .add(this.x.mul(this.curve.A.mul(2)))
        .add(1);

      // x' := Bt^2 - 2x - A
      const xx = this.curve.B.mul(t.exp(2)).sub(this.x.mul(2)).sub(this.curve.A);

      // y' := t(x - x') - y
      const yy = t.mul(this.x.sub(xx)).sub(this.y);

      return this.curve.Point([xx, yy]);
    }
  }

  /** Adds the point to another point, also known as the Chord rule. */
  private chord(q: MontgomeryCurvePoint) {
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

      // t := (y2 - y1)(x2 - x1)
      const t = q.y.sub(this.y).div(q.x.sub(this.x));

      // x' := Bt^2 - (x1 + x2) - A
      const xx = this.curve.B.mul(t.exp(2)).sub(this.x.add(q.x)).sub(this.curve.A);

      // y' := t(x1 - x') - y1
      const yy = t.mul(this.x.sub(xx)).sub(this.y);

      return this.curve.Point([xx, yy]);
    }
  }

  add(q: MontgomeryCurvePoint) {
    if (this.inf) return q;
    return this.eq(q) ? this.tangent() : this.chord(q);
  }

  sub(q: MontgomeryCurvePoint) {
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

  eq(q: MontgomeryCurvePoint) {
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

  toString(pretty?: boolean): string {
    if (pretty) {
      const hexes = this.curve.base.order.toString(16).length;
      return this.inf
        ? '∞'
        : `(0x${this.x.toString(16).padStart(hexes, '0')}, 0x${this.y.toString(16).padStart(hexes, '0')})`;
    } else {
      return this.inf ? 'inf' : `(${this.x}, ${this.y})`;
    }
  }
}
