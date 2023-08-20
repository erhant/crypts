import {Number} from './common';
import {Field} from './field';
import {Polynomial} from './polynomial';

/** An extension of the finite field, defined by an irreducible polynomial from the field.
 *
 * The elements of this extension field is the set of all polynomials modulo the irreducible polynomial,
 * similar to an integer ring modulo some prime number.
 */
export class Extension {
  readonly polynomial: Polynomial;

  /** Constructs an extension of the field with an irreducible polynomial. The
   * extended field is that of the polynomial.
   */
  constructor(polynomial: Polynomial) {
    this.polynomial = polynomial;
  }

  /** Get elements in the field. */
  *[Symbol.iterator]() {
    for (let n = 0n; n < this.field.order ** this.degree; n++) {
      const coeffs = n.toString(this.field.order).padStart(this.degree).split('').reverse();
      yield this.field.Polynomial(coeffs);
    }
  }

  /** Underlying field of this field extension. */
  get field(): Field {
    return this.polynomial.field;
  }

  /** Extension degree. */
  get degree(): number {
    return this.polynomial.degree;
  }
}
