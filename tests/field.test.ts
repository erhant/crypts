import {legendreSymbol} from '../src/fields';
import {F13} from './common';

const F = F13;

describe('field element', () => {
  const n = F.Felt(2);
  const m = F.Felt(7);

  it('addition', () => {
    expect(n.add(m).eq(9)).toBeTruthy();
    expect(n.add(F.zero).eq(n)).toBeTruthy();
  });

  it('subtraction', () => {
    expect(n.sub(m).eq(8)).toBeTruthy();
    expect(n.sub(F.zero).eq(n)).toBeTruthy();
  });

  it('multiplication', () => {
    expect(n.mul(m).eq(1)).toBeTruthy();
    expect(n.mul(F.one).eq(n)).toBeTruthy();
  });

  it('division', () => {
    expect(n.div(m).eq(4)).toBeTruthy();
    expect(n.div(F.one).eq(n)).toBeTruthy();
  });

  it('legendre symbol', () => {
    expect(legendreSymbol(n)).toEqual(-1n);
    expect(legendreSymbol(m)).toEqual(-1n);

    expect(legendreSymbol(F.zero)).toEqual(0n);

    expect(legendreSymbol(F.one)).toEqual(1n);
    expect(F.one.isQuadraticResidue()).toBeTruthy();
  });
});
