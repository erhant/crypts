# TSCrypto

Basically cryptography & math stuff in TypeScript, totally for educational purposes. The code here is probably as unoptimized as it may get, but I try to take more care on DX for the API. This project uses [Bun](https://bun.sh/).

## Usage

Use the following commands:

```sh
bun start # run the code
bun test # run tests
bun format # format with prettier
bun lint # lint with eslint
```

## Implementations

The following are implemented:

### https://github.com/erhant/tscrypto/labels/finite%20fields

- [x] [Field](./src/fields/field.ts) defines a finite field of prime order.
- [x] [Field Extension](./src/fields/extension.ts) defines an extension of an existing field using an irreducible polynomial.
- [x] [Legendre Symbol](./src/utils/legendre.ts) is a utility function that can tell whether a number is quadratic residue or non-residue.

### https://github.com/erhant/tscrypto/labels/polynomials

- [x] [Polynomials](./src/polynomials/polynomial.ts) defines a polynomial with coefficients in a finite field.
- [x] [Lagrange Interpolation](./src/utils/lagrange.ts) is a method to construct a polynomial based on point evaluations

### https://github.com/erhant/tscrypto/labels/elliptic%20curves

- [x] [Short Weierstrass](./src/curves/shortWeierstrass.ts) defines an elliptic curve in Short Weierstrass form with affine points along with a point at infinity.
- [!] [Montgomery](./src/curves/montgomery.ts) defines an elliptic curve in Montgomery form with affine points along with a point at infinity.
- [!] [Twisted Edwards](./src/curves/twised-edwards.ts) defines an elliptic curve in Twisted Edwards form with affine points.

## Testing

We prepare our test cases using SageMath via the scripts under [sage](./sage/) folder. Each Sage script there prints an array of test cases that can be copy-pasted to their respective tests. To run all tests, do:

```sh
bun test
```
