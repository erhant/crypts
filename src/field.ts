import {randomBytes} from 'crypto';
import {Number} from './common';
import {Felt} from './element';
import {Polynomial} from './polynomial';

export function Field(order: Number) {
  if (BigInt(order) < 2n) {
    throw new Error('Order must be larger than 1.');
  }

  return class extends Felt {
    constructor(n: Number) {
      super(n, order);
    }

    static one(): Felt {
      return new this(1);
    }

    static zero(): Felt {
      return new this(0);
    }

    static random(): Felt {
      return new Felt(BigInt('0x' + randomBytes(order.toString(8).length).toString('hex')), order);
    }

    static poly(symbol: string) {
      return class extends Polynomial {
        constructor(coeffs: (Number | Felt)[]) {
          super(coeffs, order, symbol);
        }
      };
    }
  };
}
