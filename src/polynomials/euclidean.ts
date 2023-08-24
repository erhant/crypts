import {Polynomial} from './polynomial';

/** Extended Euclidean Algorithm for Polynomials.
 *
 * Given `a` and `b`, finds `gcd(a,b)`, `s` and `t` such that `gcd(a, b) = s * a + t * b`.
 *
 * In `mod p` arithmetic for prime `p`, this can be used to find an inverse of a number in a prime field.
 * Notice how `gcd(p, n) = s * p + t * n` in mod `p` becomes `1 = t * n`, therefore `t` is the multiplicative
 * inverse of `n` in this field of order `p`.
 */
export function polynomialExtendedEuclideanAlgorithm(
  a: Polynomial,
  b: Polynomial
): [Polynomial, Polynomial, Polynomial] {
  // if (a < b) {
  //   throw new Error('Need a >= b');
  // }

  let r_prev = a;
  let r_cur = b;

  let s_prev = new Polynomial(a.field, [1]);
  let s_cur = new Polynomial(a.field, [0]);

  let t_prev = new Polynomial(a.field, [0]);
  let t_cur = new Polynomial(a.field, [1]);

  let quot, rem, s_next, t_next;
  while (!r_cur.eq([])) {
    quot = r_prev.div(r_cur);
    rem = r_prev.mod(r_cur);

    s_next = s_prev.sub(quot.mul(s_cur));
    t_next = t_prev.sub(quot.mul(t_cur));

    r_prev = r_cur;
    r_cur = rem;

    s_prev = s_cur;
    s_cur = s_next;

    t_prev = t_cur;
    t_cur = t_next;
  }

  return [r_prev, s_prev, t_prev];
}
