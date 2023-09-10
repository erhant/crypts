import type {Integer} from '../types';

export interface FieldInterface<I> {
  /** Number of elements in the field. */
  readonly order: bigint;
  /** Characteristic of this field. */
  readonly characteristic: bigint;

  /** A field element. */
  Element(n: I): FieldElementInterface<I>;

  /** Iterator over elements in the field. */
  [Symbol.iterator](): Generator<unknown, void, FieldElementInterface<I>>;

  /** The multiplicative identity. */
  get one(): FieldElementInterface<I>;

  /** The additive identity. */
  get zero(): FieldElementInterface<I>;

  /** Returns a random field element. */
  random(): FieldElementInterface<I>;

  /** String representation of the field. */
  toString(): string;
}

export interface FieldElementInterface<I> {
  /** The field that this element belongs to. */
  readonly field: FieldInterface<I>;

  /** Equality check with a field elements or number. */
  eq(n: I): boolean;

  /** Addition in the field. */
  add(n: I): FieldElementInterface<I>;

  /** Addition with additive inverse in the field. */
  sub(n: I): FieldElementInterface<I>;

  /** Multiplication in the field. */
  mul(n: I): FieldElementInterface<I>;

  /** Multiplication with multiplicative inverse in the field. */
  div(n: I): FieldElementInterface<I>;

  /** Exponentiation in the field via [square-and-multiply](https://en.wikipedia.org/wiki/Exponentiation_by_squaring). */
  exp(x: Integer): FieldElementInterface<I>;

  /** Additive inverse in the field. */
  neg(): FieldElementInterface<I>;

  /** Multiplicative inverse in the field, using [Extended Euclidean Algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Modular_integers). */
  inv(): FieldElementInterface<I>;

  /** String representation of the field element. */
  toString(): string;
}
