import {expect, describe, test} from 'bun:test';
import {Field} from '../../src/fields';
import {MontgomeryCurve, ShortWeierstrassCurve, TwistedEdwardsCurve} from '../../src/curves';
import {shortWeierstassToMontgomery, shortWeierstassToTwistedEdwards} from '../../src/curves/shortWeierstrass';
import {montgomeryToShortWeierstrass, montgomeryToTwistedEdwards} from '../../src/curves/montgomery';
import {twistedEdwardsToMontgomery, twistedEdwardsToShortWeierstass} from '../../src/curves/twistedEdwards';

/** Parameters for TinyJubJub over GF(13) as appears in MoonMath Manual. */

describe('curve conversions', () => {
  const F13 = new Field(13);
  const z0 = 4n; // a known root of z^3 + az + b for TJJ_13 over GF(13)
  const TJJ_13 = {
    field: F13,
    shortWeierstrass: new ShortWeierstrassCurve(F13, [8, 8], {scalarOrder: 20n}),
    montgomery: new MontgomeryCurve(F13, [6, 7]),
    twistedEdwards: new TwistedEdwardsCurve(F13, [3, 8]),
  };

  test('Short Weierstrass to Montgomery', () => {
    const mont = shortWeierstassToMontgomery(TJJ_13.shortWeierstrass, z0);
    expect(mont.A.eq(TJJ_13.montgomery.A)).toBeTrue();
    expect(mont.B.eq(TJJ_13.montgomery.B)).toBeTrue();
  });

  test('Short Weierstrass to Twisted Edwards', () => {
    const ed = shortWeierstassToTwistedEdwards(TJJ_13.shortWeierstrass, z0);
    expect(ed.a.eq(TJJ_13.twistedEdwards.a)).toBeTrue();
    expect(ed.d.eq(TJJ_13.twistedEdwards.d)).toBeTrue();
  });

  test('Montgomery to Short Weierstrass', () => {
    const sw = montgomeryToShortWeierstrass(TJJ_13.montgomery);
    expect(sw.a.eq(TJJ_13.shortWeierstrass.a)).toBeTrue();
    expect(sw.b.eq(TJJ_13.shortWeierstrass.b)).toBeTrue();
  });
  test('Montgomery to Twisted Edwards', () => {
    const ed = montgomeryToTwistedEdwards(TJJ_13.montgomery);
    expect(ed.a.eq(TJJ_13.twistedEdwards.a)).toBeTrue();
    expect(ed.d.eq(TJJ_13.twistedEdwards.d)).toBeTrue();
  });

  test('Twisted Edwards to Short Weierstrass', () => {
    const sw = twistedEdwardsToShortWeierstass(TJJ_13.twistedEdwards);
    expect(sw.a.eq(TJJ_13.shortWeierstrass.a)).toBeTrue();
    expect(sw.b.eq(TJJ_13.shortWeierstrass.b)).toBeTrue();
  });
  test('Twisted Edwards to Montgomery', () => {
    const mont = twistedEdwardsToMontgomery(TJJ_13.twistedEdwards);
    expect(mont.A.eq(TJJ_13.montgomery.A)).toBeTrue();
    expect(mont.B.eq(TJJ_13.montgomery.B)).toBeTrue();
  });
});
