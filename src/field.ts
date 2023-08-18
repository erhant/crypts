import {randomBytes} from 'crypto';
import {Number} from './common';
import {Felt} from './element';
import {Polynomial} from './polynomial';

// https://github.com/microsoft/TypeScript/issues/30355

/** Creates a field with given order.
 * It is better if you provide a prime number for things to work smoothly.
 */
export function Field(order: Number) {
  if (BigInt(order) < 2n) {
    throw new Error('Order must be larger than 1.');
  }

  return class extends Felt {
    /** Creates a field element. */
    constructor(n: Number) {
      super(n, order);
    }

    /** The multiplicative identity. */
    static get one(): Felt {
      return new this(1);
    }

    /** The additive identity. */
    static get zero(): Felt {
      return new this(0);
    }

    /** Returns a random field element. */
    static random(): Felt {
      return new Felt(BigInt('0x' + randomBytes(order.toString(8).length).toString('hex')), order);
    }

    /** Creates a Polynomial class with coefficients defined over this Field, and an optional symbol. */
    static Polynomial(symbol = 'x') {
      return class extends Polynomial {
        constructor(coeffs: (Number | Felt)[]) {
          super(coeffs, order, symbol);
        }
      };
    }
  };
}
