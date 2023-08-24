import {Felt, FieldExtension} from '.';
import {Number} from '../common';
import {Polynomial} from '../polynomials';

/** An extension of the finite field, defined by an irreducible polynomial from the field.
 *
 * The elements of this extension field is the set of all polynomials modulo the irreducible polynomial,
 * similar to an integer ring modulo some prime number.
 */
export class FieldExtensionElement extends Polynomial {
  readonly extension: FieldExtension;
  /**
   * Create a polynomial with the provided coefficients within a finite field of given order.
   * If no coefficients are given, it is treated like a zero polynomial.
   *
   * Right-padded zeros are ignored.
   */
  constructor(extension: FieldExtension, coefficients: (Number | Felt)[]) {
    super(extension.field, new Polynomial(extension.field, coefficients).rem(extension.mod).coeffs);
    this.extension = extension;
  }

  /** Polynomial addition in extension field. */
  add(q: Polynomial): Polynomial {
    return super.add(q).rem(this.extension.mod);
  }

  /** Polynomial subtraction in field. */
  sub(q: Polynomial): Polynomial {
    return super.sub(q).rem(this.extension.mod);
  }

  /** Polynomial multiplication in field. */
  mul(q: Polynomial): Polynomial {
    return super.mul(q).rem(this.extension.mod);
  }

  /** Quotient after polynomial long-division in field. */
  div(q: Polynomial): Polynomial {
    return super.div(q).rem(this.extension.mod);
  }

  /** Remainder after polynomial long-division in field. */
  rem(q: Polynomial): Polynomial {
    return super.rem(q).rem(this.extension.mod);
  }

  /** Multiply all coefficients with a scalar. */
  scale(s: Number | Felt): Polynomial {
    return super.scale(s).rem(this.extension.mod);
  }
}
