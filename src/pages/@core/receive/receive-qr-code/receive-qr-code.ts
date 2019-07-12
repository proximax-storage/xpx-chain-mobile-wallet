import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SimpleWallet } from 'tsjs-xpx-chain-sdk';

import { WalletProvider } from '../../../../providers/wallet/wallet';
import { NemProvider } from '../../../../providers/nem/nem';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';

/**
 * Generated class for the ReceiveQrCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receive-qr-code',
  templateUrl: 'receive-qr-code.html'
})
export class ReceiveQrCodePage {
  currentWallet: SimpleWallet;
  data: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nemProvider: NemProvider,
    private walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
    public viewCtrl: ViewController
  ) {
    this.data = this.navParams.data;
  }

  ionViewWillEnter() {
    this.walletProvider.getSelectedWallet().then(currentWallet => {
      if (!currentWallet) {
        this.navCtrl.setRoot(
          'TabsPage',
          {},
          {
            animate: true,
            direction: 'backward'
          }
        );
      } else {
        this.currentWallet = currentWallet;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceiveQrCodePage');
  }

  getQRCode() {
    let QRCode: any = this.nemProvider.generateInvoiceQRText(
      this.currentWallet.address,
      this.data.amount,
      this.data.message
    );
    QRCode = JSON.parse(QRCode);
    QRCode.data.mosaicId = this.data.mosaic.mosaicId;

    return JSON.stringify(QRCode);
  }
}
