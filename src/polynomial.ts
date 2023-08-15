import {Felt} from './field';

export interface Polynomial {
  coeffs: Felt[];

  add(q: Polynomial): Polynomial;
  sub(n: Felt): Felt;
  mul(n: Felt): Felt;
  neg(): Felt;
  sign(): boolean;
}
