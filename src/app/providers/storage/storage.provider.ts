import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import find from 'lodash/find';
import * as BcryptJS from "bcryptjs";
import { Password } from 'tsjs-xpx-chain-sdk';
import { AuthService } from 'src/app/pages/auth/service/auth.service';

@Injectable()
export class StorageProvider {

  constructor(public storage: Storage,
    public authService: AuthService,) {}

    validatePaswword(
      password: string
    ): Promise<{ status: string; password: string }> {
      const username = this.authService.user;
      return this.storage.get('accounts').then(data => {
        const ACCOUNTS = data ? data : [];
        let response: { status: string; password: string } = {
          status: 'success',
          password: ''
        };
        let existingAccount = find(ACCOUNTS, (accounts) => { return accounts.username == username; });
  
        if(BcryptJS.compareSync(password, existingAccount.password)) {
          response = {
            status: 'success',
            password: password
          };
        }
        else {
          response = {
            status: 'failed',
            password: ''
          };
        }
        return response;
      });
    }


  
}
