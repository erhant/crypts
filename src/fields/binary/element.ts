import {BinaryFieldElementInput, Integer} from '../../types';
import type {IFieldElement} from '../interfaces/';
import {BinaryField} from './field';

/** An element in the finite field. */
export class BinaryFieldElement implements IFieldElement<BinaryFieldElementInput> {
  readonly field: BinaryField;
  readonly value: boolean;

  constructor(field: BinaryField, value: boolean) {
    this.field = field;
    this.value = value;
  }

  /** Create a new element in the same field. */
  new(n: BinaryFieldElementInput) {
    // n ? t
    return this.field.Element(n);
  }

  eq(n: BinaryFieldElementInput) {
    return this.value === this.field.into(n);
  }

  add(n: BinaryFieldElementInput) {
    return this.new(this.value !== this.field.into(n));
  }

  sub(n: BinaryFieldElementInput) {
    return this.new(this.value !== this.field.into(n));
  }

  mul(n: BinaryFieldElementInput) {
    return this.new(this.value && this.field.into(n));
  }

  div(n: BinaryFieldElementInput) {
    return this.mul(this.new(n).inv());
  }

  exp(x: Integer) {
    return (BigInt(x) & 1n) === 0n ? this.field.one : this.new(this.value);
  }

  neg() {
    return this.new(!this.value);
  }

  inv() {
    if (this.value) return this.field.one;
    throw new Error('Cant invert 0.');
  }

  toString(): string {
    return this.value ? '1' : '0';
  }
}
