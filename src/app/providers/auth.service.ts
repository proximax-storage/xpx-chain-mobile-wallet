import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import findIndex from 'lodash/findIndex';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private storage: Storage
  ) { 
    console.log('Hello AuthProvider Provider');
  }


  //   /**
  //  * Register new user.
  //  * @param firstname { string } The name of the user
  //  * @param lastname { string } The last name of the user
  //  * @param emailaddres { string } The email of the user
  //  * @param username { string } The user of the user
  //  * @param password { string } The password of the user
  //  */

  register(firstname:string, lastname:string, username: string, password: string) {
    return this.storage
      .get('accounts')
      .then(data => {
        const ACCOUNTS = data ? data : [];

        return ACCOUNTS;
      })
      .then((accounts: any[]) => {
        const accountFromInput = {
          firstname: firstname,
          lastname: lastname,
          username: username,
          password: password
        };
        accounts.push(accountFromInput);
        return this.storage.set('accounts', accounts);
      });
  }

  //   /**
  //  * Login the user.
  //  * @param username { string } The username of the user
  //  * @param password { string } The password of the user
  //  */
  login(
    username: string,
    password: string
  ): Promise<{ status: string; message: string }> {
    return this.storage.get('accounts').then(data => {
      const accountFromInput = {
        username: username,
        password: password
      };
      const ACCOUNTS = data ? data : [];

      let response: { status: string; message: string } = {
        status: '',
        message: ''
      };
      let accountExists = findIndex(ACCOUNTS, accountFromInput);
      console.log("Accounts", ACCOUNTS);
      console.log("accountExists", accountExists);

      if (accountExists === -1) {
        response = {
          status: 'failed',
          message:
            "It looks like there's something wrong with your username of password you entered. Please try again."
        };
      } else {
        response = {
          status: 'success',
          message: "You've successfully logged in."
        };
      }

      return response;
    });
  }


}
