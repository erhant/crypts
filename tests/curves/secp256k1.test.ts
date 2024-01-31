import {expect, describe, it} from 'bun:test';
import {Field, curves} from '../../src';

// TODO: wallet generation test

describe.todo('secp256k1', () => {
  const secp256k1 = curves.secp256k1();

  describe('wallet generation', () => {
    it.todo('should compute correct Bitcoin wallet', () => {
      const privateKey = 0x00; // TODO: !;
      const expectedAddress = 0x00; // TODO: !

      console.log('Private Key:', privateKey.toString(16));

      const sha256 = new Bun.CryptoHasher('sha256');
      const ripemd160 = new Bun.CryptoHasher('ripemd160');

      const publicKey = secp256k1.generator!.scale(privateKey);
      console.log('Public Key: ', publicKey.toUncompressed());

      const publicKeyDigest = sha256.update(publicKey.toUncompressed()).digest();
      const publicKeyDigest2 = ripemd160.update(publicKeyDigest).digest();
      console.log('Address:    ', '0x' + Buffer.from(publicKeyDigest2.buffer).toString('hex'));
    });

    it.todo('should compute correct Ethereum wallet', () => {
      const privateKey = 0xdc38ee117cae37750eb1ecc5cfd3de8e85963b481b93e732c5d0cb66ee6b0c9dn;
      const expectedAddress = 0xc5ed5d9b9c957be2baa01c16310aa4d1f8bc8e6fn; // as calculated by MetaMask

      // TODO: implement
    });
  });
});
