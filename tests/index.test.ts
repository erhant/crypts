import {Field} from '../src/field';

describe('GF(13)', () => {
  const F13 = Field(13);

  describe('field operations', () => {
    const n = new F13(2);
    const m = new F13(-1);

    it('addition', () => {
      expect(n.add(m).eq(1)).toBeTruthy();
    });
  });

  describe('polynomial operations', () => {
    const F13x = F13.Polynomial('x');
    const p = new F13x([10, 2, 3]);
    const q = new F13x([3, 2, 1]);

    it('subtraction', () => {
      expect(p.sub(q).eq([7, 0, 2])).toBeTruthy();
    });
  });
});
