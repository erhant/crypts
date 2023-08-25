// import {TinyJubJub} from './curves/examples';
import {Field, FieldExtension} from '../fields';

const F3 = new Field(3);
const F3x = F3.Polynomial([1, 0, 1]);
const F3_2 = new FieldExtension(F3x);

const p = F3_2.Element([1, 2]);
const q = F3_2.Element([0, 1]);

console.log(p.inv() + '');
console.log(q.inv() + '\n');
