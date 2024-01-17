import {FieldElement} from '../fields';
import {Polynomial, interpolate} from '.';

/**
 * Split generates a degree `k-1` polynomial with the constant coefficients equal
 * to the `secret`. It then evaluates this polynomial at `n` random points.
 *
 * @param secret secret to be splitted into `n` shares
 * @param k number of shares required to generate the secret
 * @param n number of shares to be created
 */
export function split(secret: FieldElement, k: number, n: number) {
  // the finite field of this secret
  const F = secret.field;

  // coefficients
  const coeffs = Array.from({length: k}, () => F.random());
  coeffs[0] = secret;

  // the resulting polynomial
  const P = new Polynomial(F, coeffs);

  // evaluations over the polynomial
  const evals = Array.from({length: n}, () => F.random()).map(x => [x, P.eval(x)] as const);

  return evals;
}

/**
 * To recover, we interpolate the polynomial with the given evaluations,
 * and then evaluate it at the point 0, thereby finding the constant coefficient.
 */
export function recover(evals: [FieldElement, FieldElement][]) {
  return interpolate(evals[0][0].field, evals).eval(0);
}
