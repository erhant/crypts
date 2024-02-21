import {Integer} from '../..';
import {CurvePointInterface} from '../interfaces';
import {TwistedEdwardsCurve} from './curve';

/** An affine point on an elliptic curve with Twisted Edwards form. */
export class TwistedEdwardsCurvePoint
  implements CurvePointInterface<TwistedEdwardsCurve.Point, TwistedEdwardsCurve.Value>
{
  readonly curve: TwistedEdwardsCurve;
  readonly x: TwistedEdwardsCurve.Value;
  readonly y: TwistedEdwardsCurve.Value;
  readonly inf: boolean;

  constructor(curve: TwistedEdwardsCurve, point: TwistedEdwardsCurve.Point) {
    this.curve = curve;
    if (!curve.satisfies(point)) {
      throw new Error(`(${point[0]}, ${point[1]}) is not on this curve.`);
    }
    this.x = curve.base.Element(point[0]);
    this.y = curve.base.Element(point[1]);
    this.inf = this.x.isZero() && this.y.isOne();
  }

  add(q: TwistedEdwardsCurvePoint) {
    const x1x2 = this.x.mul(q.x);
    const x1y2 = this.x.mul(q.y);

    const y1x2 = this.y.mul(q.x);
    const y1y2 = this.y.mul(q.y);

    const t = this.curve.d.mul(x1x2).mul(y1y2);

    const xx = x1y2.add(y1x2).div(t.add(1));
    const yy = y1y2.sub(x1x2.mul(this.curve.a)).div(t.neg().add(1));

    return this.curve.Point([xx, yy]);
  }

  sub(q: TwistedEdwardsCurvePoint) {
    return this.add(q.neg());
  }

  neg() {
    return this.curve.Point([this.x.neg(), this.y]);
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

  eq(q: TwistedEdwardsCurvePoint) {
    return this.x.eq(q.x) && this.y.eq(q.y);
  }

  toString(pretty?: boolean): string {
    if (pretty) {
      const hexes = this.curve.base.order.toString(16).length;
      return `(0x${this.x.toString(16).padStart(hexes, '0')}, 0x${this.y.toString(16).padStart(hexes, '0')})`;
    } else {
      return `(${this.x}, ${this.y})`;
    }
  }
}
