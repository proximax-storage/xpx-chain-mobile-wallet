import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import * as BcryptJS from "bcryptjs";
import { ForgeProvider } from '../forge/forge';
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
    private storage: Storage,
    private forge: ForgeProvider
  ) { }


  /**
   * RJ
   *
   * @param {string} user
   * @param {string} password
   * @returns
   * @memberof AuthProvider
   */
  async createUser(user: string, password: string) {
    const data = await this.storage.get('accounts');
    const accounts = data ? data : [];
    let foundAccount = accounts.filter((account: any) => {
      return account.user.includes(user);
    });

    if (foundAccount.length > 0) {
      return "duplicate";
    } else {

      var encrypted = this.encryptAccount(password);
      const accountFromInput = {
        user: user.toLowerCase(),
        encrypted: encrypted.toString()
      };

      accounts.push(accountFromInput);
      this.setSelectedAccount(user, encrypted.toString());
      return this.storage.set('accounts', accounts);
    }
  }

  /**
   * RJ
   *
   * @param {string} password
   * @memberof AuthProvider
   */
  async decryptAccountUser(password: string, nameAccount?: string) {
    try {
      let account = null;
      if (nameAccount) {
        const accounts = await this.storage.get('accounts');
        account = accounts.find((x: any) => x.user === nameAccount);
      } else {
        account = await this.storage.get('selectedAccount');
      }

      if (account && account.encrypted) {
        const decryptBytes = CryptoJS.TripleDES.decrypt(account.encrypted, password);
        const decrypted = decryptBytes.toString(CryptoJS.enc.Utf8);
        return (decrypted !== '' && decrypted.length === 64) ? account : null;
      }

      return null;
    } catch (error) {
      return null;
    }
  }


  /**
  * RJ
  *
  * @returns
  * @memberof AuthProvider
  */
  encryptAccount(password: string) {
    const randomBytesArray = crypto.randomBytes(32);
    const hashKey = Convert.uint8ToHex(randomBytesArray);
    return CryptoJS.TripleDES.encrypt(hashKey, password);
  }

  /**
   * RJ
   *
   * @param {string} user
   * @param {string} password
   * @returns {Promise<any>}
   * @memberof AuthProvider
   */
  setSelectedAccount(account: any): Promise<any> {
    this.storage.set('isAccountCreated', true);
    this.storage.set('isLoggedIn', true);
    this.storage.set('selectedAccount', account);
    return;
  }


  // ------------------------------------------------------------------------------

  getUsername() {
    return this.storage.get('selectedAccount').then(data => {
      const result = data ? data : { user: '' };
      return result.user;
    });
  }


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

  /**
   * Register new user.
   * @param email { string } The email of the user
   * @param password { string } The password of the user
   */
  register(email: string, password: string) {
    return this.storage
      .get('accounts')
      .then(data => {
        const ACCOUNTS = data ? data : [];

        return ACCOUNTS;
      })
      .then((accounts: any[]) => {
        console.log("LOG: register -> accounts", accounts);

        let foundAccount = accounts.filter(account => {
          console.log("LOG: register -> foundAccount", foundAccount);
          return account.email.includes(email)
        });

        if (foundAccount.length > 0) {
          // duplicate account
          //  alert("Duplicate account");

          return "duplicate"

        } else {
          // TODO: Encrypt password
          const accountFromInput = {
            email: email.toLowerCase(),
            password: BcryptJS.hashSync(password, 8)
          };
          accounts.push(accountFromInput);
          return this.storage.set('accounts', accounts);
        }

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

  /**
   *
   *
   * @memberof AuthProvider
   */
  logout(){
    this.storage.set('isLoggedIn', false);
    this.storage.set('selectedAccount', null);
  }
}
