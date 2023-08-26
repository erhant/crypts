# TSCrypto

Basically cryptography & math stuff in TypeScript, totally for educational purposes. The code here is probably as unoptimized as it may get, but I try to take more care on DX for the API.

## Usage

TODO

## Implementations

The following are implemented:

### https://github.com/erhant/tscrypto/labels/finite%20fields

- [x] [Finite Fields](./src/fields/field.ts)
- [x] [Finite Field Extensions](./src/fields/extension.ts)
- [x] [Legendre Symbol](./src/utils/legendre.ts)

### https://github.com/erhant/tscrypto/labels/polynomials

- [x] [Polynomials](./src/polynomials/polynomial.ts)
- [x] [Lagrange Interpolation](./src/utils/lagrange.ts)

### https://github.com/erhant/tscrypto/labels/elliptic%20curves

- [x] [Affine Short Weierstrass](./src/curves/affineShortWeierstrass.ts)

## Testing

We prepare our test cases using SageMath via the scripts under [sage](./sage/) folder. Each Sage script there prints an array of test cases that can be copy-pasted to their respective tests.

To run all tests, do:

```sh
yarn test
```
