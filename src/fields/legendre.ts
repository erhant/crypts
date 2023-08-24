import {Felt} from './field-element';

/** Computes the Legendre Symbol, assuming odd prime order for the field.
 *
 * - `0`: number is zero
 * - `1`: number is quadratic residue
 * - `-1`: number is quadratic non-residue
 */
export function legendreSymbol(n: Felt): 0n | 1n | -1n {
  const last = BigInt(n.field.order - 1);

  // l := n ^ (p-1)/2
  const l = n.exp(last / 2n);
  if (l.eq(last)) {
    return -1n;
  } else {
    return l.n as 0n | 1n;
  }
}
