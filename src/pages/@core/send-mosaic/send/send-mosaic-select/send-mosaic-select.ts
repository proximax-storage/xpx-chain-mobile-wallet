import { GetBalanceProvider } from './../../../../../providers/get-balance/get-balance';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { App } from '../../../../../providers/app/app';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { SimpleWallet, Address, MosaicInfo } from 'tsjs-xpx-chain-sdk';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';

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
  disivitity: MosaicInfo;
  mosaic: any[]=[];
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
    private proximaxProvider: ProximaxProvider,
  ) {
    this.fakeList = [{}, {}];
    this.selectedMosaicc = this.navParams.data.selectedMosaic;
  }

  ionViewWillEnter() {
    this.selectedMosaicc.forEach(async mosaics => { 
      this.mosaic.push(mosaics.id)

      const mosaicsInfo = await this.proximaxProvider.getMosaics(this.mosaic).toPromise();
      mosaicsInfo.forEach(mosaicsI => {
        if (mosaics.id.toHex() === mosaicsI.mosaicId.id.toHex()) {
        this.disivitity = mosaicsI
        }
      })
      const mosaicInfo= this.mosaicsProvider.setMosaicInfoWithDisivitity(mosaics, this.disivitity);
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

}
