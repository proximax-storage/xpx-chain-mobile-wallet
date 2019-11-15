import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  Account,
  AccountHttp,
  AccountInfo,
  Address,
  MosaicAmountView,
  MosaicHttp,
  MosaicId,
  NamespaceId,
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
  Crypto,
  TransactionType,
  AggregateTransaction,
  CosignatureTransaction,
} from 'tsjs-xpx-chain-sdk';
import { crypto } from 'js-xpx-chain-library';
import { MosaicNames } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNames';

import { AppConfig } from '../../app/app.config';
import { commonInterface, walletInterface } from '../interfaces/shared.interfaces';
import { Storage } from '@ionic/storage';
import { flatMap, filter, map, toArray, catchError } from 'rxjs/operators';
import { AlertProvider } from '../alert/alert';

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


  constructor(
    public http: HttpClient,
    private storage: Storage,
    private alertProvider: AlertProvider
  ) {

    this.networkType = AppConfig.sirius.networkType;
    this.wsNodeUrl = AppConfig.sirius.wsNodeUrl;

    this.storage.get("node").then(nodeStorage => {
      if (nodeStorage === null || nodeStorage === undefined) {
        this.httpUrl = AppConfig.sirius.httpNodeUrl;
      } else {
        this.httpUrl = nodeStorage;
      }

      this.httpUrl = this.httpUrl
      this.networkHttp = new NetworkHttp(this.httpUrl);
      this.accountHttp = new AccountHttp(this.httpUrl, this.networkHttp);
      this.mosaicHttp = new MosaicHttp(this.httpUrl, this.networkHttp);
      this.namespaceHttp = new NamespaceHttp(this.httpUrl, this.networkHttp);
      this.mosaicService = new MosaicService(this.accountHttp, this.mosaicHttp);
      this.namespaceService = new NamespaceService(this.namespaceHttp);
      this.transactionHttp = new TransactionHttp(this.httpUrl);

    })
  }

  /**
   * 
   * @param nameWallet 
   * @param password 
   * @param privateKey 
   */

  createAccountFromPrivateKey(nameWallet: string, password: Password, privateKey: string): SimpleWallet {
    return SimpleWallet.createFromPrivateKey(nameWallet, password, privateKey, this.networkType);
  }

  /**
   * 
   * @param value 
   */

  createPassword(value) {
    const password = new Password(value)
    return password;
  }

  /**
* createPublicAccount
* @param publicKey
* @param network
* @returns {PublicAccount}
*/
  createPublicAccount(publicKey: string, network: NetworkType): PublicAccount {
    return PublicAccount.createFromPublicKey(publicKey, network);
  }

  /**
   * 
   * @param name 
   * @param password 
   */

  createSimpleWallet(name: string, password: Password) {
    return SimpleWallet.create(name, password, this.networkType);
  }

  /**
   * 
   * @param password 
   * @param encryptedKey 
   * @param iv 
   */
  decryptPrivateKey(password: Password, encryptedKey: string, iv: string): string {
    try {
      if (iv !== '' && password && encryptedKey !== '') {
        const common: commonInterface = {
          password: password.value,
          privateKey: ''
        };

        const account: walletInterface = {
          encrypted: encryptedKey,
          iv: iv,
        };

        if (!crypto.passwordToPrivatekey(common, account, 'pass:bip32')) {
          this.alertProvider.showMessage('Invalid password');
          return null;
        }

        if (common) {
          return common.privateKey;;
        }

        return null;
      } else {
        this.alertProvider.showMessage('You do not have a valid account selected.');
        return null;
      }
    } catch (error) {
      return null;
    }

    


    

    // Crypto.passwordToPrivateKey(common, wallet, 'pass:bip32');
    // return common.privateKey;
  }
  


  /**
 * Decrypt private key
 * @param password password
 * @param encriptedData Object containing private_key encrypted and salt
 * @return Decrypted private key
 */

  public createFromPrivateKey(
    walletName: string,
    password: string,
    privateKey: string
  ): Account {
    const _password = new Password(password);
    const wallet = SimpleWallet.createFromPrivateKey(walletName, _password, privateKey, NetworkType.MIJIN_TEST);
    const account = wallet.open(_password);
    // console.log('Your account address is:', account.address.pretty(), 'and its private key', account.privateKey);
    return account;
  }

  /**
   * 
   * @param address 
   */

  getAccountInfo(address: Address): Observable<AccountInfo> {
    // return null;
    return this.accountHttp.getAccountInfo(address);
  }

  /**
   * 
   * @param publicAccount 
   * @param queryParams 
   */

  getAllTransactionsFromAccount(publicAccount: PublicAccount, queryParams?): Observable<Transaction[]> {
    // return null;
    return this.accountHttp.transactions(publicAccount, new QueryParams(queryParams));
  }

  /**
   * 
   * @param publicAccount 
   * @param queryParams 
   */

  getAllTransactionsUnconfirmed(publicAccount: PublicAccount, queryParams?): Observable<Transaction[]> {
    // return null;
    return this.accountHttp.unconfirmedTransactions(publicAccount, new QueryParams(queryParams));
  }

  /**
   * 
   * @param publicAccount 
   * @param queryParams 
   */

  getAllTransactionsAggregate(publicAccount: PublicAccount, queryParams?): Observable<AggregateTransaction[]> {
    // return null;
    return this.accountHttp.aggregateBondedTransactions(publicAccount, new QueryParams(queryParams))
      .pipe(
        flatMap(txn => txn),
        filter((txn: Transaction) => txn.type === TransactionType.AGGREGATE_BONDED),
        map(txn => <AggregateTransaction>txn),
        toArray()
      );
  }

  /**
   * 
   * @param address 
   */

  getBalance(address: Address): Observable<MosaicAmountView[]> {
    // return null;
    return this.mosaicService.mosaicsAmountViewFromAddress(address);
  }
  /**
   * 
   * @param address 
   */

  mosaicsAmountViewFromAddress(address: Address): Observable<MosaicAmountView[]> {
    return this.mosaicService.mosaicsAmountViewFromAddress(address);
  }

  /**
   * 
   * @param address 
   */

  createFromRawAddress(address: string): Address {
    return Address.createFromRawAddress(address);
  }

  /**
   * 
   * @param privateKey 
   * @param networkType 
   */
  getPublicAccountFromPrivateKey(privateKey: string, networkType: NetworkType): PublicAccount {
    return Account.createFromPrivateKey(privateKey, networkType).publicAccount;
  }

  /**
   * 
   * @param mosaicIsd 
   */
  getMosaics(mosaicIsd: MosaicId[]): Observable<MosaicInfo[]> {
    return this.mosaicHttp.getMosaics(mosaicIsd);
  }

  /**
   * 
   * @param NamespaceId 
   */
  getNamespace(NamespaceId: NamespaceId[]): Observable<NamespaceName[]> {
    return this.namespaceHttp.getNamespacesName(NamespaceId)
  }

  /**
   * 
   * @param NamespaceId 
   */
  getLinkedMosaicId(NamespaceId: NamespaceId): Observable<MosaicId> {
    return this.namespaceHttp.getLinkedMosaicId(NamespaceId)
  }

  /**
   * 
   * @param address 
   */
  getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo> {
    return this.accountHttp.getMultisigAccountInfo(address);
  }

  /**
   * 
   * @param mosaicIds 
   */
  getMosaicNames(mosaicIds: MosaicId[]): Observable<MosaicNames[]> {
    return this.mosaicHttp.getMosaicsNames(mosaicIds);
  }

  /**
   * 
   * @param privateKey 
   * @param net 
   * @param address 
   */
  checkAddress(privateKey: string, net: NetworkType, address: string): boolean {
    return (Account.createFromPrivateKey(privateKey, net).address.plain() === address) ? true : false;
  }

  /**
   * 
   * @param val 
   * @param val2 
   */
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

  /**
   * 
   * @param amount 
   * @param divisibility 
   */
  amountFormatter(amount: Number, divisibility: any) {
    const amountDivisibility = Number(amount) / Math.pow(10, divisibility);
    return amountDivisibility.toLocaleString("en-us", {
      minimumFractionDigits: divisibility
    });
  }

  /**
   * 
   * @param amount 
   * @param divisibility 
   */
  getAbsoluteAmount(amount, divisibility) {
    const amountDivisibility = amount * Math.pow(10, divisibility);

    return amountDivisibility;
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

  /**
   * 
   * @param transaction 
   * @param account 
   */
  cosignAggregateBondedTransaction(transaction: AggregateTransaction, account: Account) {
    const cosignatureTransaction = CosignatureTransaction.create(transaction);
    const cosignedTransaction = account.signCosignatureTransaction(cosignatureTransaction);
    return this.transactionHttp.announceAggregateBondedCosignature(cosignedTransaction);
  };

  /**
   * 
   * @param address 
   */
  isMultisigAccount(address: Address): Observable<boolean> {
    return this.accountHttp.getMultisigAccountInfo(address).pipe(
      map(multisigInfo => multisigInfo.cosignatories.length > 0),
      catchError(() => of(false))
    );
  }
}
