import {Number} from './common';
import {randomBytes} from 'crypto';

export class Felt {
  readonly order: bigint;
  readonly n: bigint;

  into(n: Number | Felt): Felt {
    return n instanceof Felt ? n : new Felt(n, this.order);
  }

  constructor(n: Number, p: Number) {
    this.order = BigInt(p);
    this.n = BigInt(n) % this.order;
  }

  toString(radix?: number): string {
    return this.n.toString(radix);
  }

  eq(n: Number | Felt): boolean {
    if (n instanceof Felt) {
      return this.n === n.n;
    } else {
      return this.n === BigInt(n);
    }
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
    return this.into(n).inv().mul(this);
  }

  exp(n: Number): Felt {
    return new Felt(this.n ** BigInt(n), this.order);
  }

  sign(): boolean {
    return this.n < this.order / BigInt(2);
  }

  // additive inverse
  neg(): Felt {
    return new Felt(this.order - this.n, this.order);
  }

  // multiplicative inverse (uses xgcd?)
  inv(): Felt {
    let low = this.n;

    // 0 has no inverse, just return 0
    if (low === BigInt(0)) {
      return new Felt(0, this.order);
    }

    let lm = BigInt(1);
    let hm = BigInt(0);
    let high = this.order;

    while (low > BigInt(1)) {
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
