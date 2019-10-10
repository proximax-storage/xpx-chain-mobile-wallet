import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { AppConfig } from '../../app/app.config';
import * as js_joda_1 from 'js-joda';

import {
  NEMLibrary,
  NetworkTypes,
  AccountHttp,
  Password,
  SimpleWallet,
  Address,
  AccountInfoWithMetaData,
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
} from "nem-library";


import { Observable } from "rxjs";
import { Crypto } from "tsjs-xpx-chain-sdk";

@Injectable()
export class NemProvider{
  js_joda_1 = require("js-joda");
  transactionHttp: TransactionHttp;
  
  wallets: SimpleWallet[];
  accountHttp: AccountHttp;
  assetHttp: AssetHttp;
  qrService: QRService;

  constructor(private storage: Storage) {
    let serverConfig: ServerConfig[];
    serverConfig = [{protocol: "http", domain: "18.231.166.212", port: 7890} as ServerConfig]

    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    this.accountHttp = new AccountHttp(serverConfig);
    this.assetHttp = new AssetHttp(serverConfig);
    this.transactionHttp = new TransactionHttp(serverConfig);
    this.qrService = new QRService();

   
  }

  /**
   * Create Wallet from private key
   * @param walletName wallet idenitifier for app
   * @param password wallet's password
   * @param privateKey account privateKey
   * @param selected network
   * * @return Promise with wallet created
   */
  public createPrivateKeyWallet(
    walletName,
    password,
    privateKey
  ): SimpleWallet {
    return SimpleWallet.createWithPrivateKey(
      walletName,
      new Password(password),
      privateKey
    );
  }

  getAccountInfo(address: Address): Observable<AccountInfoWithMetaData> {
    return this.accountHttp.getFromAddress(address);
  }

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
    const currentTimeStamp = (new Date()).getTime() -600000;
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