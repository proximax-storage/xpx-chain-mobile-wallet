import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the MockDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MockDataProvider {

  pin: string;
  accounts: Array<{ email: string, password: string }>;
  wallets: any;
  selectedAccount: { email: string, password: string };
  selectedWallet: any;

  constructor(private storage: Storage) {
    console.log('Hello MockDataProvider Provider');
  }

  init() {
    Promise.all([
      this.storage.get('pin'),
      this.storage.get('myWallets'),
      this.storage.get('accounts'),
      this.storage.get('selectedWallet'),
      this.storage.get('selectedAccount'),
    ]).then(results => {
      console.log(results);
      const PIN = results[0];
      const WALLETS = results[1];
      const ACCOUNTS = results[2];
      const SELECTED_WALLET = results[3];
      const SELECTED_ACCOUNT = results[4];
      
      // if (!PIN) this.storage.set('pin', this.pin); // TODO Enable during testing by ios
      if (!PIN) this.storage.set('pin', false); // TODO Disable during production
      if (!ACCOUNTS) this.storage.set('accounts', this.accounts);
      if (!WALLETS) this.storage.set('myWallets', this.wallets);
      if (!SELECTED_ACCOUNT) this.storage.set('selectedAccount', this.selectedAccount);
      if (!SELECTED_WALLET) this.storage.set('selectedWallet', this.selectedWallet);
    });
  }
}
