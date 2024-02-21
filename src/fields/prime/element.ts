import {Integer} from '../..';
import type {IFieldElement} from '../interfaces/';
import {Field} from './field';

/** An element in the finite field. */
export class FieldElement implements IFieldElement<Field.Input, Field.Value> {
  readonly field: Field;
  readonly value: Field.Value;

  constructor(field: Field, value: Field.Value) {
    this.field = field;
    this.value = value % field.order;
    if (this.value < 0n) {
      this.value += field.order;
    }
  }

  /** Create a new element in the same field. */
  new(n: Field.Input) {
    return this.field.Element(n);
  }

  eq(n: Field.Input) {
    return this.value === this.field.into(n);
  }

  isZero(): boolean {
    return this.value === 0n;
  }

  isOne(): boolean {
    return this.value === 1n;
  }

  add(n: Field.Input) {
    return this.new(this.value + this.field.into(n));
  }

  sub(n: Field.Input) {
    return this.add(this.new(n).neg());
  }

  mul(n: Field.Input) {
    return this.new(this.value * this.field.into(n));
  }

  div(n: Field.Input) {
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
      throw new Error(`${this.value} does not have an inverse. (mod ${this.field.order})`);
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
