// import {TinyJubJub} from './curves/examples';
import {Field} from '../field';

const F3 = new Field(3);
const F3_2 = F3.Extension([1, 0, 1]);

for (const p of F3_2) {
  console.log('' + p);
}

// const p = new F13x([4, 2]);
// const q = new F13x([2]);
// console.log(`${p.div(q)}`);

// const TJJ = F13.EllipticCurve(8, 8);
// console.log(`${TJJ}`);
