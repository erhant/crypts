type Number = string | number | bigint;

export interface Felt {
  readonly order: bigint;
  readonly n: bigint;

  add(n: Number): bigint;
  sub(n: Number): bigint;
  mul(n: Number): bigint;
  neg(): bigint;
  sign(): boolean;
}

export function Field(order: Number) {
  class Felt implements Felt {
    readonly order = BigInt(order);
    readonly n: bigint;

    constructor(n: Number) {
      this.n = BigInt(n) % this.order;
    }

    add(n: Number): Number {
      return (this.n + BigInt(n)) % this.order;
    }

    sub(n: Felt): Felt {
      return new Felt(this.n - n.n);
    }

    mul(n: Felt): Felt {
      return new Felt(this.n * n.n);
    }

    neg(): Felt {
      return new Felt(this.order - this.n);
    }

    sign(): boolean {
      return this.n < this.order / BigInt(2);
    }
  }

  return (n: string | number | bigint) => new Felt(n);
}
