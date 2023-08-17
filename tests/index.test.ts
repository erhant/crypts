import {Field} from '../src/field';

describe('field', () => {
  const F13 = Field(13);
  it.skip('should compute field elements', () => {
    const n = new F13(2);
    const m = new F13(-1);
    const k = n.add(m);
    expect(k.eq(1)).toBeTruthy();
  });

  it('should compute polynomials', () => {
    const F13x = F13.poly('x');
    const p = new F13x([10, 2, 3]);
    const q = new F13x([3, 2, 1]);
    const r = p.div(q);
    console.log(r + '');
    expect(r.coefficients).toEqual([7n, 0n, 2n]);
  });
});
