import {randomBytes} from 'crypto';
import first1000Primes from './smallPrimes';
import {bigSqrt} from './utils';

/**
 * Generate a random prime with the given number of bytes.
 * @param numBytes number of bytes for the prime
 * @returns a random prime
 */
export function randomPrime(numBytes: number): bigint {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let rand = BigInt('0x' + randomBytes(numBytes).toString('hex'));

    // if rand is even, make it odd
    // do this by incrementing, to not underflow the byte limit
    if ((rand & 1n) === 0n) {
      if (rand === 2n) {
        return rand;
      }
      rand++;
    }

    // FIXME: use Miller-Rabin
    if (isPrimeNaive(rand)) {
      return rand;
    }
  }
}

/**
 * Check if the number is prime using the method described [here](https://www.geeksforgeeks.org/how-to-generate-large-prime-numbers-for-rsa-algorithm/).
 *
 * - First see if it is divisible by a list of smaller primes (i.e. the first 1000 primes)
 * - Then do several iterations of the Miller-Rabin primality test.
 */
export function isPrime(num: bigint) {
  return num; // FIXME: todo!
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
