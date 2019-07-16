import { NavParams, IonicPage, NavController, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { TransactionType } from 'tsjs-xpx-chain-sdk';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';

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
  TransactionTypes = TransactionType;
  tx: any;

  constructor(private navParams: NavParams, private navCtrl: NavController, private utils: UtilitiesProvider, private viewCtrl: ViewController) {
    this.tx = this.navParams.data;
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
