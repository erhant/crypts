import {Field} from '.';
import {FieldElementInput, FieldExtensionElementInput, Integer} from '../types';
import {Polynomial} from '../polynomials';
import {FieldElementInterface, FieldInterface} from './interface';

/** An extension of the finite field, defined by an irreducible polynomial from the field.
 *
 * The elements of this extension field is the set of all polynomials modulo the irreducible polynomial,
 * similar to an integer ring modulo some prime number.
 */
export class FieldExtension implements FieldInterface<FieldExtensionElementInput> {
  readonly order: bigint;
  readonly characteristic: bigint;
  /** Extension degree. */
  readonly degree: number;
  /** Underlying finite field of this field extension. */
  readonly field: Field;
  /** The irreducible polynomial that is used for extension. */
  readonly poly: Polynomial;

  /** Constructs an extension of the field with an irreducible polynomial. */
  constructor(polynomial: Polynomial) {
    this.poly = polynomial;
    this.field = polynomial.field;
    this.degree = polynomial.degree;

    this.order = polynomial.field.order ** BigInt(polynomial.degree);
    this.characteristic = polynomial.field.order;
  }

  Element(n: FieldExtensionElementInput) {
    return new FieldExtensionElement(
      this,
      n instanceof FieldExtensionElement ? n.value.coeffs : n instanceof Polynomial ? n.coeffs : n
    );
  }

  *[Symbol.iterator]() {
    const orderNumber = parseInt(this.field.order.toString());
    for (let n = 0n; n < this.order; n++) {
      const coeffs = n.toString(orderNumber).padStart(this.degree).split('').reverse();
      yield new Polynomial(this.field, coeffs);
    }
  }

  get one() {
    return this.Element([1]);
  }

  get zero() {
    return this.Element([0]);
  }

  random() {
    return this.Element([1]); // TODO
  }

  toString() {
    return `GF(${this.field.order}) over ${this.poly}`;
  }
}

export class FieldExtensionElement implements FieldElementInterface<FieldExtensionElementInput> {
  readonly field: FieldExtension;
  readonly value: Polynomial;

  constructor(extension: FieldExtension, coefficients: FieldElementInput[]) {
    coefficients = coefficients.map(c => extension.field.Element(c));
    this.field = extension;

    const poly = new Polynomial(extension.field, coefficients);
    if (poly.degree >= extension.poly.degree) {
      this.value = poly.mod(extension.poly);
    } else {
      this.value = poly;
    }
  }

  /** Create a new element in the same field. */
  new(n: FieldExtensionElementInput) {
    return this.field.Element(n);
  }

  eq(q: FieldExtensionElementInput) {
    return this.value.eq(this.new(q).value);
  }

  add(q: FieldExtensionElementInput) {
    return this.new(this.value.add(this.new(q).value));
  }

  sub(q: FieldExtensionElementInput) {
    return this.add(this.new(q).neg());
  }

  mul(q: FieldExtensionElementInput) {
    return this.new(this.value.mul(this.new(q).value));
  }

  div(q: FieldExtensionElementInput) {
    return this.mul(this.new(q).inv());
  }

  neg() {
    return this.new(this.value.coeffs.map(c => c.neg()));
  }

  exp(x: Integer) {
    let ans = this.field.one;
    let base = this.new(this);
    for (let e = BigInt(x); e > 0n; e >>= 1n) {
      if (e % 2n === 1n) {
        ans = ans.mul(base);
      }
      base = base.mul(base);
    }
    return ans;
  }

  inv() {
    let [r, rr] = [this.field.poly, this.value];
    let [t, tt] = [this.field.zero.value, this.field.one.value];

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
    return this.new(t.scale(r.coeffs[0].inv()));
  }

  /** String representation of the field element, with optional symbol. */
  toString(symbol = 'x') {
    return this.value.toString(symbol);
  }
}
