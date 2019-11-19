import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ToastProvider } from '../../../../../providers/toast/toast';
import { Clipboard } from '@ionic-native/clipboard';
import { Address } from 'tsjs-xpx-chain-sdk';


/**
 * Generated class for the SwapCertificatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-swap-certificate',
  templateUrl: 'swap-certificate.html',
})
export class SwapCertificatePage {
  publicKey: any;
  transactionHash: any;
  address: any;
  timestamp: Date;
  screenshotDone: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
  ) {
    this.publicKey = this.navParams.data.publicKey;
    this.transactionHash = this.navParams.data.transactionHash;
    let address = Address.createFromRawAddress(this.navParams.data.address.address);
    this.address = address.pretty();
    this.timestamp = new Date(this.navParams.data.timestamp);
  }


  qrCreate() {
    let qr = qrcode(10, 'H')
    let url = `http://bob.nem.ninja:8765/#/search/${this.transactionHash}`;
    qr.addData(url);
    qr.make()
    // console.log('urlurlurl', url)
    return qr.createDataURL()
  }

  copy(val, string) {
    this.clipboard.copy(val).then(_ => {
      this.toastProvider.show(`Your ${string} has been successfully copied to the clipboard`, 3, true);
    });
  }


  dismiss() {
    this.viewCtrl.dismiss();
    this.navCtrl.setRoot('TabsPage', { animate: true });
  }

}
