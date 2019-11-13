import { Injectable } from '@angular/core';
import Forge from 'node-forge';

/*
  Generated class for the ForgeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ForgeProvider {

  public constructor() { }

  public generateSalt() {
      return Forge.util.encode64(Forge.random.getBytesSync(128));
  }

  public generateIv() {
      return Forge.util.encode64(Forge.random.getBytesSync(16));
  }

  /**
   * encrypt function we are expecting a string to be encrypted, a password to encrypt with which in our case will be the master password, a random salt and a random initialization vector. When the encryption process completes we will be returned a ciphertext string.
   *
   * @param {string} message
   * @param {string} masterPassword
   * @param {*} salt
   * @param {*} iv
   * @returns
   * @memberof ForgeProvider
   */
  public encrypt(message: string, masterPassword: string, salt: any, iv: any) {
      let key = Forge.pkcs5.pbkdf2(masterPassword, Forge.util.decode64(salt), 4, 16);
      let cipher = Forge.cipher.createCipher('AES-CBC', key);
      cipher.start({iv: Forge.util.decode64(iv)});
      cipher.update(Forge.util.createBuffer(message));
      cipher.finish();
      return Forge.util.encode64(cipher.output.getBytes());
  }


  /**
   * decrypt function will take pretty much the same information, but instead of a plaintext message we’ll pass the ciphertext. Plaintext will be returned after a successful decryption.
   * @param {string} cipherText
   * @param {string} masterPassword
   * @param {string} salt
   * @param {string} iv
   * @returns
   * @memberof ForgeProvider
   */
  public decrypt(cipherText: string, masterPassword: string, salt: string, iv: string) {
      let key = Forge.pkcs5.pbkdf2(masterPassword, Forge.util.decode64(salt), 4, 16);
      let decipher = Forge.cipher.createDecipher('AES-CBC', key);
      decipher.start({iv: Forge.util.decode64(iv)});
      decipher.update(Forge.util.createBuffer(Forge.util.decode64(cipherText)));
      decipher.finish();
      return decipher.output.toString();
  }

}
