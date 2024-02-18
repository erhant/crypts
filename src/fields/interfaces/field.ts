import type {IFieldElement} from './element';

/**
 * A finite field interface.
 *
 * @template I input type
 * @template V value type
 */
export interface IField<I, V> {
  /** Number of elements in the field. */
  readonly order: bigint;
  /** Minimum number of bytes needed to represent the {@link order}. */
  readonly orderBytes: number;
  /**
   * Characteristic of this field.
   *
   * Equals the number of times one must add the additive identity to itself to end up
   * back at itself.
   */
  readonly characteristic: bigint;

  /** A field element. */
  Element(n: I): IFieldElement<I, V>;

  /** Iterator over elements in the field. */
  [Symbol.iterator](): Generator<IFieldElement<I, V>, void, unknown>;

  /** The multiplicative identity. */
  get one(): IFieldElement<I, V>;

  /** The additive identity. */
  get zero(): IFieldElement<I, V>;

  /** Returns a random field element. */
  random(): IFieldElement<I, V>;

  /** String representation of the field. */
  toString(): string;
}
