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
  TransactionType,
  AggregateTransaction,
  CosignatureTransaction,
  BlockInfo,
  BlockHttp,
  UInt64,
  Deadline,
  Mosaic,
  Convert,
  SignedTransaction,
} from 'tsjs-xpx-chain-sdk';
import { crypto } from 'js-xpx-chain-library';
import { MosaicNames } from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNames';

import { AppConfig } from '../../app/app.config';
import { commonInterface, walletInterface } from '../interfaces/shared.interfaces';
import { Storage } from '@ionic/storage';
import { flatMap, filter, map, toArray, catchError } from 'rxjs/operators';
import { AlertProvider } from '../alert/alert';
import { TranslateService } from '@ngx-translate/core';

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
  blockHttp: BlockHttp;


  constructor(
    public http: HttpClient,
    private storage: Storage,
    private alertProvider: AlertProvider,
    private translateService: TranslateService,
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
      this.blockHttp = new BlockHttp(this.httpUrl);

    })
  }

  announceTx(signedTransaction: SignedTransaction) {
    return this.transactionHttp.announce(signedTransaction)
  }

  /**
   *
   *
   * @param {string} nameWallet
   * @param {Password} password
   * @param {string} privateKey
   * @returns {SimpleWallet}
   * @memberof ProximaxProvider
   */
  createAccountFromPrivateKey(nameWallet: string, password: Password, privateKey: string): SimpleWallet {
    return SimpleWallet.createFromPrivateKey(nameWallet, password, privateKey, this.networkType);
  }

  /**
   *
   *
   * @param {*} value
   * @returns
   * @memberof ProximaxProvider
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
   *
   * @param {string} name
   * @param {Password} password
   * @returns
   * @memberof ProximaxProvider
   */
  createSimpleWallet(name: string, password: Password) {
    return SimpleWallet.create(name, password, this.networkType);
  }

  /**
   *
   *
   * @param {Password} password
   * @param {string} encryptedKey
   * @param {string} iv
   * @returns {string}
   * @memberof ProximaxProvider
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
          this.alertProvider.showMessage(this.translateService.instant("APP.INVALID.PASSWORD"));
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
  }

  /**
   *
   *
   * @param {Address} address
   * @returns {Observable<AccountInfo>}
   * @memberof ProximaxProvider
   */
  getAccountInfo(address: Address): Observable<AccountInfo> {
    // return null;
    return this.accountHttp.getAccountInfo(address);
  }

  /**
   * Gets a BlockInfo for a given block height
   *  @param height - Block height
   * @returns {Observable<BlockInfo>}
   * @memberof ProximaxProvider
   */
  getBlockInfo(height): Observable<BlockInfo> {
    return this.blockHttp.getBlockByHeight(height);
  }

  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @param {*} [id=null]
   * @param {number} [queryParams=100]
   * @returns {Observable<Transaction[]>}
   * @memberof ProximaxProvider
   */
  getTransactionsFromAccountId(publicAccount: PublicAccount, id: any = null, queryParams: number = 10): Observable<Transaction[]> {
    const query = (id) ? new QueryParams(queryParams, id) : new QueryParams(queryParams);
    return this.accountHttp.transactions(publicAccount, query);
  }

  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @param {*} [id=null]
   * @param {number} [queryParams=100]
   * @returns {Observable<Transaction[]>}
   * @memberof ProximaxProvider
   */
  getAllTransactionsFromAccount(publicAccount: PublicAccount, id = null, queryParams = 100): Observable<Transaction[]> {
    const query = (id) ? new QueryParams(queryParams, id) : new QueryParams(queryParams);
    return this.accountHttp.transactions(publicAccount, query);
  }

  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @param {*} [queryParams]
   * @returns {Observable<Transaction[]>}
   * @memberof ProximaxProvider
   */
  getAllTransactionsUnconfirmed(publicAccount: PublicAccount, queryParams?): Observable<Transaction[]> {
    // return null;
    return this.accountHttp.unconfirmedTransactions(publicAccount, new QueryParams(queryParams));
  }

  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @param {*} [queryParams]
   * @returns {Observable<AggregateTransaction[]>}
   * @memberof ProximaxProvider
   */
  getAllTransactionsAggregate(publicAccount: PublicAccount, queryParams?): Observable<AggregateTransaction[]> {
    // return null;
    return this.accountHttp.aggregateBondedTransactions(publicAccount, new QueryParams(queryParams))
      .pipe(
        flatMap(txn => txn),
        filter((txn: Transaction) => txn.type === TransactionType.AGGREGATE_BONDED || txn.type === TransactionType.AGGREGATE_COMPLETE),
        map(txn => <AggregateTransaction>txn),
        toArray()
      );
  }


  /**
   *
   *
   * @param {Address} address
   * @returns {Observable<MultisigAccountInfo>}
   * @memberof ProximaxProvider
   */
  getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo> {
    return this.accountHttp.getMultisigAccountInfo(address);
  }

  /**
   *
   *
   * @param {Address} address
   * @returns {Observable<MosaicAmountView[]>}
   * @memberof ProximaxProvider
   */
  getBalance(address: Address): Observable<MosaicAmountView[]> {
    // return null;
    return this.mosaicService.mosaicsAmountViewFromAddress(address);
  }

  /**
   *
   *
   * @param {Address} address
   * @returns {Observable<MosaicAmountView[]>}
   * @memberof ProximaxProvider
   */
  mosaicsAmountViewFromAddress(address: Address): Observable<MosaicAmountView[]> {
    return this.mosaicService.mosaicsAmountViewFromAddress(address);
  }

  /**
   *
   *
   * @param {Mosaic[]} mosaics
   * @returns {Observable<MosaicAmountView[]>}
   * @memberof ProximaxProvider
   */
  mosaicsAmountViewFromMosaics(mosaics: Mosaic[]): Observable<MosaicAmountView[]> {
    return this.mosaicService.mosaicsAmountView(mosaics);
  }

  /**
   *
   *
   * @param {string} address
   * @returns {Address}
   * @memberof ProximaxProvider
   */
  createFromRawAddress(address: string): Address {
    return Address.createFromRawAddress(address);
  }

  /**
   *
   *
   * @param {string} privateKey
   * @param {NetworkType} networkType
   * @returns {PublicAccount}
   * @memberof ProximaxProvider
   */
  getPublicAccountFromPrivateKey(privateKey: string, networkType: NetworkType): PublicAccount {
    return Account.createFromPrivateKey(privateKey, networkType).publicAccount;
  }

  /**
  *
  *
  * @param {MosaicId[]} mosaicIsd
  * @returns {Observable<MosaicInfo[]>}
  * @memberof ProximaxProvider
  */
  getMosaics(mosaicIsd: MosaicId[]): Observable<MosaicInfo[]> {
    return this.mosaicHttp.getMosaics(mosaicIsd);
  }

  /**
   *
   *
   * @param {NamespaceId[]} NamespaceId
   * @returns {Observable<NamespaceName[]>}
   * @memberof ProximaxProvider
   */
  getNamespace(NamespaceId: NamespaceId[]): Observable<NamespaceName[]> {
    return this.namespaceHttp.getNamespacesName(NamespaceId)
  }

  /**
   *
   *
   * @param {NamespaceId} NamespaceId
   * @returns {Observable<MosaicId>}
   * @memberof ProximaxProvider
   */
  getLinkedMosaicId(NamespaceId: NamespaceId): Observable<MosaicId> {
    return this.namespaceHttp.getLinkedMosaicId(NamespaceId)
  }

  /**
   *
   *
   * @param {MosaicId[]} mosaicIds
   * @returns {Observable<MosaicNames[]>}
   * @memberof ProximaxProvider
   */
  getMosaicNames(mosaicIds: MosaicId[]): Observable<MosaicNames[]> {
    return this.mosaicHttp.getMosaicsNames(mosaicIds);
  }

  /**
   *
   *
   * @param {string} privateKey
   * @param {NetworkType} net
   * @param {string} address
   * @returns {boolean}
   * @memberof ProximaxProvider
   */
  checkAddress(privateKey: string, net: NetworkType, address: string): boolean {
    return (Account.createFromPrivateKey(privateKey, net).address.plain() === address) ? true : false;
  }

  isHexString(data: string): boolean {
    return Convert.isHexString(data);
  }

  unSerialize(hex) {
    const dataUin8 = Convert.hexToUint8(hex)
    const amountUin8 = new Uint8Array(8)
    let amountUin32 = new Uint32Array(2)
    const pkUin8 = new Uint8Array(32)
    const mosaicId = new Uint8Array(8)
    const typeUin8 = new Uint8Array(1)
    const codeUin8 = new Uint8Array(20)
    amountUin8.set(new Uint8Array(dataUin8.subarray(0, 8)), 0)
    pkUin8.set(new Uint8Array(dataUin8.subarray(8, 40)), 0)
    mosaicId.set(new Uint8Array(dataUin8.subarray(40, 48)), 0)
    typeUin8.set(new Uint8Array(dataUin8.subarray(48, 49)), 0)
    codeUin8.set(new Uint8Array(dataUin8.subarray(49, dataUin8.byteLength)), 0)
    amountUin32 = Convert.uint8ToUint32(amountUin8)
    const amount = UInt64.fromHex(Convert.uint8ToHex(amountUin8))
    const privatekey = Convert.uint8ToHex(pkUin8)
    const mosaic = Convert.uint8ToHex(mosaicId)
    const type = this.hexToString(Convert.uint8ToHex(typeUin8))
    const code = this.hexToString(Convert.uint8ToHex(codeUin8))

    const dataScan = [{
      "amountGift": amount.compact(),
      "pkGift": privatekey,
      "mosaicGift": mosaic,
      "typeGif": type,
      "codeGift": code
    }]

    console.log('dataScan', dataScan);
    
    return dataScan;
  }

  hexToString(hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  }
  /**
   *
   *
   * @param {string} address
   * @returns
   * @memberof ProximaxProvider
   */
  validateAddress(address: string) {
    if (address !== '') {
      const addressTrimAndUpperCase = address.trim().toUpperCase().replace(/-/g, '');
      if (addressTrimAndUpperCase.length === 40) {
        if (address.charAt(0) === 'S') {
          return true;
        }
        else if (address.charAt(0) === 'M') {
          return true;
        }
        else if (address.charAt(0) === 'V') {
          return true;
        }
        else if (address.charAt(0) === 'X') {
          return true;
        }
        else if (address.charAt(0) === 'W') {
          return true;
        }
        else if (address.charAt(0) === 'Z') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   *
   *
   * @param {string} val
   * @param {string} val2
   * @returns
   * @memberof ProximaxProvider
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
   *
   *
   * @param {string} address
   * @returns {boolean}
   * @memberof ProximaxProvider
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
   *
   * @param {Number} amount
   * @param {*} divisibility
   * @returns
   * @memberof ProximaxProvider
   */
  amountFormatter(amount: Number, divisibility: any) {
    const amountDivisibility = Number(amount) / Math.pow(10, divisibility);
    return amountDivisibility.toLocaleString("en-us", {
      minimumFractionDigits: divisibility
    });
  }

  /**
   *
   *
   * @param {*} amount
   * @param {*} divisibility
   * @returns
   * @memberof ProximaxProvider
   */
  getAbsoluteAmount(amount, divisibility) {
    const amountDivisibility = amount * Math.pow(10, divisibility);

    return amountDivisibility;
  }

  /**
   *
   *
   * @param {Number} amount
   * @returns
   * @memberof ProximaxProvider
   */
  amountFormatterSimple(amount: Number) {
    const amountDivisibility = Number(amount) / Math.pow(10, 6);
    return amountDivisibility.toLocaleString("en-us", {
      minimumFractionDigits: 6
    });
  }

  /**
   *
   *
   * @param {Deadline} deadline
   * @returns
   * @memberof ProximaxProvider
   */
  dateFormat(deadline: Deadline) {
    return new Date(
      deadline.value.toString() + Deadline.timestampNemesisBlock * 1000
    ).toLocaleString();
    // toUTCString();
  }

  /**
   *
   *
   * @param {UInt64} date
   * @returns
   * @memberof ProximaxProvider
   */
  dateFormatUTC(date: UInt64) {
    return new Date(date.compact() + 1459468800 * 1000).toLocaleString();
  }

  generateInvoiceQRText(
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
  getMosaicId(id: string | number[]): MosaicId {
    return new MosaicId(id);
  }
  /**
 * Get the namespaces owned by the NEM address
 * @param address The NEM address
 * @return {Namespace[]}
 */
  public getNamespacesOwned(address: Address): Observable<any[]> {
    return;
  }

  getMosaicsName(mosaicsId: MosaicId[]): Observable<MosaicNames[]> {
    return this.mosaicHttp.getMosaicsNames(mosaicsId); // Update-sdk-dragon
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
