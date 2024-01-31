import {BinaryFieldElementInput} from '../../types';
import type {IField} from '../interfaces/field';
import {BinaryFieldElement} from './element';

/** A finite field. */
export class BinaryField implements IField<BinaryFieldElementInput> {
  readonly order: bigint = 2n;
  readonly characteristic: bigint = 2n;

  Element(n: BinaryFieldElementInput) {
    return new BinaryFieldElement(this, this.into(n));
  }

  *[Symbol.iterator]() {
    yield this.zero;
    yield this.one;
  }

  get one() {
    return this.Element(true);
  }

  get zero() {
    return this.Element(false);
  }

  random() {
    return this.Element(Math.random() < 0.5);
  }

  toString(): string {
    return `GF(${this.order})`;
  }

  /** A small utility function to extract the underlying value of a field element. */
  into(n: BinaryFieldElementInput): boolean {
    return n instanceof BinaryFieldElement ? n.value : !!n;
  }
}
