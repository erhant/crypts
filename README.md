<p align="center">
  <h1 align="center">
    <code>crypts</code>
  </h1>
  <p align="center">
    <i>Finite fields, polynomials, elliptic curves and much more; for educational purposes!</i>
  </p>
</p>

## Usage

TODO

## Implementations

The following are implemented:

### https://github.com/erhant/crypts/labels/finite%20fields

- [x] [Field](./src/fields/field.ts) defines a finite field of prime order.
- [x] [Field Extension](./src/fields/extension.ts) defines an extension of an existing field using an irreducible polynomial.
- [x] [Legendre Symbol](./src/fields/legendre.ts) is a utility function that can tell whether a number is quadratic residue or non-residue.

### https://github.com/erhant/crypts/labels/polynomials

- [x] [Polynomials](./src/polynomials/polynomial.ts) defines a polynomial with coefficients in a finite field.
- [x] [Lagrange Interpolation](./src/polynomials/lagrange.ts) is a method to construct a polynomial based on point evaluations

### https://github.com/erhant/crypts/labels/elliptic%20curves

- [x] [Short Weierstrass](./src/curves/shortWeierstrass.ts) defines an elliptic curve in Short Weierstrass form with affine points along with a point at infinity.
- [x] [Montgomery](./src/curves/montgomery.ts) defines an elliptic curve in Montgomery form with affine points along with a point at infinity.
- [x] [Twisted Edwards](./src/curves/twisedEdwards.ts) defines an elliptic curve in Twisted Edwards form with affine points.

## Testing

We prepare our test cases using SageMath, and then try to match the results obtained there using our implementations. To run all tests, do:

```sh
bun test
```

## Styling

Check the formatting and lint everything with the following commands:

```sh
bun format
bun lint
```
