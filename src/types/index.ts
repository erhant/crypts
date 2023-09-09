import {FieldElement, FieldExtensionElement} from '../fields';
import {Polynomial} from '../polynomials';

/** A union of numeric types, suitable for `BigInt` constructor. */
export type Integer = string | number | bigint;

/** An input to work with a Field Element. */
export type FieldElementInput = Integer | FieldElement;

/** An input to work with a Field Extension Element. */
export type FieldExtensionElementInput = FieldElementInput[] | Polynomial | FieldExtensionElement;

/** An affine point `[x, y]`. */
export type PointInput = [FieldElementInput, FieldElementInput];
