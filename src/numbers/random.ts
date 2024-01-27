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
