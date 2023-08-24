/** Extended Euclidean Algorithm.
 *
 * Given `a` and `b`, finds `gcd(a,b)`, `s` and `t` such that `gcd(a, b) = s * a + t * b`.
 *
 * In `mod p` arithmetic for prime `p`, this can be used to find an inverse of a number in a prime field.
 * Notice how `gcd(p, n) = s * p + t * n` in mod `p` becomes `1 = t * n`, therefore `t` is the multiplicative
 * inverse of `n` in this field of order `p`.
 */
export function extendedEuclideanAlgorithm(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (a < b) {
    throw new Error('Need a >= b');
  }

  let r_prev = a;
  let r_cur = b;

  let s_prev = 1n;
  let s_cur = 0n;

  let t_prev = 0n;
  let t_cur = 1n;

  let quot, rem, s_next, t_next;
  while (r_cur !== 0n) {
    quot = r_prev / r_cur;
    rem = r_prev % r_cur;

    s_next = s_prev - quot * s_cur;
    t_next = t_prev - quot * t_cur;

    r_prev = r_cur;
    r_cur = rem;

    s_prev = s_cur;
    s_cur = s_next;

    t_prev = t_cur;
    t_cur = t_next;
  }

  return [r_prev, s_prev, t_prev];
}
