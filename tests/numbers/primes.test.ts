import {describe, test} from 'bun:test';
import {randomPrime} from '../../src/numbers';

describe.skipIf(!Bun.env.IS_BENCH)('prime', () => {
  test('generating many small primes', () => {
    const [N, B] = [100, 4];
    for (let i = 0; i < N; i++) {
      randomPrime(B);
    }
  });

  test('generating one large prime naively', () => {
    randomPrime(32);
  });
});
