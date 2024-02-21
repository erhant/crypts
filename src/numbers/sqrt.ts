import {FieldElement, legendreSymbol} from '../fields';

/**
 * Find the square root of a natural number, taken from [here](https://golb.hplar.ch/2018/09/javascript-bigint.html#math).
 *
 * @param num a number
 * @returns square root of the number
 */
export function bigSqrt(num: bigint): bigint {
  if (num < 0n) throw new RangeError('negative number given to sqrt');
  if (num < 2n) return num;

  // source: https://stackoverflow.com/a/53684036
  function newtonIteration(n: bigint, x0: bigint) {
    const x1 = (n / x0 + x0) >> 1n;
    if (x0 === x1 || x0 === x1 - 1n) {
      return x0;
    }
    return newtonIteration(n, x1);
  }

  return newtonIteration(num, 1n);
}

/**
 * Square root of a finite field element,
 * using [Tonelli-Shanks](https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm).
 *
 * @param num a field element
 * @returns
 * - `null` if the given number is not a quadratic residue in its field,
 * - `[r, -r]` such that `r^2 = (-r)^2 = n` in the field and `r < -r` in the field.
 */
export function ffSqrt(num: FieldElement): [FieldElement, FieldElement] | null {
  // ensure that it is a quadratic residue
  if (legendreSymbol(num) !== 1) {
    return null;
  }

  // find S > 0 and Q odd > 0 such that p − 1 = 2^S * Q
  const p1 = num.field.order - 1n; // literally p - 1
  let [S, Q] = [0n, p1];
  while ((Q & 1n) === 0n) {
    S++;
    Q >>= 1n;
  }

  // find a `z` that is quadratic non-residue
  let z = num.field.random();
  while (legendreSymbol(z) !== -1) {
    z = num.field.random();
  }

  // begin looping
  let M = S; // this will decrease as iterations increase
  let c = z.exp(Q);
  let t = num.exp(Q);
  let R = num.exp((Q + 1n) >> 1n);
  while (M !== 0n && !t.isOne()) {
    // find least `i` such that `t^{2^i} = 1`
    let tt = t;
    let i = 0n;
    while (!tt.isOne()) {
      tt = tt.mul(tt);
      ++i;

      // could not find such `i`, this is not a quadratic-residue
      if (i === M) {
        return null;
      }
    }

    // update for next iteration
    const b = c.exp(2n ** (M - i - 1n) % p1);
    const bb = b.mul(b);
    M = i;
    c = bb;
    t = t.mul(bb);
    R = R.mul(b);
  }

  // ensure square root
  if (R.mul(R).eq(num)) {
    const otherR = R.neg();
    return R.value < otherR.value ? [R, otherR] : [otherR, R];
  } else {
    return null;
  }
}
