import {Field, ShortWeierstrassCurve, TwistedEdwardsCurve} from '../..';

/**
 * [**Ed25519**](https://neuromancer.sk/std/other/Ed25519)
 *
 * @see https://ed25519.cr.yp.to
 */
export const ed25519 = () =>
  new TwistedEdwardsCurve(
    new Field(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn),
    [-1, 0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n],
    {
      scalarOrder: 0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,
      generator: [
        0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,
        0x6666666666666666666666666666666666666666666666666666666666666658n,
      ],
    }
  );

export const secp256k1 = () =>
  new ShortWeierstrassCurve(new Field(0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn), [0, 7], {
    scalarOrder: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
    generator: [
      0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
      0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n,
    ],
  });

/**
 * [**bn254**](https://neuromancer.sk/std/bn/bn254)
 *
 */
export const bn254 = () =>
  new ShortWeierstrassCurve(new Field(0x2523648240000001ba344d80000000086121000000000013a700000000000013n), [0, 2], {
    scalarOrder: 0x2523648240000001ba344d8000000007ff9f800000000010a10000000000000dn,
    generator: [
      0x2523648240000001ba344d80000000086121000000000013a700000000000012n,
      0x0000000000000000000000000000000000000000000000000000000000000001n,
    ],
  });
