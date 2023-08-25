import {FieldElementInput} from '../types';
import {Field} from '../fields';
import {Polynomial} from '../polynomials';

/** Lagrange interpolation in a given field. */
export function interpolate(field: Field, points: [FieldElementInput, FieldElementInput][]): Polynomial {
  const ps = points.map(p => [field.Element(p[0]), field.Element(p[1])]);
  const n = points.length;

  // compute basis
  const basis = Array.from({length: n}, () => field.Polynomial([1]));
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n; ++j) {
      if (i !== j) {
        basis[i] = basis[i].mul(field.Polynomial([ps[j][0].neg(), 1]));
        basis[i] = basis[i].div(field.Polynomial([ps[i][0].sub(ps[j][0])]));
      }
    }
  }

  // interpolate
  let p = field.Polynomial([0]);
  for (let i = 0; i < n; ++i) {
    p = p.add(basis[i].scale(ps[i][1]));
  }

  return p;
}