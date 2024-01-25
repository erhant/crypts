import type {TwistedEdwardsCurve} from '.';
import {MontgomeryCurve, ShortWeierstrassCurve} from '..';
import {montgomeryToShortWeierstrass} from '../montgomery/conversions';

export function twistedEdwardsToMontgomery(curve: TwistedEdwardsCurve): MontgomeryCurve {
  const adinv = curve.a.sub(curve.d).inv();
  const B = adinv.mul(4); // 4/(a-d)
  const A = adinv.mul(curve.a.add(curve.d).mul(2)); // 2(a+d)/(a-d)
  return new MontgomeryCurve(curve.field, [A, B]);
}

export function twistedEdwardsToShortWeierstass(curve: TwistedEdwardsCurve): ShortWeierstrassCurve {
  return montgomeryToShortWeierstrass(twistedEdwardsToMontgomery(curve));
}
