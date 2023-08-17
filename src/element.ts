import {Number} from './common';

export class Felt {
  readonly order: bigint;
  readonly n: bigint;

  into(n: Number | Felt): Felt {
    return n instanceof Felt ? n : new Felt(n, this.order);
  }

  constructor(n: Number, p: Number) {
    this.order = BigInt(p);
    this.n = BigInt(n) % this.order;

    // modulo may leave numbers negative, make them positive
    if (this.n < 0n) {
      this.n += this.order;
    }
  }

  toString(radix?: number): string {
    return this.n.toString(radix);
  }

  eq(n: Number | Felt): boolean {
    return this.n === this.into(n).n;
  }

  add(n: Number | Felt): Felt {
    return new Felt(this.n + this.into(n).n, this.order);
  }

  sub(n: Number | Felt): Felt {
    return new Felt(this.n + this.into(n).neg().n, this.order);
  }

  mul(n: Number | Felt): Felt {
    return new Felt(this.n * this.into(n).n, this.order);
  }

  div(n: Number | Felt): Felt {
    return new Felt(this.n * this.into(n).inv().n, this.order);
  }

  exp(n: Number): Felt {
    return new Felt(this.n ** BigInt(n), this.order);
  }

  sign(): boolean {
    return this.n < this.order / 2n;
  }

  // additive inverse
  neg(): Felt {
    return new Felt(this.order - this.n, this.order);
  }

  // multiplicative inverse (uses xgcd?)
  inv(): Felt {
    let low = this.n;

    // 0 has no inverse, just return 0
    if (low === 0n) {
      return new Felt(0, this.order);
    }

    let lm = 1n;
    let hm = 0n;
    let high = this.order;

    while (low > 1n) {
      const r = high / low;
      const nm = hm - lm * r;
      const nw = high - low * r;

      high = low;
      hm = lm;
      lm = nm;
      low = nw;
    }
    return new Felt(lm, this.order);
  }
}
