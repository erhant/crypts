/**
 * Find the square root of a natural number with the naive method.
 *
 * In the context of a finite field, there would be two square roots,
 * one is the result of this (denote as `s`), and the other would be `p-s` where
 * `p` is the order of the field.
 *
 * @param num a number
 * @returns square root of the number
 */
export function bigSqrt(value: bigint) {
  if (value < 0n) throw new Error('negative number given to sqrt');
  if (value < 2n) return value;

  // source: https://stackoverflow.com/a/53684036
  function newtonIteration(n: bigint, x0: bigint) {
    const x1 = (n / x0 + x0) >> 1n;
    if (x0 === x1 || x0 === x1 - 1n) {
      return x0;
    }
    return newtonIteration(n, x1);
  }

  return newtonIteration(value, 1n);
}
