import { Injectable } from '@angular/core';
import { commonInterface, walletInterface } from './interfaces/shared.interfaces';
import { environment } from '../../environments/environment';
import { crypto } from 'js-xpx-catapult-library';
import {
  Listener,
  Password,
  SimpleWallet,
  Account,
  Address,
  AccountHttp,
  MosaicHttp,
  NamespaceHttp,
  MosaicService,
  MosaicAmountView,
  Transaction,
  PublicAccount,
  QueryParams,
  AccountInfo,
  NetworkType,
  TransactionHttp,
  TransferTransaction,
  Deadline,
  PlainMessage,
  SignedTransaction,
  TransactionAnnounceResponse,
  Mosaic,
  MosaicId,
  UInt64,
  TransactionStatusError,
  TransactionStatus,
  MosaicInfo,
  NamespaceId,
  NamespaceInfo,
  RegisterNamespaceTransaction,
  MosaicDefinitionTransaction,
  MosaicProperties,
  MosaicSupplyChangeTransaction,
  NamespaceService,
  MosaicView
  
  } from 'tsjs-xpx-catapult-sdk';
  import { Observable } from 'rxjs';
  import { MosaicXPXInterface } from '../pages/wallets/interfaces/transaction.interface'


@Injectable({
  providedIn: 'root'
})
export class ProximaxProvider {


  accountHttp: AccountHttp;
  mosaicService: MosaicService;
  url: any;
  mosaicXpx: MosaicXPXInterface = {
    mosaic: "prx:xpx",
    mosaicId: "d423931bd268d1f4",
    divisibility: 6
  };


  constructor() { }

createPassword(value) {
    const password = new Password(value)
    return password;
  }

createSimpleWallet(name: string, password: Password, network: number) {
    return SimpleWallet.create(name, password, network);

  }

createAccountFromPrivateKey(nameWallet: string, password: Password, privateKey: string, network: number): SimpleWallet {
    return SimpleWallet.createFromPrivateKey(nameWallet, password, privateKey, network);
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
      console.log('llega a provider', address);
      return this.accountHttp.getAccountInfo(address);
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

  initInstances(url: string) {
    // console.log('instances', url)
    this.url = `${environment.protocol}://${url}`;
    this.accountHttp = new AccountHttp(this.url);
    console.log('........url', this.url);
    console.log('........accountHttp', this.accountHttp);
  }

  checkAddress(privateKey: string, net: NetworkType, address: string): boolean {
    return (Account.createFromPrivateKey(privateKey, net).address.plain() === address) ? true : false;
  }
}