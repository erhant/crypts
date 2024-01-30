<p align="center">
  <h1 align="center">
    <code>crypts</code>
  </h1>
  <p align="center">
    <i>A Bun-powered & zero-dependency library for cryptography, for self-educational purposes mostly.</i>
  </p>
</p>

<div align="center">
<h3>https://github.com/erhant/crypts/labels/finite%20fields</h3>
</div>

- [x] [Prime Field](./src/fields/prime/field.ts) defines a finite field of prime order.
- [x] [Field Extension](./src/fields/extension/field.ts) defines an extension of an existing field using an irreducible polynomial.
- [x] [Binary Field](./src/fields/binary/field.ts) defines a finite field of order 2 with Boolean values & Boolean algebra.

<div align="center">
<h3>https://github.com/erhant/crypts/labels/polynomials</h3>
</div>

- [x] [Polynomials](./src/polynomials/polynomial.ts) defines a polynomial with coefficients in a finite field.
- [x] [Lagrange Interpolation](./src/polynomials/lagrange.ts) is a method to construct a polynomial based on point evaluations.
- [x] [Shamir's Secret Sharing](./src/polynomials/shamir.ts) splits a given secret into $n$ shares such that with at least $k$ of them the secret can be reconstructed.

<div align="center">
<h3>https://github.com/erhant/crypts/labels/elliptic%20curves</h3>
</div>

- [x] [Short Weierstrass](./src/curves/shortWeierstrass.ts) defines an elliptic curve in Short Weierstrass form with affine points.
- [x] [Montgomery](./src/curves/montgomery.ts) defines an elliptic curve in Montgomery form with affine points.
- [x] [Twisted Edwards](./src/curves/twisedEdwards.ts) defines an elliptic curve in Twisted Edwards form with affine points.

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

To prepare the test data using Sage, you may use the [Docker image](https://hub.docker.com/r/sagemath/sagemath/) of it if you don't have it installed. To pull the image, do the following:

```sh
docker pull --platform linux/amd64 sagemath/sagemath
```

We specify the platform in case our machine does not support it, which is the case of Macbooks. Then, we can run the image as a CLI directly within sage or via a notebook:

```sh
# run Sage from the command line
docker run -v $PWD/tests/sage:/home/sage/crypts -v $PWD/tests/data:/home/sage/data -it sagemath/sagemath:latest

# or, open a Jupyter notebook
docker run -v $PWD/tests/sage:/home/sage/crypts -v $PWD/tests/data:/home/sage/data -p8888:8888 sagemath/sagemath:latest sage-jupyter
```

As noticed here, we attach the volumes related to our Sage programs and their export destination. We also have aliases for these two commands:

```sh
bun docker:cli
bun docker:notebook
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
