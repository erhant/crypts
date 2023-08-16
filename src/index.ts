import {Field} from './field';

const F13 = Field(13);
const n = new F13(2);
const m = new F13(-1);
const k = n.add(m);
console.log(k + '');

const F13x = F13.poly('x');
const p = new F13x([10, 2, 3]);
const q = new F13x([3, 2, 1]);
const r = p.sub(q);
console.log(r + '');
console.log(r.eval(1) + '\n' + r.eval(0));

for (let i = 0; i < 30; i++) {
  console.log(F13.random() + '');
}
