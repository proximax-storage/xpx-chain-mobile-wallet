import { GetBalanceProvider } from './../../../../../providers/get-balance/get-balance';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { App } from '../../../../../providers/app/app';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';

/**
 * Generated class for the SendMosaicSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-mosaic-select',
  templateUrl: 'send-mosaic-select.html'
})
export class SendMosaicSelectPage {
  App = App;

  // selectedMosaic: MosaicTransferable;
  // mosaics: Array<MosaicTransferable>;

  // selectedWallet: SimpleWallet;

  // fakeList: Array<any>;
  // walletAddress: Address;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public getBalanceProvider: GetBalanceProvider,
    public walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
  ) {
    // this.fakeList = [{}, {}];
    // this.walletAddress = this.navParams.get('walletAddress');

  }

  ionViewWillEnter() {
    // if(this.walletAddress) {
    //   this.getBalance(this.walletAddress);
    // } else {
    //   this.walletProvider.getSelectedWallet().then(wallet => {
    //     if (!wallet) this.navCtrl.setRoot('TabsPage');
    //     else {
    //       this.selectedWallet = wallet;
    //       this.getBalance(this.selectedWallet.address);
    //     }
    //   });
    // }


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendMosaicSelectPage');
  }

  onSelect(data) {
    // this.selectedMosaic = data;
  }

  onSubmit() {
    // this.viewCtrl.dismiss(this.selectedMosaic);
  }

  /**
   * Retrieves current account owned mosaics  into this.mosaics
   */
  public getBalance(address: any) {
    // this.getBalanceProvider.mosaics(address).subscribe(mosaics => {
    //   this.mosaics = mosaics;
    //   this.selectedMosaic = this.mosaics[0];

    //   if (this.mosaics.length > 0) {
    //     this.selectedMosaic = this.navParams.get('selectedMosaic') || this.mosaics[0];
    //   }
    // });
  }


}
