import { Injectable } from '@angular/core';
import { SHA256 } from 'crypto-js';
import { BehaviorSubject } from 'rxjs';
import { CryptoServiceInterface } from '.';
import { OpenPGPService } from './openpgp.service';
import { RSAService } from './rsa.service';

const ALGS_SERVICES = [
  {
    name: 'RSA',
    service: RSAService,
  }, 
  {
    name: 'OpenPGP',
    service: OpenPGPService,
  }
];
 
@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  public readonly state$: BehaviorSubject<string> = new BehaviorSubject(null as any);
  private readonly _appToken = 'paperize-qrcode';
  private readonly _algs: { name: string, service: any }[] = ALGS_SERVICES;

  async encryptString(
    passphrase: string,
    text: string,
    alg: string = 'OpenPGP'
  ) {
    const service = await this._getAlgoService(alg);
    this.state$.next('[INFO] Encrypting data...');   
    await this._sleep(1618); 
    const encrypted = await service
      .encryptString(passphrase, text)
      .then(r => (`${this._appToken}:${r}`));
    await this._sleep(1618); 
    this.state$.next('[INFO] Generate SHA256 hash...');
    const hash = SHA256(encrypted).toString();
    const shortHash = hash.substring(0, 9);
    await this._sleep(1618); 
    this.state$.next('[INFO] Data encrypted successfully');
    return {
      encrypted,
      hash,
      shortHash
    };
  }

  async decryptString(
    passphrase: string,
    text: string,
    alg: string = 'OpenPGP'
  ) {    
    const service = await this._getAlgoService(alg);
    this.state$.next('[INFO] decrypting data...');
    this._sleep(1618);
    const decryptedData = await service.decryptString(passphrase, text.replace(`${this._appToken}:`, ''));
    this.state$.next('[INFO] data decrypted.');
    return decryptedData;
  }

  private _getAlgoService(algName: string): CryptoServiceInterface {
    const alg = this._algs.find(a => a.name === algName);
    if (!alg) {
      throw new Error(`Algorithm ${alg} not supported.`);
    }
    const { service = null } = alg;
    return new service();
  }

  private async _sleep(durationMs: number = 1000) {
    await new Promise((resolve) => {
      const t = setTimeout(()=> {
        resolve(true);
        clearTimeout(t);
      }, durationMs)
    });
  }

}


//     encrypted_secret=$(echo -n "$share" | gpg --batch --passphrase-fd 3 --s2k-mode 3 --s2k-count 65011712 --s2k-digest-algo sha512 --cipher-algo AES256 --symmetric --armor 3<<<"$passphrase")
// too js

/*
    const {
      privateKey: privateKeyArmoredPGP,
      publicKey: publicKeyArmoredPGP,
      revocationCertificate,
    } = await generateKey({
      // type: 'ecc', // Type of the key, defaults to ECC
      // curve: 'curve25519', // ECC curve name, defaults to curve25519
      type: 'rsa', // Type of the key
      rsaBits: 4096, // RSA key size (defaults to 4096 bits)
      userIDs: [{ name, email }], // you can pass multiple user IDs
      passphrase: 'demo', // protects the private key
      // format: 'armored', // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });
    const publicKey = await readKey({
      armoredKey: publicArmoredKeyPKI
        .replace(
          '-----BEGIN PUBLIC KEY-----',
          '-----BEGIN PGP PUBLIC KEY BLOCK-----\n'
        )
        .replace(
          '-----END PUBLIC KEY-----',
          '\n-----END PGP PUBLIC KEY BLOCK-----'
        ), //publicKeyArmoredPGP,
    });
    const privateKey = await readPrivateKey({
      armoredKey: privateArmoredKeyPKI
        .replace(
          '-----BEGIN PRIVATE KEY-----',
          '-----BEGIN PGP PRIVATE KEY BLOCK-----\n'
        )
        .replace(
          '-----END PRIVATE KEY-----',
          '\n-----END PGP PRIVATE KEY BLOCK-----'
        ), // privateKeyArmoredPGP,
    });
    await decryptKey({
      privateKey: await readPrivateKey({
        armoredKey: privateArmoredKeyPKI
          .replace(
            '-----BEGIN PRIVATE KEY-----',
            '-----BEGIN PGP PRIVATE KEY BLOCK-----\n'
          )
          .replace(
            '-----END PRIVATE KEY-----',
            '\n-----END PGP PRIVATE KEY BLOCK-----'
          ), // privateKeyArmoredPGP,
      }),
      passphrase: 'demo',
    });
    */
