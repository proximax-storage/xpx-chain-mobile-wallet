import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import * as BcryptJS from "bcryptjs";
import { ForgeProvider } from '../forge/forge';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  constructor(private storage: Storage, private forge: ForgeProvider) {
    console.log('Hello AuthProvider Provider');
  }



  getUsername() {
    return this.storage.get('selectedAccount').then(data => {
      const result = data ? data : { email: '' };
      return result.email;
    });
  }


  getPassword() {
    return this.storage.get('plainPassword').then(password => {
      const PASSWORD = password || '';
      return PASSWORD;
    });
  }


  setSelectedAccount(email: string, password: string): Promise<any> {

      // TODO : Encrypt password
    const ACCOUNT = {
      email: email,
      password: BcryptJS.hashSync(password, 8)
    };

    return this.storage.set('isAccountCreated', true)
      .then(_ => {
      return this.storage.set('isLoggedIn', true)
      })
      .then(_ => {
        return this.storage.get('selectedAccount');
      })
      .then(_ => {
        return ACCOUNT;
      })
      .then(_ => {
        return this.storage.set('selectedAccount', ACCOUNT); // Ecnrypted password
      })
      .then(_ => {
        return this.storage.set('plainPassword', password); // Plain password
      });
  }

  /**
   * Login the user.
   * @param email { string } The email of the user
   * @param password { string } The password of the user
   */
  login(
    email: string,
    password: string
  ): Promise<{ status: string; message: string }> {
    return this.storage.get('accounts').then(data => {
      
      // TODO : Encrypt password
      const ACCOUNT = {
        email: email,
        password: password
      };
      const ACCOUNTS = data ? data : [];

      let response: { status: string; message: string } = {
        status: '',
        message: ''
      };

      let existingAccount = find(ACCOUNTS, (accounts) => { return accounts.email == ACCOUNT.email; });
      
      if(BcryptJS.compareSync(ACCOUNT.password, existingAccount.password)) {
        console.log("Accounts", ACCOUNTS);
        console.log("accountExists", existingAccount);
        response = {
          status: 'success',
          message: "You've successfully logged in."
        };
      }
      else {
        response = {
          status: 'failed',
          message:
            "Invalid username or password. Please try again."
        };
      }
      return response;
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
        
        let foundAccount = accounts.filter( account => {
					console.log("LOG: register -> foundAccount", foundAccount);
          return account.email.includes(email)
       });

       if(foundAccount.length > 0) {
         // duplicate account
        //  alert("Duplicate account");

         return "duplicate"

       } else {
        // TODO: Encrypt password
        const accountFromInput = {
          email: email,
          password: BcryptJS.hashSync(password, 8)
        };
        accounts.push(accountFromInput);
        return this.storage.set('accounts', accounts);
       }
        
      });
  }

  edit(oldUsername:string, newUsername:string, newPassword:string) {
      return this.storage.get('accounts').then(data => {
        const ACCOUNTS = data ? data : [];

        console.log(ACCOUNTS);
  
        if (findIndex(ACCOUNTS, oldUsername) === -1) {
          let _newAccounts = ACCOUNTS.filter(res=>{
            return res.email != oldUsername;
          })
          console.log(_newAccounts);
          _newAccounts.push({email: newUsername, password: newPassword});
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
   * Log out account delete any related data to it.
   */
  logout(): Promise<any> {
    return this.storage.set('isLoggedIn', false).then(_ => {
      this.storage.set('selectedAccount', {})
    })
    .then(_=> {

      return this.encryptPasswordUsingCurrentPin();
    });
  }

  private encryptPasswordUsingCurrentPin() {
    Promise.all([
      this.storage.get("currentPin"),
      this.storage.get("plainPassword"),
    ]).then(results => {
      const CURRENT_PIN = results[0];
      const PLAIN_PASSWORD = results[1];
      const SALT = this.forge.generateSalt();
      const IV = this.forge.generateIv();
      const ENCRYPTED_PASSWORD = this.forge.encrypt(PLAIN_PASSWORD, CURRENT_PIN, SALT, IV);

      Promise.all([
        this.storage.set("currentPin", null),
        this.storage.set("plainPassword", null),
        this.storage.set("encryptedPassword", {password: ENCRYPTED_PASSWORD, salt: SALT, iv: IV }),
      ]).then(res=> {
        return res;
      })
    });
  }
}
