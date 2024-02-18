import {Field} from '../fields';
import {Polynomial} from '.';

/** Lagrange interpolation in a given field. */
export function interpolate(field: Field, points: [Field.Input, Field.Input][]): Polynomial {
  const ps = points.map(p => [field.Element(p[0]), field.Element(p[1])]);
  const n = points.length;

  // compute basis
  const basis = Array.from({length: n}, () => new Polynomial(field, [1]));
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < n; ++j) {
      if (i !== j) {
        basis[i] = basis[i].mul(new Polynomial(field, [ps[j][0].neg(), 1]));
        basis[i] = basis[i].div(new Polynomial(field, [ps[i][0].sub(ps[j][0])]));
      }
    }
  }

  // interpolate
  let p = new Polynomial(field, [0]);
  for (let i = 0; i < n; ++i) {
    p = p.add(basis[i].scale(ps[i][1]));
  }

  return p;
}
