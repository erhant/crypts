import {Field} from './field';

const F13 = Field(13);

const F13x = F13.Polynomial();
const p = new F13x([3, 2, 3, 2, 0, 1]);
const q = new F13x([2, 1, 2, 1, 2]);
const r = p.div(q);
console.log(r + '');
