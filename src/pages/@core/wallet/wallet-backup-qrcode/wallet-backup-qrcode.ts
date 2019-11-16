import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastProvider } from '../../../../providers/toast/toast';
/**
 * Generated class for the WalletBackupQrcodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-backup-qrcode',
  templateUrl: 'wallet-backup-qrcode.html',
})
export class WalletBackupQrcodePage {

  privateKey: string;
  QRData: string;
  walletName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private haptic: HapticProvider,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
  ) {}

  /**
   *
   *
   * @memberof WalletBackupQrcodePage
   */
  ionViewDidLoad() {
    this.privateKey = this.navParams.data.privateKey;
    this.walletName = this.navParams.data.walletName;
    this.QRData = this.navParams.data.privateKey;
  }

  /**
   *
   *
   * @memberof WalletBackupQrcodePage
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   *
   *
   * @memberof WalletBackupQrcodePage
   */
  copy() {
    this.clipboard.copy(this.privateKey).then(_ => {
      this.haptic.notification({ type: 'success' });
      this.toastProvider.show('Copied private key successfully', 3, true);
      this.dismiss();
    });
  }

  /**
   *
   *
   * @memberof WalletBackupQrcodePage
   */
  goHome() {
    this.navCtrl.setRoot('TabsPage', { animate: true });
  }

}
