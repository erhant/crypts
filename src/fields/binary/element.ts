import {Integer} from '../..';
import type {IFieldElement} from '../interfaces/';
import {BinaryField} from './field';

/** An element in the finite field. */
export class BinaryFieldElement implements IFieldElement<BinaryField.Input, BinaryField.Value> {
  readonly field: BinaryField;
  readonly value: BinaryField.Value;

  constructor(field: BinaryField, value: BinaryField.Value) {
    this.field = field;
    this.value = value;
  }

  /** Create a new element in the same field. */
  new(n: BinaryField.Input) {
    return this.field.Element(n);
  }

  eq(n: BinaryField.Input) {
    return this.value === this.field.into(n);
  }

  isZero(): boolean {
    return this.value === 0;
  }

  isOne(): boolean {
    return this.value === 1;
  }

  add(n: BinaryField.Input) {
    return this.new(this.value != this.field.into(n) ? 1 : 0);
  }

  sub(n: BinaryField.Input) {
    return this.new(this.value != this.field.into(n) ? 1 : 0);
  }

  mul(n: BinaryField.Input) {
    return this.new((this.value * this.field.into(n)) as BinaryField.Value);
  }

  div(n: BinaryField.Input) {
    return this.mul(this.new(n).inv());
  }

  exp(x: Integer) {
    return (BigInt(x) & 1n) === 0n ? this.field.one : this.new(this.value);
  }

  neg() {
    return this.new((1 - this.value) as BinaryField.Value);
  }

  inv() {
    if (this.value) return this.field.one;
    throw new Error('Cant invert 0.');
  }

  toString(): string {
    return this.value ? '1' : '0';
  }
}
