import first1000Primes from './first1000';
/**
 * Check if the number is prime using the method described
 * [here](https://www.geeksforgeeks.org/how-to-generate-large-prime-numbers-for-rsa-algorithm/)
 * which is as follows:
 *
 * - First see if it is divisible by a list of smaller primes (i.e. the first 1000 primes)
 * - Then do several iterations of the Miller-Rabin primality test.
 */
export function isPrime(num: bigint) {
  return num; // FIXME: todo!
}
