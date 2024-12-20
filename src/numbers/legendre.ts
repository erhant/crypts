import {FieldElement} from '../fields';

/** **Legendre Symbol**
 *
 * - `0`: number is zero
 * - `1`: number is quadratic residue
 * - `-1`: number is quadratic non-residue
 */
export function legendreSymbol(n: FieldElement): -1 | 0 | 1 {
  const last = n.field.order - 1n;

  // l := n ^ (p-1)/2
  const l = n.exp(last >> 1n);
  if (l.value === last) {
    return -1;
  } else {
    return Number(l.value) as 0 | 1;
  }
}
