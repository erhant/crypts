import {expect, describe, test} from 'bun:test';
import {BinaryField} from '../../src/fields';

describe('binary field', () => {
  const F = new BinaryField();
  const zero = F.zero;
  const one = F.one;

  test('addition', () => {
    expect(zero.add(zero).value).toBe(0);
    expect(zero.add(one).value).toBe(1);
    expect(one.add(zero).value).toBe(1);
    expect(one.add(one).value).toBe(0);
  });

  test('multiplication', () => {
    expect(zero.mul(zero).eq(0)).toBeTrue();
    expect(zero.mul(one).eq(0)).toBeTrue();
    expect(one.mul(zero).eq(0)).toBeTrue();
    expect(one.mul(one).eq(1)).toBeTrue();
  });

  test('exponentation', () => {
    expect(zero.exp(1).eq(0)).toBeTrue();
    expect(zero.exp(0).eq(1)).toBeTrue();
    expect(one.exp(1).eq(1)).toBeTrue();
    expect(one.exp(0).eq(1)).toBeTrue();
  });
});
