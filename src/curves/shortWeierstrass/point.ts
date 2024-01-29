import {PointInput, Integer} from '../../types';
import {FieldElement} from '../../fields';
import type {CurvePointInterface} from '../interfaces';
import {ShortWeierstrassCurve} from './curve';

/** An affine point on an elliptic curve with Short Weierstrass form. */
export class ShortWeierstrassCurvePoint implements CurvePointInterface<PointInput, FieldElement> {
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
    if (this.inf) return q;
    return this.eq(q) ? this.tangent() : this.chord(q);
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
    s = BigInt(s);
    if (this.curve.scalar) {
      s = s % this.curve.scalar.order;
    }

    let ans = this.curve.inf;
    let base = this.curve.Point([this.x, this.y]);
    for (let e = s; e > 0n; e >>= 1n) {
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

  toCompressed(): string {
    if (this.inf) throw 'Tried to compress inf.';
    const hexes = this.curve.base.order.toString(16).length;
    return `${(this.y.value & 1n) === 0n ? '02' : '03'}${this.x.value.toString(16).padStart(hexes, '0')}`;
  }

  toUncompressed(): string {
    if (this.inf) throw 'Tried to output uncompressed inf.';
    const hexes = this.curve.base.order.toString(16).length;
    return `04${this.x.toString(16).padStart(hexes, '0')}${this.y.toString(16).padStart(hexes, '0')}`;
  }
}
