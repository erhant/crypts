import {Polynomial} from '../../polynomials';
import {IFieldElement} from '../interfaces';
import {FieldExtension} from './field';
import {Field} from '../prime';
import {Integer} from '../..';

export class FieldExtensionElement implements IFieldElement<FieldExtension.Input, FieldExtension.Value> {
  readonly field: FieldExtension;
  readonly value: Polynomial;

  constructor(extension: FieldExtension, coefficients: Field.Input[]) {
    coefficients = coefficients.map(c => extension.field.Element(c));
    this.field = extension;

    const poly = new Polynomial(extension.field, coefficients);
    if (poly.degree >= extension.poly.degree) {
      this.value = poly.mod(extension.poly);
    } else {
      this.value = poly;
    }
  }

  /** Create a new element in the same field. */
  new(n: FieldExtension.Input) {
    return this.field.Element(n);
  }

  eq(q: FieldExtension.Input) {
    return this.value.eq(this.new(q).value);
  }

  add(q: FieldExtension.Input) {
    return this.new(this.value.add(this.new(q).value));
  }

  sub(q: FieldExtension.Input) {
    return this.add(this.new(q).neg());
  }

  mul(q: FieldExtension.Input) {
    return this.new(this.value.mul(this.new(q).value));
  }

  div(q: FieldExtension.Input) {
    return this.mul(this.new(q).inv());
  }

  neg() {
    return this.new(this.value.coeffs.map(c => c.neg()));
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

  inv() {
    let [r, rr] = [this.field.poly, this.value];
    let [t, tt] = [this.field.zero.value, this.field.one.value];

    let quot, tmp;

    // (while rr is not the zero polynomial)
    while (rr.lead !== 0n) {
      quot = r.div(rr);

      tmp = tt;
      tt = t.sub(quot.mul(tt));
      t = tmp;

      tmp = rr;
      rr = r.sub(quot.mul(rr));
      r = tmp;
    }

    if (r.degree > 0) {
      throw new Error('This polynomial does not have an inverse.');
    }

    // return (1/r) * t
    return this.new(t.scale(r.coeffs[0].inv()));
  }

  /** String representation of the field element, with optional symbol. */
  toString(symbol = 'x') {
    return this.value.toString(symbol);
  }
}
