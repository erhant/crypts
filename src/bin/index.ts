// import {TinyJubJub} from './curves/examples';
import {Field} from '../fields';

const ord = 13;
const F = new Field(ord);
console.log(F);

for (const e of F) {
  console.log('' + e.inv());
}

// const p = new F13x([4, 2]);
// const q = new F13x([2]);
// console.log(`${p.div(q)}`);

// const TJJ = F13.EllipticCurve(8, 8);
// console.log(`${TJJ}`);
