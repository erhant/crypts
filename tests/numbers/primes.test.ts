import {describe, test} from 'bun:test';
import {randomPrimeNaive} from '../../src/numbers';

describe.skipIf(!Bun.env.IS_BENCH)('primes', () => {
  describe('naive', () => {
    test('generating many small primes', () => {
      const [N, B] = [100, 4];
      for (let i = 0; i < N; i++) {
        randomPrimeNaive(B);
      }
    });

    test('generating one large prime naively', () => {
      randomPrimeNaive(32);
    });
  });
});
