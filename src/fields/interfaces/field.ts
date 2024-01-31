import type {IFieldElement} from './element';

export interface IField<I> {
  /** Number of elements in the field. */
  readonly order: bigint;
  /** Minimum number of bytes needed to represent the {@link order}. */
  readonly orderBytes: number;
  /** Characteristic of this field.
   *
   * Equals the number of times one must add the additive identity to itself to end up
   * back at itself.
   */
  readonly characteristic: bigint;

  /** A field element. */
  Element(n: I): IFieldElement<I>;

  /** Iterator over elements in the field. */
  [Symbol.iterator](): Generator<IFieldElement<I>, void, unknown>;

  /** The multiplicative identity. */
  get one(): IFieldElement<I>;

  /** The additive identity. */
  get zero(): IFieldElement<I>;

  /** Returns a random field element. */
  random(): IFieldElement<I>;

  /** String representation of the field. */
  toString(): string;
}
