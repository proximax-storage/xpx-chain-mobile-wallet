import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { crypto } from 'js-xpx-chain-library';
import { from, Observable } from 'rxjs';

import {
  Account,
  AccountHttp,
  AccountInfo,
  Address,
  MosaicAmountView,
  MosaicHttp,
  MosaicId,
  NamespaceId,
  NamespaceInfo,
  NamespaceName,
  MosaicInfo,
  MosaicService,
  NamespaceHttp,
  NamespaceService,
  NetworkType,
  Password,
  PublicAccount,
  SimpleWallet,
  Transaction,
  TransactionHttp,
  QueryParams,
  NetworkHttp,
  MultisigAccountInfo,
} from 'tsjs-xpx-chain-sdk';
import { MosaicNames } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNames';

import { AppConfig } from '../../app/app.config';
import { commonInterface, walletInterface } from '../interfaces/shared.interfaces';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ProximaxProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProximaxProvider {

  networkType: NetworkType;
  networkHttp: NetworkHttp;
  wsNodeUrl: string;
  httpUrl: string;
  accountHttp: AccountHttp;
  mosaicHttp: MosaicHttp;
  namespaceHttp: NamespaceHttp;
  mosaicService: MosaicService;
  namespaceService: NamespaceService;
  transactionHttp: TransactionHttp;


  constructor(public http: HttpClient, private storage: Storage,) {
  

    this.storage.get("node").then( nodeStorage=>{
      if(nodeStorage === null || nodeStorage=== undefined){
        this.httpUrl = AppConfig.sirius.httpNodeUrl;
      } else {
        this.httpUrl = nodeStorage;
      }
      
      this.networkType = AppConfig.sirius.networkType;
      this.httpUrl = JSON.parse(this.httpUrl)
      this.networkHttp = new NetworkHttp(this.httpUrl);
      this.wsNodeUrl = AppConfig.sirius.wsNodeUrl;
      this.accountHttp = new AccountHttp(this.httpUrl, this.networkHttp);
      this.mosaicHttp = new MosaicHttp(this.httpUrl, this.networkHttp);
      this.namespaceHttp = new NamespaceHttp(this.httpUrl, this.networkHttp);
      this.mosaicService = new MosaicService(this.accountHttp, this.mosaicHttp);
      this.namespaceService = new NamespaceService(this.namespaceHttp);
      this.transactionHttp = new TransactionHttp(this.httpUrl);

    })
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

    crypto.passwordToPrivatekey(common, wallet, 2);
    return common.privateKey;
  }

  
    /**
   * Decrypt private key
   * @param password password
   * @param encriptedData Object containing private_key encrypted and salt
   * @return Decrypted private key
   */

  public decryptPrivateKey1(
    password: string,
    encriptedData: any
  ): string {
    return;
  }

  getAccountInfo(address: Address): Observable<AccountInfo> {
    // return null;
    return this.accountHttp.getAccountInfo(address);
  }

  getAllTransactionsFromAccount(publicAccount: PublicAccount, queryParams?): Observable<Transaction[]> {
    // return null;
    return this.accountHttp.transactions(publicAccount, new QueryParams(queryParams));
  }

  getAllTransactionsUnconfirmed(publicAccount: PublicAccount, queryParams?): Observable<Transaction[]> {
    // return null;
    return this.accountHttp.unconfirmedTransactions(publicAccount, new QueryParams(queryParams));
  }
  getBalance(address: Address): Observable<MosaicAmountView[]> {
    // return null;
    return this.mosaicService.mosaicsAmountViewFromAddress(address);
  }

  createFromRawAddress(address: string): Address {
    return Address.createFromRawAddress(address);
  }

  getPublicAccountFromPrivateKey(privateKey: string, net: NetworkType): PublicAccount {
    return Account.createFromPrivateKey(privateKey, net).publicAccount;
  }

  getMosaics(mosaicIsd: MosaicId[]): Observable<MosaicInfo[]> {
    return this.mosaicHttp.getMosaics(mosaicIsd);
  }

  getNamespace(NamespaceId: NamespaceId[]): Observable<NamespaceName[]> {
    return this.namespaceHttp.getNamespacesName(NamespaceId)
    // return this.mosaicHttp.getMosaics(mosaicIsd);
  }
  
  getLinkedMosaicId(NamespaceId: NamespaceId): Observable<MosaicId> {
    return this.namespaceHttp.getLinkedMosaicId(NamespaceId)
  }

    public getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo> {
    return this.accountHttp.getMultisigAccountInfo(address);
  }

  getMosaicNames(mosaicIds: MosaicId[]): Observable<MosaicNames[]>{
    // return from([]);
    return this.mosaicHttp.getMosaicsNames(mosaicIds);
  }

  checkAddress(privateKey: string, net: NetworkType, address: string): boolean {
    return (Account.createFromPrivateKey(privateKey, net).address.plain() === address) ? true : false;
  }

  verifyNetworkAddressEqualsNetwork(val: string, val2: string) {
    let value = val.toUpperCase()
    let value2 = val2.toUpperCase()
    if ((value.length === 40 || value.length === 46) && (value2.length === 40 || value2.length === 46)) {
      if (value.charAt(0) === 'S' && value2.charAt(0) === 'S') {
        // NetworkType.MIJIN_TEST
        return true;
      } else if (value.charAt(0) === 'M' && value2.charAt(0) === 'M') {
        // NetworkType.MIJIN
        return true;
      } else if (value.charAt(0) === 'V' && value2.charAt(0) === 'V') {
        // NetworkType.TEST_NET
        return true;
      } else if (value.charAt(0) === 'X' && value2.charAt(0) === 'X') {
        // NetworkType.MAIN_NET
        return true;
      } else if (value.charAt(0) === 'W' && value2.charAt(0) === 'W') {
        // NetworkType.PRIVATE_TEST
        return true;
      } else if (value.charAt(0) === 'Z' && value2.charAt(0) === 'Z') {
        // NetworkType.PRIVATE
        return true;
      } else {
        // Address Network unsupported
        return false;
      }
    }
  }

  /**
   * Check if acount belongs it is valid, has 40 characters and belongs to network
   * @param address address to check
   * @return Return prepared transaction
   */
  public isValidAddress(address: string): boolean {
    const addr = Address.createFromRawAddress(address);

    // Reset recipient data
    let success = true;
    // From documentation: Addresses have always a length of 40 characters.
    if (!address || addr.plain().length != 40) success = false;

    //if raw data, clean address and check if it is from network
    if (addr.networkType != this.networkType) success = false;
    return success;
  }

  public getAbsoluteAmount(amount: number): number {
    return amount * Math.pow(10, 6);
  }


  /**
   * Generate Address QR Text
   * @param address address
   * @return Address QR Text
   */
  public generateInvoiceQRText(
    address: Address,
    amount: number,
    message: string
  ): string {

   
    return;
  }

    /**
   * Prepares provision namespace transaction
   * @param recipientAddress recipientAddress
   * @param mosaicsTransferable mosaicsTransferable
   * @param message message
   * @return Promise containing prepared transaction
   */
  public prepareSubNamespaceTransaction(
    subNamespace: string,
    parentNamespace: string
  ): any {
    return;
    // ProvisionNamespaceTransaction.create(
    //   TimeWindow.createWithDeadline(),
    //   subNamespace,
    //   parentNamespace
    // );
  }

    /**
   * Prepares provision namespace transaction
   * @param recipientAddress recipientAddress
   * @param mosaicsTransferable mosaicsTransferable
   * @param message message
   * @return Promise containing prepared transaction
   */
  public prepareNamespaceTransaction(
    namespace: string
  ): any {
    return;
    // ProvisionNamespaceTransaction.create(
    //   TimeWindow.createWithDeadline(),
    //   namespace
    // );
  }

    /**
   * Get the namespaces owned by the NEM address
   * @param address The NEM address
   * @return {Namespace[]}
   */
  public getNamespacesOwned(address: Address): Observable<any[]> {
    return;
  }

    /**
   * Get namespace id
   *
   * @param {any} id
   * @returns
   * @memberof ProximaxProvider
   */
  getNamespaceId(id: string | number[]): NamespaceId {
    return new NamespaceId(id);
  }

    /**
   * Formats levy given mosaic object
   * @param mosaic mosaic object
   * @return Promise with levy fee formated
   */
  public formatLevy(mosaic: any): Promise<any> {
    return new Promise((resolve, reject) => {
    })
  }
}
