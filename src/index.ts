import {Field} from './field';

const F13 = Field(13);

const n = F13(2);
const m = F13(12);

console.log(n.add(m).n);
