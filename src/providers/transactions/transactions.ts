import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction, PublicAccount } from 'tsjs-xpx-chain-sdk';
import { ProximaxProvider } from '../proximax/proximax';

/*
  Generated class for the TransactionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransactionsProvider {

  constructor(public http: HttpClient, private proximaxProvider: ProximaxProvider) {
    console.log('Hello TransactionsProvider Provider');
  }

  getAllTransactionsFromAccount(publicAccount: PublicAccount): Observable<Transaction[]> {
    const pageSize = 10;
    const transaction = this.proximaxProvider.getAllTransactionsFromAccount(publicAccount, pageSize)
    return transaction;
  }

}
