# TSCrypto

Basically cryptography & math stuff in TypeScript, totally for educational purposes. The code here is probably as unoptimized as it may get, but I try to take more care on DX for the API.

```ts
// create a field
const order = 3;
const F = new Field(order);
for (const elem in F) {
  // iterate over elements in F
  console.log(elem.toString());
}

// create a polynomial over the field
const p = F3.Polynomial([1, 0, 1]);

// create an extension field
```

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

- [x] Affine Short Weierstrass
