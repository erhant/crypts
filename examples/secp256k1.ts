import {Field, ShortWeierstrassCurve} from '../src';

const secp256k1 = new ShortWeierstrassCurve(
  new Field(0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn),
  [0, 7],
  {
    scalarOrder: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
    generator: [
      0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
      0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n,
    ],
  }
);

const invTwo = secp256k1.scalar!.Element(2).inv();
console.log(secp256k1.generator!.scale(invTwo.value).toString(true));
