import {FieldExtension} from '../src/fields';
import {F3 as F} from './common';

// TODO BUGGY
describe('field extension', () => {
  const Fxt = new FieldExtension(F.Polynomial([1, 0, 1]));
  const p = Fxt.Element([2, 2]);
  const q = Fxt.Element([1, 2]);

  it('addition', () => {
    expect(p.add(q).eq([0, 1])).toBeTruthy();
    expect(p.add(Fxt.zero).eq(p)).toBeTruthy();
  });

  it('subtraction', () => {
    expect(p.sub(q).eq([1, 0])).toBeTruthy();
    expect(p.sub(Fxt.zero).eq(p)).toBeTruthy();
  });

  it('multiplication', () => {
    expect(p.mul(q).eq([1, 0])).toBeTruthy();
    expect(p.mul(Fxt.one).eq(p)).toBeTruthy();
  });

  it('division', () => {
    const d = p.div(q);
    console.log(d + '');
    expect(p.div(q).eq([0, 2])).toBeTruthy();
    expect(p.div(Fxt.one).eq(p)).toBeTruthy();
  });
});
