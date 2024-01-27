import {randomNumber} from '..';
import {bigSqrt} from '../sqrt';

/**
 * Generate a random prime with the given number of bytes, using the naive method.
 * We simply create a random number, and check if its a prime using the naive method
 * of checking divisions up to the square root of the number.
 *
 * @param numBytes number of bytes for the prime
 * @returns a random prime
 */
export function randomPrimeNaive(numBytes: number): bigint {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let rand = randomNumber(numBytes);

    // if rand is even, make it odd
    // do this by incrementing, to not underflow the byte limit
    if ((rand & 1n) === 0n) {
      if (rand === 2n) {
        return rand;
      }
      rand++;
    }

    if (isPrimeNaive(rand)) {
      return rand;
    }
  }
}

/**
 * Naively check if the given number is prime, i.e. try to divide it for all
 * numbers
 * @param num number to check
 * @returns true if `num` is prime
 */
export function isPrimeNaive(num: bigint): boolean {
  if (num === 2n) return true;
  if ((num & 1n) === 0n) return false;
  for (let i = 3n; i <= bigSqrt(num); i += 2n) {
    if (num % i === 0n) return false;
  }

  return num > 1;
}
