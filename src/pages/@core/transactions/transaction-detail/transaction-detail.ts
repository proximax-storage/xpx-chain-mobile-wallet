import { DefaultMosaic } from './../../../../models/default-mosaic';
import { NavParams, IonicPage, NavController, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { TransactionType } from 'tsjs-xpx-chain-sdk';

/**
 * Generated class for the TransactionDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html'
})
export class TransactionDetailPage {
  public TransactionType = TransactionType;
  public tx: any;
  public mosaics:DefaultMosaic[] = [];

  constructor(private navParams: NavParams, private navCtrl: NavController, private utils: UtilitiesProvider, private viewCtrl: ViewController) {

    const payload = this.navParams.data;
    this.tx = payload.transactions
    this.mosaics = payload.mosaics;
    console.log('LOG: TransactionDetailPage -> constructor -> this.mosaics', this.mosaics);
    console.log("SIRIUS CHAIN WALLET: TransactionDetailPage -> constructor -> this.tx", this.tx)
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
