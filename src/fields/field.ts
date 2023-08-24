import {randomBytes} from 'crypto';
import {Number} from '../common';
import {extendedEuclideanAlgorithm} from '../utils';
import {Polynomial} from '../polynomials';

// https://github.com/microsoft/TypeScript/issues/30355

/** A finite field. */
export class Field {
  readonly order: bigint;

  /** A finite field with the given order.
   *
   * To see the elements in the field, you can use the iterator:
   *
   * ```ts
   * const F13 = new Field(13);
   * for (const n of F13) {
   *    console.log(""+n) // or `n.toString()`
   * }
   * ```
   */
  constructor(order: Number) {
    this.order = BigInt(order);
    if (this.order < 2n) {
      throw new Error('Order must be larger than 1.');
    }
  }

  /** A field element in modulo `order`. */
  Element(n: Number | FieldElement): FieldElement {
    return new FieldElement(this, n instanceof FieldElement ? n.value : n);
  }

  /** A polynomial over the field. */
  Polynomial(coefficients: (Number | FieldElement)[]) {
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
    this.value = BigInt(number) % BigInt(field.order);
    if (this.value < 0n) {
      this.value += BigInt(field.order);
    }
  }

  /** Equality check with a field elements or number. */
  eq(n: Number | FieldElement): boolean {
    return this.value === this.field.Element(n).value;
  }

  /** Addition in the field. */
  add(n: Number | FieldElement): FieldElement {
    return this.field.Element(this.value + this.field.Element(n).value);
  }

  /** Addition with additive inverse in the field. */
  sub(n: Number | FieldElement): FieldElement {
    return this.field.Element(this.value + this.field.Element(n).neg().value);
  }

  /** Multiplication in the field. */
  mul(n: Number | FieldElement): FieldElement {
    return this.field.Element(this.value * this.field.Element(n).value);
  }

  /** Multiplication with multiplicative inverse in the field. */
  div(n: Number | FieldElement): FieldElement {
    return this.field.Element(this.value * this.field.Element(n).inv().value);
  }

  /** Exponentiation in the field. */
  exp(n: Number): FieldElement {
    return this.field.Element(this.value ** BigInt(n));
  }

  /** Additive inverse in the field. */
  neg(): FieldElement {
    return this.field.Element(BigInt(this.field.order) - this.value);
  }

  /** Multiplicative inverse in the field, using Extended Euclidean Algorithm. */
  inv(): FieldElement {
    const xgcd = extendedEuclideanAlgorithm(this.field.order, this.value);
    return this.field.Element(xgcd[2]);
  }

  /** String representation of the field element, with optional radix. */
  toString(radix?: number): string {
    return this.value.toString(radix);
  }
}
