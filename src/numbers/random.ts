import {isPrime} from '.';

/**
 * Generate a random number using `crypto.getRandomValues`.
 *
 * @param numBytes number of bytes
 * @returns a random number
 */
export function randomNumber(numBytes: number): bigint {
  if (numBytes < 1) return 0n;

  const bytes = new Uint8Array(numBytes);
  crypto.getRandomValues(bytes);

  return BigInt('0x' + Buffer.from(bytes).toString('hex'));
}

/**
 * Generate a random prime with the given number of bytes.
 *
 * @param numBytes number of bytes for the prime
 * @returns a random prime
 */
export function randomPrime(numBytes: number): bigint {
  let rand = randomNumber(numBytes);
  while (!isPrime(rand)) {
    rand = randomNumber(numBytes);
  }
  return rand;
}
