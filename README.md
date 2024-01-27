<p align="center">
  <h1 align="center">
    <code>crypts</code>
  </h1>
  <p align="center">
    <i>A zero-dependency library for cryptography, for self-educational purposes mostly.</i>
  </p>
</p>

### https://github.com/erhant/crypts/labels/finite%20fields

- [x] [Prime Field](./src/fields/prime/field.ts) defines a finite field of prime order.
- [x] [Field Extension](./src/fields/extension/field.ts) defines an extension of an existing field using an irreducible polynomial.
- [ ] [Binary Field](./src/fields/binary/field.ts) defines a finite field of order 2.

### https://github.com/erhant/crypts/labels/polynomials

- [x] [Polynomials](./src/polynomials/polynomial.ts) defines a polynomial with coefficients in a finite field.
- [x] [Lagrange Interpolation](./src/polynomials/lagrange.ts) is a method to construct a polynomial based on point evaluations
- [x] [Shamir's Secret Sharing](./src/polynomials/shamir.ts) splits a given secret into `n` shares such that with at least `k` of them the secret can be re-constructed.

### https://github.com/erhant/crypts/labels/elliptic%20curves

- [x] [Short Weierstrass](./src/curves/shortWeierstrass.ts) defines an elliptic curve in Short Weierstrass form with affine points along with a point at infinity.
- [x] [Montgomery](./src/curves/montgomery.ts) defines an elliptic curve in Montgomery form with affine points along with a point at infinity.
- [x] [Twisted Edwards](./src/curves/twisedEdwards.ts) defines an elliptic curve in Twisted Edwards form with affine points.

### https://github.com/erhant/crypts/labels/numbers

- [ ] [Miller-Rabin](./src/numbers/primality/fast.ts) checks for a prime number efficiently (albeit probabilistically).
- [ ] [Tonelli-Shanks](./src/fields/sqrt.ts) can find the square root of a number in a finite field.
- [x] [Legendre Symbol](./src/fields/legendre.ts) can tell whether a number is quadratic residue/non-residue.

## Usage

TODO

## Testing

We prepare our test cases using SageMath, and then try to match the results obtained there using our implementations. To run all tests, do:

```sh
bun run test
bun t # alias
```

## Building

We use Bun as a builder, and [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator) for types.

```sh
bun run build
bun b # alias
```

## Examples

See several examples:

- [secp256k1](./examples/secp256k1.ts)
- [ed25519](./examples/ed25519.ts)

## Styling

Check the formatting and lint everything with the following commands:

```sh
bun format
bun lint
bun style # does both
```
