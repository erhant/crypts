import type {FieldElement} from '../fields';
import type {Polynomial} from '.';

/** Finds the roots of a polynomial, simply by iterating over all the field elements. */
export function findRootsNaive(p: Polynomial): FieldElement[] {
  const roots = [];
  for (const x of p.field) {
    if (p.eval(x).eq(0)) {
      roots.push(x);
    }
  }
  return roots;
}
