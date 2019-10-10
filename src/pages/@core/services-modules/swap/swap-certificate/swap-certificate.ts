import { File } from '@ionic-native/file';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
import { ToastProvider } from '../../../../../providers/toast/toast';
import { Clipboard } from '@ionic-native/clipboard';
import { Screenshot } from '@ionic-native/screenshot';
import { Address } from 'tsjs-xpx-chain-sdk';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Diagnostic } from '@ionic-native/diagnostic';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
// import * as qrcode from 'qrcode-generator';
// import { Address } from 'tsjs-xpx-chain-sdk';

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

    const params = this.navParams.data;
    console.log("TCL: SwapCertificatePage -> this.navParams.data", JSON.stringify(this.navParams.data, null, 4))
    console.log('params this.params', JSON.stringify(params, null, 4));
    this.publicKey = params.publicKey.payload;
    this.transactionHash = params.transactionHash.data;
    let address = Address.createFromRawAddress(params.address.address);
    this.address = address.pretty();
    this.timestamp = new Date(params.timestamp);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwapCertificatePage');
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
    this.navCtrl.setRoot(
      'TabsPage',
      {
        animate: true
      }
    );
  }

}
