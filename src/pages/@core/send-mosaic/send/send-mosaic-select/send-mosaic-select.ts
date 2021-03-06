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
  Address,
  MosaicInfo,
  MosaicId,
} from "tsjs-xpx-chain-sdk";
import { MosaicsProvider } from "../../../../../providers/mosaics/mosaics";
import { ProximaxProvider } from "../../../../../providers/proximax/proximax";

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
  selectedWallet: any;
  fakeList: Array<any>;
  walletAddress: Address;
  address: Address;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public getBalanceProvider: GetBalanceProvider,
    public walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
    public mosaicsProvider: MosaicsProvider,
    private proximaxProvider: ProximaxProvider,
  ) {
    this.fakeList = [{}, {}];
    this.selectedMosaicc = this.navParams.data.selectedMosaic;
  }

  getAbsoluteAmount(amount, divisibility) {
    return this.proximaxProvider.amountFormatter(amount, divisibility)
  }

  async ionViewWillEnter() {
    this.walletProvider.getAccountSelected().then(selectedWallet => {
      this.selectedWallet = selectedWallet
      this.address = this.proximaxProvider.createFromRawAddress(this.selectedWallet.account.address.address)
      this.mosaicsProvider.getMosaics(this.address).subscribe(async mosaics => {

        if (mosaics != null) {

          let names = [];
          names = await this.getNameMosacis(mosaics.map(x => new MosaicId(x.hex)));

          for (const element of mosaics) {
            let value = names.find(x => x.mosaicId.id.toHex() === element.hex)

            if (value.names && value.names.length > 0) {
              element.name = value.names[0].name;
            }
          }

          this.mosaics = mosaics;
        }

      }, error => {
        // console.log('errrrrrrrr', error);
      });
    })
  }

  async getNameMosacis(idMosaics: MosaicId[]) {
    return await this.proximaxProvider.getMosaicsName(idMosaics).toPromise();
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
