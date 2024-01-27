import {Field, TwistedEdwardsCurve} from '../src';

const ed25519 = new TwistedEdwardsCurve(
  new Field(0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn),
  [-1, 0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n],
  {
    scalarOrder: 0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,
    generator: [
      0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,
      0x6666666666666666666666666666666666666666666666666666666666666658n,
    ],
  }
);

const invTwo = ed25519.scalar!.Element(2).inv();
console.log(ed25519.generator!.scale(invTwo.value).toString(true));
