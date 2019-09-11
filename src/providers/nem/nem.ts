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
  AssetId,
  Account,
  TransferTransaction,
  TimeWindow,
  TransactionHttp,
  NemAnnounceResult
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
    return common.privateKey;
  }
 
    /**
   * Prepares mosaic transaction
   * @param recipientAddress recipientAddress
   * @param mosaicsTransferable mosaicsTransferable
   * @param message message
   * @return Promise containing prepared transaction
   */

   
  public prepareMosaicTransaction(
    recipientAddress: Address,
    mosaicsTransferable: AssetTransferable[],
    message: PlainMessage
  ): TransferTransaction {
    console.log('realizandoswap process', message)
    return TransferTransaction.createWithAssets(
      TimeWindow.createWithDeadline(),
      recipientAddress,
      mosaicsTransferable,
      message
    );
  }

  /**
   * Send transaction into the blockchain
   * @param transferTransaction transferTransaction
   * @param wallet wallet
   * @param password password
   * @return Promise containing sent transaction
   */
  public confirmTransaction(
    transaction: any,
    privateKey: string
  ): Observable<NemAnnounceResult> {
    const account = Account.createWithPrivateKey(privateKey);
    // let account = wallet.open(new Password(password));
    let signedTransaction = account.signTransaction(transaction);
    console.log('signedTransaction', signedTransaction)
    return this.transactionHttp.announceTransaction(signedTransaction);
  }


  
}