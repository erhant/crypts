import type {IField} from './field';
import type {Integer} from '../../types';

/**
 * A finite field element interface.
 *
 * @template I input type
 * @template V value type
 */
export interface IFieldElement<I, V> {
  /** The field that this element belongs to. */
  readonly field: IField<I, V>;
  /** Value of this element. */
  readonly value: V;

  /** Equality check with a field elements or number. */
  eq(n: I): boolean;

  /** Addition in the field. */
  add(n: I): IFieldElement<I, V>;

  /** Addition with additive inverse in the field. */
  sub(n: I): IFieldElement<I, V>;

  /** Multiplication in the field. */
  mul(n: I): IFieldElement<I, V>;

  /** Multiplication with multiplicative inverse in the field. */
  div(n: I): IFieldElement<I, V>;

  /** Exponentiation in the field via
   * [square-and-multiply](https://en.wikipedia.org/wiki/Exponentiation_by_squaring). */
  exp(x: Integer): IFieldElement<I, V>;

  /** Additive inverse in the field.
   *
   * @returns `-1 * this`
   */
  neg(): IFieldElement<I, V>;

  /** Multiplicative inverse in the field, using
   * [Extended Euclidean Algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Modular_integers).
   *
   * @returns `1 / this`
   */
  inv(): IFieldElement<I, V>;

  /** String representation of the field element. */
  toString(): string;
}
