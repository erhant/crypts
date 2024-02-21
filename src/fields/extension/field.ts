import {Polynomial} from '../../polynomials';
import {IField} from '../interfaces/field';
import {FieldExtensionElement} from './element';
import {Field} from '../prime/field';

/** An extension of the finite field, defined by an irreducible polynomial from the field.
 *
 * The elements of this extension field is the set of all polynomials modulo the irreducible polynomial,
 * similar to an integer ring modulo some prime number.
 */
export class FieldExtension implements IField<FieldExtension.Input, FieldExtension.Value> {
  readonly order: bigint;
  readonly orderBytes: number;
  readonly characteristic: bigint;
  /** Extension degree. */
  readonly degree: number;
  /** Underlying finite field of this field extension. */
  readonly field: Field; // TODO: make this typed
  /** The irreducible polynomial that is used for extension. */
  readonly poly: Polynomial;

  /** Constructs an extension of the field with an irreducible polynomial. */
  constructor(polynomial: Polynomial) {
    this.poly = polynomial;
    this.field = polynomial.field;
    this.degree = polynomial.degree;

    this.order = polynomial.field.order ** BigInt(polynomial.degree);
    this.orderBytes = this.order.toString(8).length;
    this.characteristic = polynomial.field.order;
  }

  Element(n: FieldExtension.Input): FieldExtension.Element {
    return new FieldExtensionElement(
      this,
      n instanceof FieldExtensionElement ? n.value.coeffs : n instanceof Polynomial ? n.coeffs : n
    );
  }

  into(n: FieldExtension.Input): FieldExtension.Value {
    return n instanceof FieldExtensionElement ? n.value : n instanceof Polynomial ? n : new Polynomial(this.field, n);
  }

  *[Symbol.iterator]() {
    // FIXME: parseInt???
    const orderNumber = parseInt(this.field.order.toString());
    for (let n = 0n; n < this.order; n++) {
      const coeffs = n.toString(orderNumber).padStart(this.degree).split('').reverse();
      yield new FieldExtensionElement(this, coeffs as `${bigint}`[]);
    }
  }

  get one() {
    return this.Element([1]);
  }

  get zero() {
    return this.Element([0]);
  }

  random() {
    return this.Element(Polynomial.random(this.field, this.poly.degree));
  }

  toString() {
    return `GF(${this.field.order}) over ${this.poly}`;
  }
}

export namespace FieldExtension {
  export type Value = Polynomial;
  export type Element = FieldExtensionElement;
  export type Input =
    | Field.Input[] // coefficients
    | FieldExtension.Value
    | FieldExtension.Element;
}
