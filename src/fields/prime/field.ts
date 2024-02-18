import {randomNumber} from '../../numbers';
import {Integer} from '../../types';
import type {IField} from '../interfaces/field';
import {FieldElement} from './element';

/** A finite field. */
export class Field implements IField<Field.Input, Field.Value> {
  readonly order: bigint;
  readonly orderBytes: number;
  readonly characteristic: bigint;

  /** A finite field with the given (assumed to be prime) order. */
  constructor(order: Integer) {
    this.order = BigInt(order);
    if (this.order <= 1n) {
      throw new Error('Order must be larger than 1.');
    }

    this.characteristic = this.order;
    this.orderBytes = this.order.toString(8).length;
  }

  Element(n: Field.Input) {
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
  into(n: Field.Input): bigint {
    return n instanceof FieldElement ? n.value : BigInt(n);
  }
}

export namespace Field {
  export type Value = bigint;
  export type Element = FieldElement;
  export type Input = Integer | Field.Value | Field.Element;
}
