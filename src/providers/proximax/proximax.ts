import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkType, Password, SimpleWallet, AccountHttp, MosaicHttp, NamespaceHttp, MosaicService, NamespaceService, TransactionHttp, Address, AccountInfo, Transaction, PublicAccount, QueryParams, Account, MosaicId, MosaicAmountView } from 'tsjs-xpx-chain-sdk';
import { AppConfig } from '../../app/app.config';
import { Observable } from 'rxjs/Observable';
import { crypto } from 'js-xpx-chain-library'
import { walletInterface, commonInterface } from '../interfaces/shared.interfaces';
import { MosaicNames } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNames';
// import { commonInterface, walletInterface } from '../interfaces/shared.interfaces';
// import { Observable } from 'rxjs';

/*
  Generated class for the ProximaxProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProximaxProvider {

  networkType: NetworkType;
  wsNodeUrl: string;
  httpUrl: string;
  accountHttp: AccountHttp;
  mosaicHttp: MosaicHttp;
  namespaceHttp: NamespaceHttp;
  mosaicService: MosaicService;
  namespaceService: NamespaceService;
  transactionHttp: TransactionHttp;

  constructor(public http: HttpClient) {
    this.networkType = NetworkType[AppConfig.sirius.networkType];
    this.httpUrl = AppConfig.sirius.httpNodeUrl;
    this.wsNodeUrl = AppConfig.sirius.wsNodeUrl;
    this.accountHttp = new AccountHttp(this.httpUrl);
    this.mosaicHttp = new MosaicHttp(this.httpUrl);
    this.namespaceHttp = new NamespaceHttp(this.httpUrl);
    this.mosaicService = new MosaicService(this.accountHttp, this.mosaicHttp);
    this.namespaceService = new NamespaceService(this.namespaceHttp);
    this.transactionHttp = new TransactionHttp(this.httpUrl);
  }

  createPassword(value) {
    const password = new Password(value)
    return password;
  }

  createSimpleWallet(name: string, password: Password) {
    return SimpleWallet.create(name, password, this.networkType);
  }

  createAccountFromPrivateKey(nameWallet: string, password: Password, privateKey: string): SimpleWallet {
    return SimpleWallet.createFromPrivateKey(nameWallet, password, privateKey, this.networkType);
  }

  decryptPrivateKey(password: Password, encryptedKey: string, iv: string): string {
    const common: commonInterface = {
      password: password.value,
      privateKey: ''
    };

    const wallet: walletInterface = {
      encrypted: encryptedKey,
      iv: iv,
    };

    crypto.passwordToPrivatekey(common, wallet, 'pass:bip32');
    return common.privateKey;
  }

getAccountInfo(address: Address): Observable<AccountInfo> {
  return this.accountHttp.getAccountInfo(address);
}

getAllTransactionsFromAccount(publicAccount: PublicAccount, queryParams?): Observable<Transaction[]> {
  return this.accountHttp.transactions(publicAccount, new QueryParams(queryParams));
}

getBalance(address: Address): Observable<MosaicAmountView[]> {
  return this.mosaicService.mosaicsAmountViewFromAddress(address);
}

createFromRawAddress(address: string): Address {
  return Address.createFromRawAddress(address);
}

getPublicAccountFromPrivateKey(privateKey: string, net: NetworkType): PublicAccount {
  return Account.createFromPrivateKey(privateKey, net).publicAccount;
}

getMosaicNames(mosaicIds: MosaicId[]): Observable<MosaicNames[]>{
  return this.mosaicHttp.getMosaicNames(mosaicIds);
}

checkAddress(privateKey: string, net: NetworkType, address: string): boolean {
  return (Account.createFromPrivateKey(privateKey, net).address.plain() === address) ? true : false;
}



}
