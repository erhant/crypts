import {describe, test, expect} from 'bun:test';
import {isPrime, isPrimeNaive, randomPrime} from '../../src';

describe('primes', () => {
  test('primality check (naive)', () => {
    expect(isPrimeNaive(121n)).toBeFalse();
    expect(isPrimeNaive(1n)).toBeFalse();
    expect(isPrimeNaive(90000n)).toBeFalse();

    expect(isPrimeNaive(1123n)).toBeTrue();
    expect(isPrimeNaive(11n)).toBeTrue();
    expect(isPrimeNaive(7919n)).toBeTrue();
  });

  test('primality check (miller-rabin)', () => {
    expect(isPrime(121n)).toBeFalse();
    expect(isPrime(1n)).toBeFalse();
    expect(isPrime(90000n)).toBeFalse();

    expect(isPrime(1123n)).toBeTrue();
    expect(isPrime(11n)).toBeTrue();
    expect(isPrime(7919n)).toBeTrue();

    expect(isPrime(2147483647n)).toBeTrue();
  });

  // just to benchmark the time of generation
  [4, 12, 20, 28, 32, 64].map(size =>
    test(`random primes (${size} bytes)`, () => {
      randomPrime(size);
    })
  );
});
