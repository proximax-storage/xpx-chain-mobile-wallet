import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { BehaviorSubject, Observable } from 'rxjs';
import * as BcryptJS from "bcryptjs";



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged = false;
  isLoggedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.logged);
  isLogged$: Observable<boolean> = this.isLoggedSubject.asObservable();
  user: string;
  pin: string;
  dataUser: any;
  otrosUser: any;
  constructor(
    private storage: Storage
  ) {
  }

  userData(data, otros) {
    this.dataUser = data
    this.otrosUser = otros
  }
  //   /**
  //  * Register new user.
  //  * @param firstname { string } The name of the user
  //  * @param lastname { string } The last name of the user
  //  * @param emailaddres { string } The email of the user
  //  * @param username { string } The user of the user
  //  * @param password { string } The password of the user
  //  */

  register(firstname: string, lastname: string, username: string, password: string) {
    return this.storage
      .get('accounts')
      .then(data => {
        const ACCOUNTS = data ? data : [];
        return ACCOUNTS;
      })
      .then((accounts: any[]) => {

        let foundAccount = accounts.filter( account => {
          return account.username.includes(username.toLowerCase())
       });

       if(foundAccount.length > 0) {
         return "duplicate"

       } else {
        const accountFromInputU = {
          firstname: firstname,
          lastname: lastname,
          username: username.toLowerCase(),
          password: BcryptJS.hashSync(password, 8)
        };
        accounts.push(accountFromInputU);
        return this.storage.set('accounts', accounts);
       }
      });
  }

  //   /**
  //  * Login the user.
  //  * @param username { string } The username of the user
  //  * @param password { string } The password of the user
  //  */
  login(
    usernameP: string,
    passwordP: string
  ): Promise<{ status: string; message: string }> {
    return this.storage.get('accounts').then(data => {
      const accountFromInput = {
        username: usernameP.toLowerCase(),
        password: passwordP
      };
      const ACCOUNTS = data ? data : [];
      let response: { status: string; message: string } = {
        status: 'success',
        message: ''
      };
      let existingAccount = find(ACCOUNTS, (accounts) => { return accounts.username == accountFromInput.username; });

      if(BcryptJS.compareSync(accountFromInput.password, existingAccount.password)) {
        response = {
          status: 'success',
          message: "You've successfully logged in."
        };
        this.user = usernameP.toLowerCase();
        this.setLogged(true, this.user);
        this.pin = accountFromInput.password;
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

  setLogged(params: any, user: any) {
    this.logged = params;
    this.isLoggedSubject.next(this.logged);
  }

  getIsLogged() {
    return this.isLogged$;
  }

  logout(): Promise<any> {
    this.user = '';
    this.setLogged(false, this.user);
    this.pin = '';
    return this.storage.set('pin', null);
  }
}
