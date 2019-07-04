import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastProvider } from '../../../providers/toast/toast';
import { WalletProvider } from '../../../providers/wallet/wallet';
import { SimpleWallet } from 'nem-library';
import { NemProvider } from '../../../providers/nem/nem';
import { HapticProvider } from '../../../providers/haptic/haptic';
 /*
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html'
})
export class ReceivePage {
  currentWallet: SimpleWallet;
  address:string;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastProvider: ToastProvider,
    private walletProvider: WalletProvider,
    private nemProvider: NemProvider,
    private haptic: HapticProvider
  ) {
  }
  ionViewWillEnter() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceivePage');
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
        this.address = this.currentWallet.address.plain();
      }
      
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getQRCode() {
    // return this.currentWallet.address.plain().toString();

    let QRCode: any = this.nemProvider.generateAddressQRText(
      this.currentWallet.address
    );
    QRCode = JSON.parse(QRCode);
    QRCode.data.name = this.currentWallet.name;

    console.log("QRCode",QRCode);

    return JSON.stringify(QRCode);
  }

  copy() {
    this.clipboard.copy(this.currentWallet.address.plain()).then(_ => {
      this.haptic.notification({ type: 'success' });
      this.toastProvider.show('Your address has been successfully copied to the clipboard.', 3, true);
    });
  }

  share() {
    this.haptic.notification({ type: 'success' });
    this.socialSharing
      .share(
        this.currentWallet.address.plain(),
        null,
        null,
        null
      )
      .then(_ => { });
  }
}
