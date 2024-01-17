import {expect, describe, it, beforeAll} from 'bun:test';
import {Polynomial, interpolate} from '~/polynomials';
import {Field, FieldElement} from '~/fields';

const tests: [N: number, K: number][] = [
  [3, 2],
  [7, 3],
  [11, 5],
] as const;
describe("shamir's secret sharing", () => {
  tests.map(([N, K]) =>
    describe(`(k: ${K}, n: ${N})`, () => {
      const secret = 7n;
      const order = 29;
      const F = new Field(order);

      let allShares: [number, FieldElement][] = [];

      beforeAll(() => {
        expect(N).toBeGreaterThan(K);
        expect(N).toBeLessThan(order);
      });

      it(`should split a secret to ${N} shares`, () => {
        // generate random coefficients, except that the first one is equal to secret
        const coeffs: FieldElement[] = Array.from({length: K}, () => F.random());
        coeffs[0] = F.Element(secret);

        // generate shares by evaluation the polynomial at points [1, 2, ..., N]
        const poly = new Polynomial(F, coeffs);
        allShares = Array.from({length: N}, (_, i) => [i + 1, poly.eval(i + 1)]);
      });

      it(`should construct the secret from ${K} shares`, () => {
        const shares = allShares.slice(0, K);
        const poly = interpolate(F, shares);
        const recovery = poly.eval(0);

        expect(recovery.value).toBe(secret);
      });
    })
  );
});
