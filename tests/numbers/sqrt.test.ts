import {describe, expect, test} from 'bun:test';
import {bigSqrt, ffSqrt, randomPrime} from '../../src/numbers';
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
      const root = new Field(randomPrime(4)).random();
      const otherRoot = root.neg();
      const [posRoot, negRoot] = ffSqrt(root.mul(root))!;
      if (root.value < otherRoot.value) {
        expect(posRoot.eq(root)).toBeTrue();
        expect(negRoot.eq(otherRoot)).toBeTrue();
      } else {
        expect(posRoot.eq(otherRoot)).toBeTrue();
        expect(negRoot.eq(root)).toBeTrue();
      }
    }
  });
});
