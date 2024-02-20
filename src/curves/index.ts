import type {Field, FieldExtension} from '..';

export {ShortWeierstrassCurve, ShortWeierstrassCurvePoint} from './shortWeierstrass/';
export {MontgomeryCurve, MontgomeryCurvePoint} from './montgomery/';
export {TwistedEdwardsCurve, TwistedEdwardsCurvePoint} from './twistedEdwards/';
export * as curves from './examples';

/** An affine point `[x, y]`. */
export type AffinePoint = [Field.Input, Field.Input];

/** An affine point `[x, y]` in an extension. */
export type AffineExtensionPoint = [FieldExtension.Input, FieldExtension.Input];
