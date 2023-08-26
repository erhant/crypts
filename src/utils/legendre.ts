/** Legendre Symbol
 *
 * Assumes `p` to be an odd prime order.
 *
 * - `0`: number is zero
 * - `1`: number is quadratic residue
 * - `-1`: number is quadratic non-residue
 */
export function legendreSymbol(n: bigint, p: bigint): -1n | 0n | 1n {
  const last = p - 1n;

  // l := n ^ (p-1)/2
  // NOTE: this ** guy will not work for large bigints
  const l = n ** (last / 2n) % p;
  if (l === last) {
    return -1n;
  } else {
    return l as 0n | 1n;
  }
}
