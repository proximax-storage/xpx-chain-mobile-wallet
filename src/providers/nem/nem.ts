import { Injectable, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
} from "nem-library";

import { Observable } from "rxjs";

@Injectable()
export class NemProvider{
  
  wallets: SimpleWallet[];
  accountHttp: AccountHttp;
  assetHttp: AssetHttp;

  constructor(private storage: Storage) {
    let serverConfig: ServerConfig[];
    serverConfig = [{protocol: "http", domain: "18.231.166.212", port: 7890} as ServerConfig]

    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    this.accountHttp = new AccountHttp(serverConfig);
    this.assetHttp = new AssetHttp(serverConfig);
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

}