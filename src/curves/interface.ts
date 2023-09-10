import {Field, FieldElement} from '..';
import {Integer} from '../types';

export {ShortWeierstrassCurve, ShortWeierstrassCurvePoint} from './shortWeierstrass';
export {MontgomeryCurve, MontgomeryCurvePoint} from './montgomery';
export {TwistedEdwardsCurve, TwistedEdwardsCurvePoint} from './twisedEdwards';

export interface CurveInterface<I> {
  /** Base field. */
  readonly field: Field;

  /** A point on the elliptic curve. */
  Point(p: I): CurvePointInterface;

  /** Returns true if given point is on the curve, i.e. satisfies the curve equation. */
  satisfies(point: I): boolean;

  /** Neutral element, the point at infinity. */
  get inf(): CurvePointInterface;

  /** String representation of the elliptic curve. */
  toString(): string;
}

export interface CurvePointInterface {
  /** X coordinate of the affine point. */
  readonly x: FieldElement;
  /** Y coordinate of the affine point. */
  readonly y: FieldElement;
  /** `true` if this is the point at infinity. */
  readonly inf: boolean;

  /** Add two points on the curve. */
  add(q: CurvePointInterface): CurvePointInterface;

  /** Subtract a point from another on the curve. */
  sub(q: CurvePointInterface): CurvePointInterface;

  /** Additive Inverse of a point. */
  neg(): CurvePointInterface;

  /** Scale a point via `double-and-add`. */
  scale(s: Integer): CurvePointInterface;

  /** Equality check with a point. */
  eq(q: CurvePointInterface): boolean;

  /** String representation of the affine curve point. */
  toString(): string;
}
