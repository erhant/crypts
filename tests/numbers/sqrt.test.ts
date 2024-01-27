import {describe, expect, it} from 'bun:test';
import {bigSqrt} from '../../src/numbers';

describe('bigint square root', () => {
  it('should compute square root of bigints', () => {
    for (let i = 0; i < 100; i++) {
      const n = BigInt(Math.round(Math.random() * 1_000_000));
      expect(n).toBe(bigSqrt(n * n));
      expect(n).toBe(bigSqrt(n * n + 1n));
    }
  });
});
