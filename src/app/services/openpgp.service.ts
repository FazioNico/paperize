import {
  readMessage,
  decrypt,
  generateKey,
  readKey,
  readPrivateKey,
  encrypt,
  createMessage,
  decryptKey,
} from 'openpgp/lightweight';
import { CryptoServiceInterface } from '.';


export class OpenPGPService implements CryptoServiceInterface {

  async encryptString(
    passphrase: string,
    data: string, 
  ) {
    const message = await createMessage({
      binary: new TextEncoder().encode(data), 
      format: 'utf8',
    }); 
    const encrypted = await encrypt({
      message,
      passwords: [passphrase],
      format: 'binary'
    });
    return btoa(encrypted.toString());
  }
  
  async decryptString(
    passphrase: string,
    data: string, 
  ) {
    const formatedData = atob(data);
    const binaryMessage = new Uint8Array(formatedData.split(',').map(byte => parseInt(byte)));
    const message = await readMessage({
      binaryMessage,
    });    
    const decrypted = await decrypt({
      message,
      passwords: [passphrase],
      format: 'binary'
    });
    return new TextDecoder().decode(decrypted.data);
  }

  private async _generateKeys(passphrase: string) {
    // use openpgp/lightweight to generate keypair from passphrase and encrypt the data
    const { privateKey: pri, publicKey: pub } = await generateKey({
      passphrase,
      // type: 'rsa',
      curve: 'p521',
      // rsaBits: 4096, // RSA key size (defaults to 4096 bits)
      userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }],
      format: 'armored'
    });
    const publicKey = await readKey({
      armoredKey: pub
    });
    const privateKey = await decryptKey({
      privateKey: await readPrivateKey({
                    armoredKey: pri
                  }),
      passphrase
    });
    console.log('[INFO] public key:', publicKey.armor());    
    return {
      publicKey,
      privateKey
    }
  }

}