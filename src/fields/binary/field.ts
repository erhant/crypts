import type {IField} from '../interfaces/field';
import {BinaryFieldElement} from './element';

export class BinaryField implements IField<BinaryField.Input, BinaryField.Value> {
  readonly order: bigint = 2n;
  readonly orderBytes: number = 1;
  readonly characteristic: bigint = 2n;

  Element(n: BinaryField.Input): BinaryField.Element {
    return new BinaryFieldElement(this, this.into(n));
  }

  into(n: BinaryField.Input): BinaryField.Value {
    return n instanceof BinaryFieldElement ? n.value : n;
  }

  *[Symbol.iterator]() {
    yield this.zero;
    yield this.one;
  }

  get one() {
    return this.Element(1);
  }

  get zero() {
    return this.Element(0);
  }

  random() {
    return this.Element(Math.round(Math.random()) as 0 | 1);
  }

  toString() {
    return `GF(2)`;
  }
}

export namespace BinaryField {
  export type Value = 0 | 1;
  export type Element = BinaryFieldElement;
  export type Input = BinaryField.Value | BinaryField.Element;
}
