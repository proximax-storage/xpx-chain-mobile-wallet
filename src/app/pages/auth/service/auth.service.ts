import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import findIndex from 'lodash/findIndex';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged = false;
  isLoggedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.logged);
  isLogged$: Observable<boolean> = this.isLoggedSubject.asObservable();
  user: string;
  constructor(
    private storage: Storage
  ) {
  }


  //   /**
  //  * Register new user.
  //  * @param firstname { string } The name of the user
  //  * @param lastname { string } The last name of the user
  //  * @param emailaddres { string } The email of the user
  //  * @param username { string } The user of the user
  //  * @param password { string } The password of the user
  //  */

  register(firstnameU: string, lastnameU: string, usernameU: string, passwordU: string) {
    return this.storage
      .get('accounts')
      .then(data => {
        const ACCOUNTS = data ? data : [];

        return ACCOUNTS;
      })
      .then((accounts: any[]) => {
        const accountFromInputU = {
          firstname: firstnameU,
          lastname: lastnameU,
          username: usernameU,
          password: passwordU
        };
        accounts.push(accountFromInputU);

        return this.storage.set('accounts', accounts), this.storage.set('pin', accountFromInputU.password);
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
        username: usernameP,
        password: passwordP
      };
      const ACCOUNTS = data ? data : [];

      let response: { status: string; message: string } = {
        status: '',
        message: ''
      };
      const accountExists = findIndex(ACCOUNTS, accountFromInput);

      if (accountExists === -1) {
        response = {
          status: 'failed',
          message:
            'It looks like there\'s something wrong with your username of password you entered. Please try again.'
        };
      } else {
        response = {
          status: 'success',
          message: 'You\'ve successfully logged in.'
        };
        this.user = usernameP;
        this.setLogged(true, this.user);
        // this.storage.set('isLoggedIn', true);
        this.storage.set('pin', accountFromInput.password);
      }
      return  response;
    });
  }


  setLogged(params: any, user:any) {
    this.logged = params;
    this.isLoggedSubject.next(this.logged);
  }


  getIsLogged() {
    return this.isLogged$;
  }


  logout(): Promise<any> {
    this.user = '';
    console.log('limoio', this.user)
    this.setLogged(false, this.user);
    return this.storage.set('isLoggedIn', false), this.storage.set('pin', '00');
  }
}
