import {randomBytes} from 'crypto';
import {FieldElementInput, Number} from '../types';
import {Polynomial} from '../polynomials';

// https://github.com/microsoft/TypeScript/issues/30355

/** A finite field. */
export class Field {
  readonly order: bigint;

  /** A finite field with the given (assumed to be prime) order. */
  constructor(order: Number) {
    this.order = BigInt(order);
    if (this.order <= 1n) {
      throw new Error('Order must be larger than 1.');
    }
  }

  /** A field element in modulo `order`. */
  Element(n: FieldElementInput): FieldElement {
    return new FieldElement(this, n instanceof FieldElement ? n.value : n);
  }

  /** A polynomial with coefficients over the field. */
  Polynomial(coefficients: FieldElementInput[]): Polynomial {
    return new Polynomial(this, coefficients);
  }

  /** Get elements in the field. */
  *[Symbol.iterator]() {
    for (let n = 0n; n < this.order; n++) {
      yield this.Element(n);
    }
  }

  /** The multiplicative identity. */
  get one(): FieldElement {
    return this.Element(1);
  }

  /** The additive identity. */
  get zero(): FieldElement {
    return this.Element(0);
  }

  /**
   * Characteristic of this field, that is the smallest number of times one must add the multiplicative
   * identity to itself to get the additive identity.
   */
  get characteristic(): bigint {
    return this.order;
  }

  /** Returns a random field element. */
  random(): FieldElement {
    return this.Element(BigInt('0x' + randomBytes(this.order.toString(8).length).toString('hex')));
  }
}

/** An element in the finite field. */
export class FieldElement {
  readonly field: Field;
  readonly value: bigint;

  constructor(field: Field, number: Number) {
    this.field = field;
    this.value = BigInt(number) % field.order;
    if (this.value < 0n) {
      this.value += field.order;
    }
  }

  /** Equality check with a field elements or number. */
  eq(n: FieldElementInput): boolean {
    return this.value === this.field.Element(n).value;
  }

  /** Addition in the field. */
  add(n: FieldElementInput): FieldElement {
    return this.field.Element(this.value + this.field.Element(n).value);
  }

  /** Addition with additive inverse in the field. */
  sub(n: FieldElementInput): FieldElement {
    return this.add(this.field.Element(n).neg());
  }

  /** Multiplication in the field. */
  mul(n: FieldElementInput): FieldElement {
    return this.field.Element(this.value * this.field.Element(n).value);
  }

  /** Multiplication with multiplicative inverse in the field. */
  div(n: FieldElementInput): FieldElement {
    return this.mul(this.field.Element(n).inv());
  }

  /** Exponentiation in the field. */
  exp(n: FieldElementInput): FieldElement {
    return this.field.Element(this.value ** this.field.Element(n).value);
  }

  /** Additive inverse in the field. */
  neg(): FieldElement {
    return this.field.Element(BigInt(this.field.order) - this.value);
  }

  /** Multiplicative inverse in the field, using [Extended Euclidean Algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Modular_integers). */
  inv(): FieldElement {
    let [r, rr] = [this.field.order, this.value];
    let [t, tt] = [0n, 1n];

    let quot, tmp;
    while (rr !== 0n) {
      quot = r / rr;

      tmp = tt;
      tt = t - quot * tt;
      t = tmp;

      tmp = rr;
      rr = r - quot * rr;
      r = tmp;
    }

    if (r > 1n) {
      throw new Error(`${this.value} does not have inverse mod ${this.field.order}.`);
    }
    if (t < 0n) {
      t += this.field.order;
    }

    return this.field.Element(t);
  }

  /** String representation of the field element, with optional radix. */
  toString(radix?: number): string {
    return this.value.toString(radix);
  }
}
