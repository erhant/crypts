/** Legendre Symbol
 *
 * Assumes `p` to be an odd prime order.
 *
 * - `0`: number is zero
 * - `1`: number is quadratic residue
 * - `-1`: number is quadratic non-residue
 */
export function legendreSymbol(n: bigint, p: bigint): 0n | 1n | -1n {
  const last = p - 1n;

  // l := n ^ (p-1)/2
  const l = n ** (last / 2n) % p;
  if (l === last) {
    return -1n;
  } else {
    return l as 0n | 1n;
  }
}
