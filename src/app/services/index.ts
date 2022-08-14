export interface CryptoServiceInterface {
  encryptString(
    passphrase: string,
    text: string,
  ) : Promise<string>

  decryptString(
    passphrase: string,
    data: string, 
  ) : Promise<string>
}
