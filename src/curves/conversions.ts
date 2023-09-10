import {MontgomeryCurve, ShortWeierstrassCurve, TwistedEdwardsCurve} from '.';

export function montgomeryToShortWeierstrass(curve: MontgomeryCurve): ShortWeierstrassCurve {
  // (3-A^2)/(3*B^2)
  const a = curve.A.exp(2).neg().add(3).div(curve.B.exp(2).mul(3));

  // (2*A^3 - 9*A)/(27*B^3)
  const b = curve.A.exp(2).mul(2).sub(curve.A.mul(9)).div(curve.B.exp(3).mul(27));

  return new ShortWeierstrassCurve(curve.field, [a, b]);
}

export function montgomeryToTwistedEdwards(curve: MontgomeryCurve): TwistedEdwardsCurve {
  if (curve.B.eq(0) || curve.A.exp(2).eq(4)) {
    throw new Error('Cant convert this curve to Twisted Edwards.');
  }

  const Binv = curve.B.inv();
  const a = curve.A.add(2).mul(Binv);
  const d = curve.A.sub(2).mul(Binv);

  return new TwistedEdwardsCurve(curve.field, [a, d]);
}

export function twistedEdwardsToMontgomery(curve: TwistedEdwardsCurve): MontgomeryCurve {
  const adinv = curve.a.sub(curve.d).inv();
  const B = adinv.mul(4); // 4/(a-d)
  const A = adinv.mul(curve.a.add(curve.d).mul(2)); // 2(a+d)/(a-d)
  return new MontgomeryCurve(curve.field, [A, B]);
}
