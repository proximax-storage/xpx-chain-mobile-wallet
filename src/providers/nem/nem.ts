import { Injectable, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfig } from '../../app/app.config';
import { crypto } from 'js-xpx-chain-library';

import {
  NEMLibrary,
  NetworkTypes,
  AccountHttp,
  Password,
  SimpleWallet,
  Address,
  AccountInfoWithMetaData,
  AssetDefinition,
  AccountOwnedAssetService,
  AssetHttp,
  AssetTransferable,
  ServerConfig,
  PublicAccount,
  PlainMessage,
  Account,
  TransferTransaction,
  TimeWindow,
  TransactionHttp,
  NemAnnounceResult,
  AssetId
} from "nem-library";


import { Observable } from "rxjs";

@Injectable()
export class NemProvider{
  
  transactionHttp: TransactionHttp;
  wallets: SimpleWallet[];
  accountHttp: AccountHttp;
  assetHttp: AssetHttp;

  constructor(private storage: Storage) {
    let serverConfig: ServerConfig[];
    serverConfig = [{protocol: "http", domain: "18.231.166.212", port: 7890} as ServerConfig]

    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    this.accountHttp = new AccountHttp(serverConfig);
    this.assetHttp = new AssetHttp(serverConfig);
    this.transactionHttp = new TransactionHttp(serverConfig);
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

  decryptPrivateKey(password: Password, encryptedKey: string, iv: string): string {
    const common = {
      password: password.value,
      privateKey: ''
    };
    const wallet = {
      encrypted: encryptedKey,
      iv: iv,
    };
    crypto.passwordToPrivatekey(common, wallet, 'pass:bip32');
    // console.log('wallet common', common)
    return common.privateKey;
  }
 
  createAccountPrivateKey(privateKey: string) {
    return Account.createWithPrivateKey(privateKey);
  }

  async createTransaction(message: PlainMessage, assetId: AssetId, quantity: number) {
    const resultAssets = await this.assetHttp.getAssetTransferableWithRelativeAmount(assetId, quantity).toPromise();
    // console.log('\n\n\n\nValue resultAssets:\n', resultAssets, '\n\n\n\nEnd value\n\n');
    return TransferTransaction.createWithAssets(
      TimeWindow.createWithDeadline(),
      new Address(AppConfig.swap.address),
      [resultAssets],
      message
    );
  }

  anounceTransaction(transferTransaction: TransferTransaction, cosignerAccount: Account) {
    const signedTransaction = cosignerAccount.signTransaction(transferTransaction);
    // console.log('\n\n\n\nValue signedTransaction:\n', signedTransaction, '\n\n\n\nEnd value\n\n');
    return this.transactionHttp.announceTransaction(signedTransaction).toPromise();
  }
}