// import {TinyJubJub} from './curves/examples';
import {Field} from '.';
import {isPrimeNaive, randomPrime} from './numbers';

if (import.meta.path === Bun.main) {
  // const F3 = new Field(23);
  // const n = F3.Element(3);

  // for (const m of F3) {
  //   console.log(`${n}^${m}\t${n.exp(m.value)}\t${n.value ** m.value % 23n}`);
  // }

  console.log(isPrimeNaive(2n));
}
