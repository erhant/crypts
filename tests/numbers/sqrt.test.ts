import {describe, expect, test} from 'bun:test';
import {bigSqrt, ffsqrt, legendreSymbol, randomPrime} from '../../src/numbers';
import {Field} from '../../src';

describe('square roots', () => {
  test('bigint square root', () => {
    for (let i = 0; i < 50; i++) {
      const n = BigInt(Math.round(Math.random() * 1_000_000));
      expect(n).toBe(bigSqrt(n * n));
      expect(n).toBe(bigSqrt(n * n + 1n));
    }
  });

  test('tonelli-shanks', () => {
    for (let i = 0; i < 50; i++) {
      const r = new Field(randomPrime(4)).random();
      expect(legendreSymbol(r.mul(r))).toBe(1);
      expect(ffsqrt(r.mul(r)).eq(r)).toBeTrue();
    }
  });
});
