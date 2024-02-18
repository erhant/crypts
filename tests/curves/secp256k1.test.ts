import {expect, describe, it} from 'bun:test';
import {Field, curves} from '../../src';

describe('secp256k1', () => {
  const secp256k1 = curves.secp256k1();

  describe('wallet generation', () => {
    // https://blockchain-academy.hs-mittweida.de/bitcoin-address-generator/
    it.todo('should compute correct Bitcoin wallet', () => {
      const privateKey = 0xb142a363087bef1c5862b841da4d92e6126114ad13aef8480dd3c75bda90c62an;

      console.log('Private Key:', privateKey.toString(16));

      const publicKeyPoint = secp256k1.generator!.scale(privateKey);
      expect(publicKeyPoint.x.eq(0x343b8003551df84d44a6e54563c6dd344cccc11fa65585e7eff3e964b4856e10n)).toBeTrue();
      expect(publicKeyPoint.y.eq(0x415b86dce5e7c5738e359176a0e9b58f69f7ea894bfac62cfdbdf6cdebe8948bn)).toBeTrue();
      const publicKeyUncompressed = publicKeyPoint.toUncompressed();
      expect(publicKeyUncompressed).toBe(
        '041e207e6981a091cc548f3fc26880a72c798aea317570aac93ea86890ec87dbd8415b86dce5e7c5738e359176a0e9b58f69f7ea894bfac62cfdbdf6cdebe8948b'
      );
      const publicKeyCompressed = publicKeyPoint.toCompressed();
      expect(publicKeyCompressed).toBe('031e207e6981a091cc548f3fc26880a72c798aea317570aac93ea86890ec87dbd8');

      // const sha256 = new Bun.CryptoHasher('sha256');
      // const ripemd160 = new Bun.CryptoHasher('ripemd160');
      // const publicKeyDigest = sha256.update(publicKey.toUncompressed()).digest();
      // const publicKeyDigest2 = ripemd160.update(publicKeyDigest).digest();
      // console.log('Address:    ', '0x' + Buffer.from(publicKeyDigest2.buffer).toString('hex'));
    });
  });
});
