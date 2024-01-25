import {Field} from '../..';
import {CurvePointInterface} from './point';

export interface CurveInterface<I, V> {
  /** Base field. */
  readonly field: Field;

  /** A point on the elliptic curve. */
  Point(p: I): CurvePointInterface<I, V>;

  /** Returns true if given point is on the curve, i.e. satisfies the curve equation. */
  satisfies(point: I): boolean;

  /** Neutral element, the point at infinity. */
  get inf(): CurvePointInterface<I, V>;

  /** String representation of the elliptic curve. */
  toString(): string;
}
