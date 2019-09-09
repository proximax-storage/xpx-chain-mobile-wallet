import { Injectable, OnInit } from "@angular/core";

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
} from "nem-library";

import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

@Injectable()
export class NemProvider{
  
  wallets: SimpleWallet[];
  accountHttp: AccountHttp;
  assetHttp: AssetHttp;
  // mosaicHttp: MosaicHttp;
  // accountOwnedMosaicsService: AccountOwnedMosaicsService;

  constructor(private storage: Storage) {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    this.accountHttp = new AccountHttp();
    this.assetHttp = new AssetHttp();
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
  /**
   * Get the mosaics owned by thee NEM address
   * @param address The NEM address
   * @return {MosaicDefinition[]}
   */
  // public getMosaicsOwned(address: Address): Observable<MosaicDefinition[]> {
  //   return this.accountHttp.getMosaicCreatedByAddress(address);
  // }

}