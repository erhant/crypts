// import {TinyJubJub} from './curves/examples';
import {Field} from '../field';

const F13 = new Field(13);
// const F13x = F13.Polynomial;

for (const n of F13) {
  console.log('' + n);
}

// const p = new F13x([4, 2]);
// const q = new F13x([2]);
// console.log(`${p.div(q)}`);

// const TJJ = F13.EllipticCurve(8, 8);
// console.log(`${TJJ}`);
