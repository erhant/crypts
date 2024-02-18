import type {FieldElement} from '../fields';

/** A union of numeric types, suitable for `BigInt` constructor. */
export type Integer = `${bigint}` | number | bigint | boolean;

/** An input to work with a Prıme Field Element. */
export type FieldElementInput = Integer | FieldElement;

/** An affine point `[x, y]`. */
export type PointInput = [FieldElementInput, FieldElementInput];
