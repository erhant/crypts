import {Field} from '../src';

// create a field
const order = 13;
const F = new Field(order);
console.log(`Field: ${F}\n`);

// create elements & multiply them
const a = F.random();
const r = F.random();
console.log(`${a} * ${r} = ${a.mul(r)}\n`);

// print all elements
console.log('All elements of F:');
for (const elem of F) {
  console.log(`${elem}`);
}
