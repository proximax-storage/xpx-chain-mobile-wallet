import { GetBalanceProvider } from "./../../../../../providers/get-balance/get-balance";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

import { App } from "../../../../../providers/app/app";
import { WalletProvider } from "../../../../../providers/wallet/wallet";
import { UtilitiesProvider } from "../../../../../providers/utilities/utilities";
import {
  SimpleWallet,
  Address,
  MosaicInfo,
  Password,
  Account
} from "tsjs-xpx-chain-sdk";
import { MosaicsProvider } from "../../../../../providers/mosaics/mosaics";
import { Observable } from "rxjs";
import { AuthProvider } from "../../../../../providers/auth/auth";

/**
 * Generated class for the SendMosaicSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-send-mosaic-select",
  templateUrl: "send-mosaic-select.html"
})
export class SendMosaicSelectPage {
  disivitity: MosaicInfo;
  mosaic: any[] = [];
  selectedMosaicc: any;
  App = App;
  selectedMosaic: any;
  mosaics: any[] = [];
  selectedWallet: SimpleWallet;
  fakeList: Array<any>;
  walletAddress: Address;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public getBalanceProvider: GetBalanceProvider,
    public walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
    public mosaicsProvider: MosaicsProvider,
    private authProvider: AuthProvider
  ) {
    this.fakeList = [{}, {}];
    this.selectedMosaicc = this.navParams.data.selectedMosaic;
  }

  async ionViewWillEnter() {
    // let filter = this.selectedMosaicc.filter(mosaics => mosaics)
    //   await this.mosaicsProvider.getOwnedMosaic( filter ).then(result => {
    //   filter.forEach(mosaicsI => {
    //       let filter2 = result.filter(mosaics =>mosaics.hex === mosaicsI.id.toHex())
    //       this.mosaics.push( filter2[0])
    //   })
    // })

    this.walletProvider.getSelectedWallet().then(selectedWallet => {
      this.getAccount(selectedWallet).subscribe(account => {
        console.log("4. LOG: HomePage -> ionViewWillEnter -> account", account);
        this.mosaicsProvider.getMosaics(account.address).subscribe(mosaics=>{
          this.mosaics = mosaics;
        })
      });
    });
  }

  private getAccount(wallet: SimpleWallet): Observable<Account> {
    return new Observable(observer => {
      // Get user's password and unlock the wallet to get the account
      this.authProvider.getPassword().then(password => {
        // Get user's password
        const myPassword = new Password(password);

        // Convert current wallet to SimpleWallet
        const myWallet = this.walletProvider.convertToSimpleWallet(wallet);

        // Unlock wallet to get an account using user's password
        const _account = myWallet.open(myPassword);
        observer.next(_account);
      });
    });
  }

  loadDefaultMosaics() {
    return this.mosaicsProvider.loadDefaultMosaics();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SendMosaicSelectPage");
  }

  onSelect(data) {
    this.selectedMosaic = data;
  }

  onSubmit() {
    this.viewCtrl.dismiss(this.selectedMosaic);
  }
}
