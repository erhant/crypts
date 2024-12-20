import type {Polynomial} from '.';
import {Field} from '..';

/** Finds the roots of a polynomial, simply by iterating over all the field elements. */
export function findRootsNaive(p: Polynomial): Field.Element[] {
  const roots = [];
  for (const x of p.field) {
    if (p.eval(x).isZero()) {
      roots.push(x);
    }
  }
  return roots;
}

/** Is this an irreducible polynomial?
 *
 * To see this, we evaluate the polynomial on all points to see if has a zero,
 * so try not to use it with large fields.
 */
export function isIrreducibleNaive(p: Polynomial): boolean {
  for (const x of p.field) {
    if (p.eval(x).isZero()) {
      return false;
    }
  }
  return true;
}
