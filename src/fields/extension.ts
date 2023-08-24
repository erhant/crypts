import {Field, FieldElement} from '.';
import {Number} from '../common';
import {Polynomial} from '../polynomials';
import {polynomialExtendedEuclideanAlgorithm} from '../polynomials/euclidean';

/** An extension of the finite field, defined by an irreducible polynomial from the field.
 *
 * The elements of this extension field is the set of all polynomials modulo the irreducible polynomial,
 * similar to an integer ring modulo some prime number.
 */
export class FieldExtension {
  readonly order: bigint;
  readonly mod: Polynomial;

  /** Constructs an extension of the field with an irreducible polynomial.
   * The extended field is that of the polynomial.
   */
  constructor(polynomial: Polynomial) {
    this.mod = polynomial;
    this.order = polynomial.field.order ** BigInt(polynomial.degree);
  }

  /** A field element in modulo `order`. */
  Element(n: (Number | FieldElement)[] | Polynomial | FieldExtensionElement): FieldExtensionElement {
    return new FieldExtensionElement(
      this,
      n instanceof FieldExtensionElement ? n.value.coeffs : n instanceof Polynomial ? n.coeffs : n
    );
  }

  /** A polynomial over the field. */
  Polynomial(coefficients: (Number | FieldElement)[]): Polynomial {
    if (coefficients.length >= this.degree + 1) {
      throw new Error('Degree too high'); // TODO: better error msg
    }

    return new Polynomial(this.field, coefficients);
  }

  /** Get elements in the field, that are the polynomials with degree strictly less than
   * that of the irreducible polynomial.
   */
  *[Symbol.iterator]() {
    const orderNumber = parseInt(this.field.order.toString());
    for (let n = 0n; n < this.order; n++) {
      const coeffs = n.toString(orderNumber).padStart(this.degree).split('').reverse();
      yield new Polynomial(this.field, coeffs);
    }
  }

  /** Underlying field of this field extension. */
  get field(): Field {
    return this.mod.field;
  }

  /** Extension degree. */
  get degree(): number {
    return this.mod.degree;
  }

  /**
   * Characteristic of this field, that is the smallest number of times one must add the multiplicative
   * identity to itself to get the additive identity.
   */
  get characteristic(): bigint {
    return this.field.order;
  }
}

type FieldExtensionElementInput = Polynomial | (Number | FieldElement)[] | FieldExtensionElement;

export class FieldExtensionElement {
  readonly extension: FieldExtension;
  readonly value: Polynomial;

  constructor(extension: FieldExtension, coefficients: (Number | FieldElement)[]) {
    if (coefficients.length >= extension.degree + 1) {
      throw new Error('Degree too high'); // TODO: better error msg
    }

    coefficients = coefficients.map(extension.field.Element);

    this.extension = extension;
    this.value = extension.field.Polynomial(coefficients);
  }

  /** Equality check with a field elements or number. */
  eq(q: FieldExtensionElementInput): boolean {
    return this.value.eq(this.extension.Element(q).value);
  }

  /** Addition in the field. */
  add(q: FieldExtensionElementInput): Polynomial {
    return this.value.add(this.extension.Element(q).value).mod(this.extension.mod);
  }

  /** Addition with additive inverse in the field. */
  sub(q: FieldExtensionElementInput): Polynomial {
    return this.value.sub(this.extension.Element(q).value).mod(this.extension.mod);
  }

  /** Multiplication in the field. */
  mul(q: FieldExtensionElementInput): Polynomial {
    return this.value.mul(this.extension.Element(q).value).mod(this.extension.mod);
  }

  /** Multiplication with multiplicative inverse in the field. */
  div(n: Number | FieldElement): FieldElement {
    // TODO
  }

  /** Exponentiation in the field. */
  exp(n: Number): FieldElement {
    // TODO
  }

  /** Additive inverse in the field. */
  neg(): Polynomial {
    return this.extension.Polynomial(this.value.coeffs.map(c => c.neg()));
  }

  /** Multiplicative inverse in the field, using Extended Euclidean Algorithm. */
  inv(): Polynomial {
    const xgcd = polynomialExtendedEuclideanAlgorithm(this.extension.mod, this.value);
    return xgcd[2];
  }
}
