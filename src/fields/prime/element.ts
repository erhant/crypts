import {FieldElementInput, Integer} from '../../types';
import type {IFieldElement} from '../interfaces/';
import {Field} from './field';

/** A small utility function to extract the underlying value of a field element. */
function into(n: FieldElementInput): bigint {
  return n instanceof FieldElement ? n.value : BigInt(n);
}

/** An element in the finite field. */
export class FieldElement implements IFieldElement<FieldElementInput> {
  readonly field: Field;
  readonly value: bigint;

  constructor(field: Field, value: bigint) {
    this.field = field;
    this.value = value % field.order;
    if (this.value < 0n) {
      this.value += field.order;
    }
  }

  /** Create a new element in the same field. */
  new(n: FieldElementInput) {
    return this.field.Element(n);
  }

  eq(n: FieldElementInput) {
    return this.value === into(n);
  }

  add(n: FieldElementInput) {
    return this.new(this.value + into(n));
  }

  sub(n: FieldElementInput) {
    return this.add(this.new(n).neg());
  }

  mul(n: FieldElementInput) {
    return this.new(this.value * into(n));
  }

  div(n: FieldElementInput) {
    return this.mul(this.new(n).inv());
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

  neg() {
    return this.new(this.field.order - this.value);
  }

  inv() {
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

  toString(radix?: number) {
    return this.value.toString(radix);
  }
}
