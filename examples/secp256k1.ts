import {Field, ShortWeierstrassCurve} from '../src';

// order of the base field
const p = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn;
const F = new Field(p);

// order of the scalar field
const n = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
const invTwo = new Field(n).Element(2).inv();

// curve parameters
const [a, b] = [0, 7];
const secp256k1 = new ShortWeierstrassCurve(F, [a, b]);

// generator point coordinates
const Gx = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n;
const Gy = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n;
const G = secp256k1.Point([Gx, Gy]);

console.log(G.scale(invTwo.value).toString(true));
