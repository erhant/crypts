import type {FieldElement, FieldExtensionElement, BinaryFieldElement} from '../fields';
import type {Polynomial} from '../polynomials';

/** A union of numeric types, suitable for `BigInt` constructor. */
export type Integer = Parameters<typeof BigInt>[0];

/** An input to work with a Binary Field Element. */
export type BinaryFieldElementInput = boolean | 0 | 1 | BinaryFieldElement;

/** An input to work with a Prıme Field Element. */
export type FieldElementInput = Integer | FieldElement;

/** An input to work with a Field Extension Element. */
export type FieldExtensionElementInput = Polynomial | FieldElementInput[] | FieldExtensionElement;

/** An affine point `[x, y]`. */
export type PointInput = [FieldElementInput, FieldElementInput];
