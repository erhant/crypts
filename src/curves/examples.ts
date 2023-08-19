import {Number} from '../common';
import {EllipticCurve} from '../curve';

export function TinyJubJub() {
  return class extends EllipticCurve {
    constructor(x: Number, y: Number) {
      super(x, y, [8, 8], 13);
    }
  };
}

export class Secp256k1 extends EllipticCurve {
  constructor(x: Number, y: Number) {
    super(x, y, [0, 7], '115792089237316195423570985008687907853269984665640564039457584007908834671663');
  }
}

export class AltBN128 extends EllipticCurve {
  constructor(x: Number, y: Number) {
    super(x, y, [0, 3], '21888242871839275222246405745257275088548364400416034343698204186575808495617');
  }
}

export class BLS12381 extends EllipticCurve {
  constructor(x: Number, y: Number) {
    super(x, y, [0, 4], '52435875175126190479447740508185965837690552500527637822603658699938581184513');
  }
}
