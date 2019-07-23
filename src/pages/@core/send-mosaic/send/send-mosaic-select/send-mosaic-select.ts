import { GetBalanceProvider } from './../../../../../providers/get-balance/get-balance';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { App } from '../../../../../providers/app/app';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { SimpleWallet, Address } from 'tsjs-xpx-chain-sdk';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';

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
  selectedMosaicc: any;
  App = App;

  selectedMosaic: any;
  // mosaics: Array<any>;
  mosaics: any=[];

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
  ) {
    this.fakeList = [{}, {}];
    // this.walletAddress =  this.navParams.data.walletAddress;
    this.selectedMosaicc = this.navParams.data.selectedMosaic;

    // console.log('wallet....', this.walletAddress)
    // console.log("Nav params walletAddress", this.navParams.data.walletAddress);
    // console.log("Nav params selectedMosaic", this.navParams.data.selectedMosaic);
    // console.log('this.selectedMosaicc....', this.selectedMosaicc)
  }

  ionViewWillEnter() {
    this.selectedMosaicc.forEach(mosaics => { 
      const mosaicInfo= this.mosaicsProvider.setMosaicInfo(mosaics);
      this.mosaics.push(mosaicInfo)
    })
  }

  loadDefaultMosaics() {
    return this.mosaicsProvider.getMosaics();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendMosaicSelectPage');
  }

  onSelect(data) {
    this.selectedMosaic = data;
  }

  onSubmit() {
    this.viewCtrl.dismiss(this.selectedMosaic);
  }

  /**
   * Retrieves current account owned mosaics  into this.mosaics
   */
  // public getBalance(address: any) {
  //   console.log('banalce address',  address)
    // this.getBalanceProvider.mosaics(address).subscribe(mosaics => {
    //   this.mosaics = mosaics;
    //   this.selectedMosaic = this.mosaics[0];

    //   if (this.mosaics.length > 0) {
    //     this.selectedMosaic = this.navParams.get('selectedMosaic') || this.mosaics[0];
    //   }
    // });
  // }


}
