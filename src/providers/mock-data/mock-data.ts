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

  private initData() {
    this.pin = '1111';

    this.accounts = [
      {
        email: 'apps@proximax.io',
        password: '123qweasd'
      }
    ];

    this.wallets = {
      'apps@proximax.io': [
        {
          "wallet": "eyJuYW1lIjoiVGVzdFdhbGxldCIsIm5ldHdvcmsiOiIxNTIiLCJhZGRyZXNzIjoiVERLWjQzQkdJQTdPN05MUERKNFk0QkU0VDNKRjNUSUhVTEw2WjNBMiIsImNyZWF0aW9uRGF0ZSI6IjIwMTktMDQtMjVUMDE6MjA6MjMuMTQxIiwic2NoZW1hIjoxLCJ0eXBlIjoic2ltcGxlIiwiZW5jcnlwdGVkUHJpdmF0ZUtleSI6Ijc0MjQ2ZDg1NzkyMWY2NDgyNTJhNWMzYWU4MzU1MDRlYzcwY2FlN2NhMDg5MzgwNmNkYTZjNWQ3MmMwNmU2ZGMyZmQ4M2RhNmM1YmUxODIwNTFiM2U0YjE0MmI4Yzk5MCIsIml2IjoiOGY3NDcxMDFlYTY4NzVjZTcyNGI5NGQ2OTEyYWYwZDYifQ==",
          "walletColor": "wallet-1"
        }
      ]
    };

    this.selectedAccount = {
      email: 'apps@proximax.io',
      password: '123qweasd'
    };

    this.selectedWallet = {
      "wallet": "eyJuYW1lIjoiVGVzdFdhbGxldCIsIm5ldHdvcmsiOiIxNTIiLCJhZGRyZXNzIjoiVERLWjQzQkdJQTdPN05MUERKNFk0QkU0VDNKRjNUSUhVTEw2WjNBMiIsImNyZWF0aW9uRGF0ZSI6IjIwMTktMDQtMjVUMDE6MjA6MjMuMTQxIiwic2NoZW1hIjoxLCJ0eXBlIjoic2ltcGxlIiwiZW5jcnlwdGVkUHJpdmF0ZUtleSI6Ijc0MjQ2ZDg1NzkyMWY2NDgyNTJhNWMzYWU4MzU1MDRlYzcwY2FlN2NhMDg5MzgwNmNkYTZjNWQ3MmMwNmU2ZGMyZmQ4M2RhNmM1YmUxODIwNTFiM2U0YjE0MmI4Yzk5MCIsIml2IjoiOGY3NDcxMDFlYTY4NzVjZTcyNGI5NGQ2OTEyYWYwZDYifQ==",
      "walletColor": "wallet-1"
    };
  }

  init() {
    this.initData();

    Promise.all([
      this.storage.get('pin'),
      this.storage.get('wallets'),
      this.storage.get('accounts'),
      this.storage.get('selectedWallet'),
      this.storage.get('selectedAccount'),
    ]).then(results => {

      const PIN = results[0];
      const ACCOUNTS = results[1];
      const WALLETS = results[2];
      const SELECTED_ACCOUNT = results[3];
      const SELECTED_WALLET = results[4];

      // if (!PIN) this.storage.set('pin', this.pin); // TODO Enable during testing by ios
      if (!PIN) this.storage.set('pin', false); // TODO Disable during production
      if (!ACCOUNTS) this.storage.set('accounts', this.accounts);
      if (!WALLETS) this.storage.set('wallets', this.wallets);
      if (!SELECTED_ACCOUNT) this.storage.set('selectedAccount', this.selectedAccount);
      if (!SELECTED_WALLET) this.storage.set('selectedWallet', this.selectedWallet);
    });
  }
}
