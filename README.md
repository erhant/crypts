<p align="center">
  <h1 align="center">
    <code>crypts</code>
  </h1>
  <p align="center">
    <i>A Bun-powered zero-dependency library for cryptography, for self-educational purposes mostly.</i>
  </p>
</p>

<div align="center">
<h3>https://github.com/erhant/crypts/labels/finite%20fields</h3>
</div>

- [x] [Prime Field](./src/fields/prime/field.ts) defines a finite field of prime order.
- [x] [Binary Field](./src/fields/binary/field.ts) defines a finite field of order 2 with Boolean values & Boolean algebra.
- [x] [Field Extension](./src/fields/extension/field.ts) defines an extension of an existing field using an irreducible polynomial.

<div align="center">
<h3>https://github.com/erhant/crypts/labels/polynomials</h3>
</div>

- [x] [Polynomials](./src/polynomials/polynomial.ts) defines a polynomial with coefficients in a finite field.
- [x] [Lagrange Interpolation](./src/polynomials/lagrange.ts) constructs a polynomial based on point evaluations.
- [x] [Shamir's Secret Sharing](./src/polynomials/shamir.ts) splits a given secret into $n$ shares such that with at least $k$ of them the secret can be reconstructed.
- [ ] [Number-Theoretic Transform](./) (aka. [Discrete Fourier Transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform_over_a_ring#Number-theoretic_transform)) is used to switch between coefficient & evaluation representations of a polynomial.

<div align="center">
<h3>https://github.com/erhant/crypts/labels/elliptic%20curves</h3>
</div>

- [x] [Short Weierstrass](./src/curves/shortWeierstrass.ts) defines an elliptic curve in Short Weierstrass form with affine points, along with curve conversions.
- [x] [Montgomery](./src/curves/montgomery.ts) defines an elliptic curve in Montgomery form with affine points, along with curve conversions.
- [x] [Twisted Edwards](./src/curves/twisedEdwards.ts) defines an elliptic curve in Twisted Edwards form with affine points, along with curve conversions.
- [ ] [Find Scalar Order](/) ...

<div align="center">
<h3>https://github.com/erhant/crypts/labels/numbers</h3>
</div>

- [x] [Miller-Rabin](./src/numbers/primality.ts) probabilistically & efficiently checks if a number is prime.
- [x] [Tonelli-Shanks](./src/fields/sqrt.ts) finds the square root of a quadratic residue in a finite field.
- [x] [Legendre Symbol](./src/fields/legendre.ts) tells whether a number is quadratic residue or quadratic non-residue.

## Usage

TODO

## Testing

We prepare our test cases using SageMath, and then try to match the results obtained there using our implementations. To run all tests, do:

```sh
bun run test
bun t # alias
```

> [!TIP]
>
> If you do not have Sage installed, but still would like to play around with the Sage code, fret not! We have prepared scripts for the Sagemath docker image:
>
> ```sh
> bun sage:pull     # pulls the image
> bun sage:cli      # opens Sage cli
> bun sage:notebook # opens Jupyter Notebook
> ```
>
> The containers will have volumes attached to the `tests/data` and `tests/sage` folders, so that the Sage code can directly write to the test data there.

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

## Resources

This would not have been possible without the amazing resources out there:

- [MoonMath Manual](https://leastauthority.com/community-matters/moonmath-manual/)
- [ZCash](https://zcash.github.io/halo2/background)
- [Risencrypto](https://risencrypto.github.io)
