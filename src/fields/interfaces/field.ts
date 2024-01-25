import type {IFieldElement} from './element';

export interface IField<I> {
  /** Number of elements in the field. */
  readonly order: bigint;
  /** Characteristic of this field. */
  readonly characteristic: bigint;

  /** A field element. */
  Element(n: I): IFieldElement<I>;

  /** Iterator over elements in the field. */
  [Symbol.iterator](): Generator<unknown, void, IFieldElement<I>>;

  /** The multiplicative identity. */
  get one(): IFieldElement<I>;

  /** The additive identity. */
  get zero(): IFieldElement<I>;

  /** Returns a random field element. */
  random(): IFieldElement<I>;

  /** String representation of the field. */
  toString(): string;
}
