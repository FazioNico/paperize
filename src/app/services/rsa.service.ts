
import { pki, random, util } from 'node-forge';
import { CryptoServiceInterface } from '.';

export class RSAService implements CryptoServiceInterface {

  async encryptString(
    passphrase: string,
    text: string
  ) {
    const { publicKey } = await this._generateKeys(passphrase);
    console.log('[INFO] encrypting data...');    
    const encryptedData = publicKey.encrypt(text);
    console.log('[INFO] encoding encrypted data...');
    const encrypted = util.encode64(encryptedData);
    console.log('[INFO] Generate SHA256 hash of encrypted data...');
    return `${encrypted}`;
  }

  async decryptString(
    passphrase: string,
    text: string
  ) {
    const { privateKey } = await this._generateKeys(passphrase);
    console.log('[INFO] decoding data...');
    const decodedData = util.decode64(text);
    console.log('[INFO] decrypting data...');
    const decryptedData = privateKey.decrypt(decodedData);
    console.log('[INFO] data decrypted.');
    return decryptedData;
  }

  private async _generateKeys(passphrase: string) {
    console.log('[INFO] generating prng with passphrase...');
    const prng = random.createInstance();
    prng.seedFileSync = () => passphrase;
    console.log('[INFO] generating RSA-4096 Keypair...');
    const { privateKey: privateKeyPKI, publicKey: publicKeyPKI } =
      pki.rsa.generateKeyPair({
        bits: 4096,
        prng,
        workers: -1,
      });
    console.log('[INFO] Keypair generated.');    
    return {
      privateKey: privateKeyPKI,
      publicKey: publicKeyPKI,
    };
  }

}