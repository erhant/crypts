import {describe, expect, it} from 'bun:test';
import {bigSqrt} from '~/numbers/utils';

describe('bigint square root', () => {
  it('should compute square root of bigints', () => {
    for (let i = 0; i < 100; i++) {
      const n = BigInt(Math.round(Math.random() * 1_000_000));
      const nn = n * n;
      const n_sqrt = bigSqrt(nn);
      expect(n).toBe(n_sqrt);
    }
  });
});
