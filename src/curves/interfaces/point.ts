import {Integer} from '../..';
import {CurveInterface} from './curve';

export interface CurvePointInterface<I, V> {
  /** Underlying curve. */
  readonly curve: CurveInterface<I, V>;
  /** X coordinate of the affine point. */
  readonly x: V;
  /** Y coordinate of the affine point. */
  readonly y: V;
  /** `true` if this is the point at infinity. */
  readonly inf: boolean;

  /** Add two points on the curve. */
  add(q: CurvePointInterface<I, V>): CurvePointInterface<I, V>;

  /** Subtract a point from another on the curve. */
  sub(q: CurvePointInterface<I, V>): CurvePointInterface<I, V>;

  /** Additive inverse of a point. */
  neg(): CurvePointInterface<I, V>;

  /** Scale a point via [`double-and-add`](https://en.wikipedia.org/wiki/Exponentiation_by_squaring). */
  scale(s: Integer): CurvePointInterface<I, V>;

  /** Equality check with a point. */
  eq(q: CurvePointInterface<I, V>): boolean;

  /** String representation of the affine curve point. */
  toString(): string;
}
