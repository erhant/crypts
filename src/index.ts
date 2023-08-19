// import {TinyJubJub} from './curves/examples';
import {Field} from './field';

const F13 = Field(13);

const F13x = F13.Polynomial();
const p = new F13x([4, 0, 2]);
console.log(`${p}`);

// const TJJ = F13.EllipticCurve(8, 8);
