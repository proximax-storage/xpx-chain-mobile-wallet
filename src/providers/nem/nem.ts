import { Injectable, OnInit } from "@angular/core";

import {
  NEMLibrary,
  NetworkTypes,
  AccountHttp,
  Password,
  SimpleWallet,


} from "nem-library";

import { Observable } from "nem-library/node_modules/rxjs";
import { Storage } from "@ionic/storage";

@Injectable()
export class NemProvider{
  wallets: SimpleWallet[];
  accountHttp: AccountHttp;
  // mosaicHttp: MosaicHttp;
  // accountOwnedMosaicsService: AccountOwnedMosaicsService;



  constructor(private storage: Storage) {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    this.accountHttp = new AccountHttp();
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

  /**
   * Get the mosaics owned by thee NEM address
   * @param address The NEM address
   * @return {MosaicDefinition[]}
   */
  // public getMosaicsOwned(address: Address): Observable<MosaicDefinition[]> {
  //   return this.accountHttp.getMosaicCreatedByAddress(address);
  // }


}