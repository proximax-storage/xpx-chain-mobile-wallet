import { Injectable } from "@angular/core";
import { AppConfig } from '../../app/app.config';
import * as js_joda_1 from 'js-joda';

import {
  NEMLibrary,
  NetworkTypes,
  AccountHttp,
  Password,
  SimpleWallet,
  Address,
  AccountOwnedAssetService,
  AssetHttp,
  AssetTransferable,
  ServerConfig,
  PlainMessage,
  Account,
  TransferTransaction,
  TimeWindow,
  TransactionHttp,
  AssetId,
  QRWalletText,
  QRService,
  PublicAccount,
  Transaction,
} from "nem-library";

import { Observable, Subject } from "rxjs";
import { PublicAccount as PublicAccountTsjs, Crypto } from "tsjs-xpx-chain-sdk";
import { first, timeout } from "rxjs/operators";
import { UtilitiesProvider } from "../utilities/utilities";
import { AlertProvider } from "../alert/alert";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class NemProvider {
  js_joda_1 = require("js-joda");
  transactionHttp: TransactionHttp;

  wallets: SimpleWallet[];
  accountHttp: AccountHttp;
  assetHttp: AssetHttp;
  qrService: QRService;
  nis1 = {
    url: 'https://bctestnetswap.xpxsirius.io:7890',
    urlExplorer: 'http://testnet-explorer.nemtool.com/#/s_tx?hash=',
    networkType: NetworkTypes.TEST_NET,
    burnAddress: 'TBF4LAZUEJMBIOC6J24D6ZGGXE5W775TX555CTTN',
    nodes: [{ protocol: "https", domain: "bctestnetswap.xpxsirius.io", port: 7890 } as ServerConfig]
  };
  nis1AccountsFoundSubject: Subject<AccountsInfoNis1Interface> = new Subject<AccountsInfoNis1Interface>(); // RJ
  nis1AccountsFound$: Observable<AccountsInfoNis1Interface> = this.nis1AccountsFoundSubject.asObservable(); // RJ

  constructor(
    private http: HttpClient,
    private alertProvider: AlertProvider,
    private utilitiesProvider: UtilitiesProvider
  ) {
    let serverConfig: ServerConfig[];
    serverConfig = [{ protocol: "https", domain: "bctestnetswap.xpxsirius.io", port: 7890 } as ServerConfig]
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    this.accountHttp = new AccountHttp(serverConfig);
    this.assetHttp = new AssetHttp(serverConfig);
    this.transactionHttp = new TransactionHttp(serverConfig);
    this.qrService = new QRService();
  }


  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @param {string} name
   * @memberof NemProvider
   */
  async getAccountInfoNis1(publicAccount: PublicAccount, name: string) {
    try {
      let cosignatoryOf: CosignatoryOf[] = [];
      let accountsMultisigInfo = [];
      const addressOwnedSwap = this.createAddressToString(publicAccount.address.pretty());
      const accountInfoOwnedSwap = await this.getAccountInfo(addressOwnedSwap).pipe(first()).pipe((timeout(15000))).toPromise();
      console.log('accountInfoOwnedSwap', accountInfoOwnedSwap);
      if (accountInfoOwnedSwap['meta']['cosignatories'].length === 0) {
        let nis1AccountsInfo: AccountsInfoNis1Interface;
        // INFO ACCOUNTS MULTISIG
        /*if (accountInfoOwnedSwap['meta']['cosignatoryOf'].length > 0) {
          cosignatoryOf = accountInfoOwnedSwap['meta']['cosignatoryOf'];
          for (let multisig of cosignatoryOf) {
            try {
              const addressMultisig = this.createAddressToString(multisig.address);
              const ownedMosaic = await this.getOwnedMosaics(addressMultisig).pipe(first()).pipe((timeout(20000))).toPromise();
              const xpxFound = ownedMosaic.find(el => el.assetId.namespaceId === 'prx' && el.assetId.name === 'xpx');
              if (xpxFound) {
                multisig.balance = await this.validateBalanceAccounts(xpxFound, addressMultisig);
                multisig.mosaic = xpxFound;
                accountsMultisigInfo.push(multisig);
              }
            } catch (error) {
              cosignatoryOf = [];
              accountsMultisigInfo = [];
            }
          }
        }*/

        try {
          // SEARCH INFO OWNED SWAP
          const ownedMosaic = await this.getOwnedMosaics(addressOwnedSwap).pipe(first()).pipe((timeout(20000))).toPromise();
          console.log('ownedMosaic --->', ownedMosaic);
          const xpxFound = ownedMosaic.find(el => el.assetId.namespaceId === 'prx' && el.assetId.name === 'xpx');
          console.log('xpxFound ---->', xpxFound);
          if (xpxFound) {
            const balance = await this.validateBalanceAccounts(xpxFound, addressOwnedSwap);
            console.log('balance ---->', balance);
            nis1AccountsInfo = this.buildAccountInfoNIS1(publicAccount, accountsMultisigInfo, balance, cosignatoryOf, false, name, xpxFound);
            this.setNis1AccountsFound$(nis1AccountsInfo);
            return nis1AccountsInfo;
          } else if (cosignatoryOf.length > 0) {
            console.log('cosignatoryOf zero');
            nis1AccountsInfo = this.buildAccountInfoNIS1(publicAccount, accountsMultisigInfo, null, cosignatoryOf, false, name, null);
            this.setNis1AccountsFound$(nis1AccountsInfo);
            return nis1AccountsInfo;
          } else {
            console.log('The account has no balance to swap.');
            // this.alertProvider.showMessage('The account has no balance to swap.');
            this.setNis1AccountsFound$(null);
          }
        } catch (error) {
          console.log(error);
          // this.alertProvider.showMessage('It was not possible to connect to the server, try later');
          this.setNis1AccountsFound$(null);
        }
      } else {
        // this.alertProvider.showMessage('Swap does not support this account type');
        this.setNis1AccountsFound$(null);
      }

      return null;
    } catch (error) {
      console.log(error);
      this.alertProvider.showMessage('It was not possible to connect to the server, try later.');
      this.setNis1AccountsFound$(null);
      return null;
    }
  }

  async validateBalanceAccounts(xpxFound: AssetTransferable, addressSigner: Address) {
    console.log('xpxFound --> ', xpxFound);
    const quantityFillZeros = this.utilitiesProvider.addZeros(6, xpxFound.quantity);
    let realQuantity: any = this.amountFormatter(quantityFillZeros, xpxFound, 6);
    const unconfirmedTxn = await this.getUnconfirmedTransaction(addressSigner);
    console.log('Address  ---> ', addressSigner);
    if (unconfirmedTxn.length > 0) {
      //let quantity = realQuantity;
      console.log('realQuantity', realQuantity);
      for (const item of unconfirmedTxn) {
        console.log('transaction unconfirmed -->', item);
        console.log(item['otherTransaction']['_assets']);
        console.log(this.utilitiesProvider.hexToAscii(item['otherTransaction'].message.payload), '\n\n');
        let existMosaic = null;
        if (item.type === 257 && item['signer']['address']['value'] === addressSigner['value'] && item['_assets'].length > 0) {
          existMosaic = item['_assets'].find((mosaic) => mosaic.assetId.namespaceId === 'prx' && mosaic.assetId.name === 'xpx');
        } else if (item.type === 4100 && item['otherTransaction']['type'] === 257 && item['otherTransaction']['signer']['address']['value'] === addressSigner['value']) {
          existMosaic = item['otherTransaction']['_assets'].find((mosaic) => mosaic.assetId.namespaceId === 'prx' && mosaic.assetId.name === 'xpx');
        }

        console.log('existMosaic -->', existMosaic);
        if (existMosaic) {
          const unconfirmedFormatter = parseFloat(this.amountFormatter(existMosaic.quantity, xpxFound, 6));
          console.log('\n unconfirmedFormatter --->', unconfirmedFormatter);
          const quantityWhitoutFormat = realQuantity.split(',').join('');
          console.log('\nquantityWhitoutFormat --->', quantityWhitoutFormat);
          const residue = this.utilitiesProvider.subtractAmount(parseFloat(quantityWhitoutFormat), unconfirmedFormatter);
          console.log('\nresidue --->', residue, '\n');
          const quantityFormat = this.amountFormatter(parseInt((residue).toString().split('.').join('')), xpxFound, 6);
          console.log('quantityFormat --->', quantityFormat);
          realQuantity = quantityFormat;
        }
      }

      return realQuantity;
    } else {
      return realQuantity;
    }
  }


  /**
   *
   *
   * @param {number} amountParam
   * @param {AssetTransferable} mosaic
   * @param {number} [manualDivisibility=0]
   * @returns
   * @memberof NemProvider
   */
  amountFormatter(amountParam: number, mosaic: AssetTransferable, manualDivisibility: number = 0) {
    const divisibility = (manualDivisibility === 0) ? manualDivisibility : mosaic.properties.divisibility;
    const amountDivisibility = Number(amountParam / Math.pow(10, divisibility));
    const amountFormatter = amountDivisibility.toLocaleString("en-us", { minimumFractionDigits: divisibility });
    return amountFormatter;
  }


  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @param {any[]} accountsMultisigInfo
   * @param {*} balance
   * @param {CosignatoryOf[]} cosignersAccounts
   * @param {boolean} isMultiSign
   * @param {string} name
   * @param {AssetTransferable} xpxFound
   * @returns
   * @memberof NemProvider
   */
  buildAccountInfoNIS1(
    publicAccount: PublicAccount,
    accountsMultisigInfo: any[],
    balance: any,
    cosignersAccounts: CosignatoryOf[],
    isMultiSign: boolean,
    name: string,
    xpxFound: AssetTransferable
  ) {
    return {
      nameAccount: name,
      address: publicAccount.address,
      publicKey: publicAccount.publicKey,
      cosignerOf: (cosignersAccounts.length > 0) ? true : false,
      cosignerAccounts: cosignersAccounts,
      multisigAccountsInfo: accountsMultisigInfo,
      mosaic: xpxFound,
      isMultiSig: isMultiSign,
      balance: balance
    };
  }


  /**
   * RJ
   *
   * @param {string} walletName
   * @param {string} password
   * @param {string} privateKey
   * @returns {SimpleWallet}
   * @memberof NemProvider
   */
  createPrivateKeyWallet(walletName: string, password: string, privateKey: string): SimpleWallet {
    return SimpleWallet.createWithPrivateKey(
      walletName,
      new Password(password),
      privateKey
    );
  }


  /**
  *
  *
  * @param {string} address
  * @returns {Address}
  * @memberof NemProviderService
  */
  createAddressToString(address: string): Address {
    return new Address(address);
  }

  /**
   *
   *
   * @param {string} publicKey
   * @returns {PublicAccount}
   * @memberof NemProvider
   */
  createPublicAccount(publicKey: string): PublicAccount {
    return PublicAccount.createWithPublicKey(publicKey);
  }

  /**
   *
   *
   * @param {Address} address
   * @returns
   * @memberof NemProvider
   */
  getAccountInfo(address: Address) {
    return this.http.get(`${this.nis1.url}/account/get?address=${address.plain()}`);
  }

  /**
   *
   *
   * @param {Address} address
   * @returns {Promise<Transaction[]>}
   * @memberof NemProvider
   */
  getUnconfirmedTransaction(address: Address): Promise<Transaction[]> {
    return this.accountHttp.unconfirmedTransactions(address).toPromise();
  }

  /**
   *
   *
   * @param {AccountsInfoNis1Interface} accounts
   * @memberof NemProvider
   */
  setNis1AccountsFound$(accounts: AccountsInfoNis1Interface) {
    this.nis1AccountsFoundSubject.next(accounts);
  }

  // --------------------------------------------------------------------------------


  // getAccountInfo(address: Address): Observable<AccountInfoWithMetaData> {
  //   return this.accountHttp.getFromAddress(address);
  // }

  getOwnedMosaics(address: Address): Observable<AssetTransferable[]> {
    let accountOwnedMosaics = new AccountOwnedAssetService(this.accountHttp, this.assetHttp);
    return accountOwnedMosaics.fromAddress(address);
  }

  public passwordToPrivateKey(password: string, wallet: SimpleWallet): string {
    return wallet.unlockPrivateKey(new Password(password));
  }

  public decryptPrivateKeyViaQrCode(
    password: string,
    encriptedData: QRWalletText
  ): string {
    return this.qrService.decryptWalletQRText(
      new Password(password),
      encriptedData
    );
  }

  decryptPrivateKey(password: Password, encryptedKey: string, iv: string): string {
    const common = {
      password: password.value,
      privateKey: ''
    };
    const wallet = {
      encrypted: encryptedKey,
      iv: iv,
    };
    Crypto.passwordToPrivateKey(common, wallet, 'pass:bip32');
    // console.log('wallet common', common)
    return common.privateKey;
  }

  createAccountPrivateKey(privateKey: string) {
    return Account.createWithPrivateKey(privateKey);
  }

  async createTransaction(message: string, assetId: AssetId, quantity: number) {
    const assetTransferable = await this.assetHttp.getAssetTransferableWithRelativeAmount(assetId, quantity).toPromise();
    // console.log('\n\n\n\nValue resultAssets:\n', resultAssets, '\n\n\n\nEnd value\n\n');
    return TransferTransaction.createWithAssets(
      // TimeWindow.createWithDeadline(),
      this.createWithDeadline(),
      new Address(AppConfig.swap.burnAccountAddress),
      [assetTransferable],
      PlainMessage.create(message)
    );
  }

  createWithDeadline(deadline = 2, chronoUnit = js_joda_1.ChronoUnit.HOURS) {
    const currentTimeStamp = (new Date()).getTime() - 600000;
    const timeStampDateTime = js_joda_1.LocalDateTime.ofInstant(js_joda_1.Instant.ofEpochMilli(currentTimeStamp), js_joda_1.ZoneId.SYSTEM);
    const deadlineDateTime = timeStampDateTime.plus(deadline, chronoUnit);
    if (deadline <= 0) {
      throw new Error("deadline should be greater than 0");
    }
    else if (timeStampDateTime.plus(24, js_joda_1.ChronoUnit.HOURS).compareTo(deadlineDateTime) != 1) {
      throw new Error("deadline should be less than 24 hours");
    }
    return new TimeWindow(timeStampDateTime, deadlineDateTime);
  }

  anounceTransaction(transferTransaction: TransferTransaction, cosignerAccount: Account) {
    const signedTransaction = cosignerAccount.signTransaction(transferTransaction);
    return this.transactionHttp.announceTransaction(signedTransaction).toPromise();
  }
}





export interface AccountsInfoNis1Interface {
  nameAccount: string;
  accountCosignatory?: PublicAccountTsjs;
  address: Address;
  publicKey: string;
  cosignerOf: boolean;
  cosignerAccounts: CosignatoryOf[];
  multisigAccountsInfo: any[];
  mosaic: AssetTransferable;
  isMultiSig: boolean;
  balance: any;
}

export interface CosignatoryOf {
  address: string;
  mosaic: AssetTransferable;
  balance: number;
  harvestedBlocks: number;
  importance: number;
  label: any;
  multisigInfo: {
    cosignatoriesCount: number;
    minCosignatories: number;
  },
  publicKey: string;
  vestedBalance: number;
}

export interface TransactionsNis1Interface {
  siriusAddres: string;
  nis1Timestamp: string;
  nis1PublicKey: string;
  nis1TransactionHash: string;
}

export interface WalletTransactionsNis1Interface {
  name: string;
  transactions: TransactionsNis1Interface[],
}
