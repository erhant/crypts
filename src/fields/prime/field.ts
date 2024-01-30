import {randomNumber} from '../../numbers';
import {FieldElementInput, Integer} from '../../types';
import type {IField} from '../interfaces/field';
import {FieldElement} from './element';

/** A finite field. */
export class Field implements IField<FieldElementInput> {
  readonly order: bigint;
  readonly characteristic: bigint;

  /** A finite field with the given (assumed to be prime) order. */
  constructor(order: Integer) {
    this.order = BigInt(order);
    if (this.order <= 1n) {
      throw new Error('Order must be larger than 1.');
    }

    this.characteristic = this.order;
  }

  Element(n: Integer | FieldElement) {
    return new FieldElement(this, this.into(n));
  }

  *[Symbol.iterator]() {
    for (let n = 0n; n < this.order; n++) {
      yield this.Element(n);
    }
  }

  get one() {
    return this.Element(1);
  }

  get zero() {
    return this.Element(0);
  }

  random() {
    return this.Element(randomNumber(this.order.toString(8).length));
  }

  toString(): string {
    return `GF(${this.order})`;
  }

  /** A small utility function to extract the underlying value of a field element. */
  into(n: FieldElementInput): bigint {
    return n instanceof FieldElement ? n.value : BigInt(n);
  }
}
