import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import findIndex from 'lodash/findIndex';
import crypto from 'crypto';
import { Convert } from 'tsjs-xpx-chain-sdk';
import CryptoJS from 'crypto-js';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  constructor(
    private storage: Storage
  ) { }


  /**
   * 
   *
   * @param {string} password
   * @memberof AuthProvider
   */
  async decryptAccountUser(p: string, nameAccountUser?: string) {
    try {
      let wallet = null;
      if (nameAccountUser) {
        const wallets = await this.storage.get('myWallets');
        wallet = wallets.find((x: any) => x.user === nameAccountUser);
      } else {
        wallet = await this.storage.get('selectedWallet');
      }

      if (wallet && wallet.encrypted) {
        const db = CryptoJS.AES.decrypt(wallet.encrypted, CryptoJS.enc.Hex.stringify(this.ec(p, 20)));
        const d = db.toString(CryptoJS.enc.Utf8);
        return (d !== '' && d.length === 64 && Convert.isHexString(d)) ? wallet : null;
      }

      return null;
    } catch (error) {
      return null;
    }
  }


  /**
  * 
  *
  * @returns
  * @memberof AuthProvider
  */
  encryptAccount(p: string) {
    const randomBytesArray = crypto.randomBytes(32);
    const hashKey = Convert.uint8ToHex(randomBytesArray);
    console.log(CryptoJS.enc.Hex.stringify(this.ec(p, 20)));
    return CryptoJS.AES.encrypt(hashKey, CryptoJS.enc.Hex.stringify(this.ec(p, 20)));
  }

  /**
   *
   *
   * @param {*} a
   * @memberof AuthProvider
   */
  ec(a: any, i: number) {
    for (let d = 0; d < i; ++d)
      a = CryptoJS.SHA3(a, { outputLength: 256 });
    return a;
  }

  /**
  *
  *
  * @memberof AuthProvider
  */
  logout() {
    this.storage.set('isLoggedIn', false);
    this.storage.set('selectedWallet', null);
  }

  


  // -----------------------------------------------------------------------------------------------------------------------------------------------




  getPassword() {
    return this.storage.get('plainPassword').then(password => {
      const PASSWORD = password || '';
      return PASSWORD;
    });
  }


  /**
   * Check email if it is registered already.
   * @param email The email to check in secure storage.
   */
  checkAccountExistence(email): Promise<boolean> {
    let exists: boolean = false;
    return this.storage.get('accounts').then(data => {
      const ACCOUNTS = data ? data : [];

      if (findIndex(ACCOUNTS, email) === -1) {
        exists = true;
      }

      return exists;
    });
  }


  edit(oldUsername: string, newUsername: string, newPassword: string) {
    return this.storage.get('accounts').then(data => {
      const ACCOUNTS = data ? data : [];
      console.log(ACCOUNTS);
      if (findIndex(ACCOUNTS, oldUsername) === -1) {
        let _newAccounts = ACCOUNTS.filter(res => {
          return res.email != oldUsername;
        })
        console.log(_newAccounts);
        _newAccounts.push({ email: newUsername, password: newPassword });
        console.log(_newAccounts);
        return _newAccounts;
      }

    });
  }

  /**
   * Removes the email and password of the logged in user.
   */
  remove(email: string) {
    return this.storage
      .get('accounts')
      .then(data => {
        const ACCOUNTS = data ? data : [];
        return ACCOUNTS;
      })
      .then((accounts: any[]) => {
        if (accounts) {
          const ACCOUNT_INDEX = findIndex(accounts, { email: email });
          accounts.splice(ACCOUNT_INDEX, 1);

          return this.storage.set('accounts', accounts);
        }
      });
  }
}

