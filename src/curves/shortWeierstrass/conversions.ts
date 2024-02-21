import {ShortWeierstrassCurve} from '.';
import {TwistedEdwardsCurve} from '../twistedEdwards';
import {MontgomeryCurve, montgomeryToTwistedEdwards} from '../montgomery';
import {ffSqrt} from '../../numbers';

export function shortWeierstassToMontgomery(curve: ShortWeierstrassCurve, z0: bigint): MontgomeryCurve {
  if (!curve.scalar) throw 'We need to know the Scalar field order.';
  if (curve.scalar.order % 4n !== 0n) throw 'Scalar field order must be divisible by 4.';

  const z0f = curve.base.Element(z0);
  if (!z0f.exp(3).add(curve.a.mul(z0f)).add(curve.b).isZero()) throw `z0 must be a root of z^3 + az + b.`;

  const ss = z0f.exp(2).mul(3).add(curve.a);
  const s = ffSqrt(ss);
  if (!s) throw `3z_0^2 + a is not a quadratic residue.`;
  const sInv = s[0].inv();

  const B = sInv;
  const A = z0f.mul(3).mul(sInv);
  return new MontgomeryCurve(curve.base, [A, B]);
}

export function shortWeierstassToTwistedEdwards(curve: ShortWeierstrassCurve, z0: bigint): TwistedEdwardsCurve {
  return montgomeryToTwistedEdwards(shortWeierstassToMontgomery(curve, z0));
}
