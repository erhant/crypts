import {Field} from '.';
import {FieldElementInput, FieldExtensionElementInput, Integer} from '../types';
import {Polynomial} from '../polynomials';

/** An extension of the finite field, defined by an irreducible polynomial from the field.
 *
 * The elements of this extension field is the set of all polynomials modulo the irreducible polynomial,
 * similar to an integer ring modulo some prime number.
 */
export class FieldExtension {
  /** Number of elements in the extension field. */
  readonly order: bigint;
  /** The irreducible polynomial that is used for extension. */
  readonly poly: Polynomial;

  /** Constructs an extension of the field with an irreducible polynomial. */
  constructor(polynomial: Polynomial) {
    this.poly = polynomial;
    this.order = polynomial.field.order ** BigInt(polynomial.degree);
  }

  /** A field element in modulo `order`. */
  Element(n: FieldExtensionElementInput): FieldExtensionElement {
    return new FieldExtensionElement(
      this,
      n instanceof FieldExtensionElement ? n.value.coeffs : n instanceof Polynomial ? n.coeffs : n
    );
  }

  /** Get elements in the field. */
  *[Symbol.iterator]() {
    const orderNumber = parseInt(this.field.order.toString());
    for (let n = 0n; n < this.order; n++) {
      const coeffs = n.toString(orderNumber).padStart(this.degree).split('').reverse();
      yield new Polynomial(this.field, coeffs);
    }
  }

  /** The multiplicative identity. */
  get one(): FieldExtensionElement {
    return this.Element([1]);
  }

  /** The additive identity. */
  get zero(): FieldExtensionElement {
    return this.Element([0]);
  }

  /** Underlying field of this field extension. */
  get field(): Field {
    return this.poly.field;
  }

  /** Extension degree. */
  get degree(): number {
    return this.poly.degree;
  }

  /**
   * Characteristic of this field, that is the smallest number of times one must add the multiplicative
   * identity to itself to get the additive identity.
   */
  get characteristic(): bigint {
    return this.field.order;
  }

  /** String representation of the field. */
  toString(): string {
    return `GF(${this.field.order}) over ${this.poly}`;
  }
}

export class FieldExtensionElement {
  readonly extension: FieldExtension;
  readonly value: Polynomial;

  constructor(extension: FieldExtension, coefficients: FieldElementInput[]) {
    coefficients = coefficients.map(c => extension.field.Element(c));
    this.extension = extension;

    const poly = extension.field.Polynomial(coefficients);
    if (poly.degree >= this.extension.poly.degree) {
      this.value = poly.mod(this.extension.poly);
    } else {
      this.value = poly;
    }
  }

  /** Equality check with a field elements or number. */
  eq(q: FieldExtensionElementInput): boolean {
    return this.value.eq(this.extension.Element(q).value);
  }

  /** Addition in the field. */
  add(q: FieldExtensionElementInput): FieldExtensionElement {
    return this.extension.Element(this.value.add(this.extension.Element(q).value));
  }

  /** Addition with additive inverse in the field. */
  sub(q: FieldExtensionElementInput): FieldExtensionElement {
    return this.add(this.extension.Element(q).neg());
  }

  /** Multiplication in the field. */
  mul(q: FieldExtensionElementInput): FieldExtensionElement {
    return this.extension.Element(this.value.mul(this.extension.Element(q).value));
  }

  /** Multiplication with multiplicative inverse in the field. */
  div(q: FieldExtensionElementInput): FieldExtensionElement {
    return this.mul(this.extension.Element(q).inv());
  }

  /** Additive inverse in the field. */
  neg(): FieldExtensionElement {
    return this.extension.Element(this.value.coeffs.map(c => c.neg()));
  }

  /** Exponentiation in the field. via [square-and-multiply](https://en.wikipedia.org/wiki/Exponentiation_by_squaring). */
  exp(x: Integer): FieldExtensionElement {
    let e = BigInt(x);
    if (e === 0n) {
      return this.extension.one;
    }

    let ans = this.extension.Element(this.value);

    if (e === 1n) {
      return ans;
    }
    if (e === 2n) {
      return ans.mul(ans);
    }

    for (e >>= 1n; e > 0n; e >>= 1n) {
      ans = ans.mul(ans);
      if (e % 2n === 1n) {
        ans = ans.mul(this);
      }
    }
    return ans;
  }

  /** Multiplicative inverse in the field, using [Extended Euclidean Algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Simple_algebraic_field_extensions). */
  inv(): FieldExtensionElement {
    let [r, rr] = [this.extension.poly, this.value];
    let [t, tt] = [this.extension.zero.value, this.extension.one.value];

    let quot, tmp;

    // (while rr is not the zero polynomial)
    while (rr.lead !== 0n) {
      quot = r.div(rr);

      tmp = tt;
      tt = t.sub(quot.mul(tt));
      t = tmp;

      tmp = rr;
      rr = r.sub(quot.mul(rr));
      r = tmp;
    }

    if (r.degree > 0) {
      throw new Error('This polynomial does not have an inverse.');
    }

    // return (1/r) * t
    return this.extension.Element(t.scale(r.coeffs[0].inv()));
  }

  /** String representation of the field element, with optional symbol. */
  toString(symbol = 'x') {
    return this.value.toString(symbol);
  }
}
