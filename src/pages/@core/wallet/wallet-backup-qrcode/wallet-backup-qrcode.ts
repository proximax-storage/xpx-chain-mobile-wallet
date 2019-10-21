import { WalletProvider } from './../../../../providers/wallet/wallet';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Haptic, AlertController, AlertOptions } from 'ionic-angular';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastProvider } from '../../../../providers/toast/toast';
import { AlertProvider } from '../../../../providers/alert/alert';
import { AuthProvider } from '../../../../providers/auth/auth';
import { e } from '@angular/core/src/render3';


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
    ) {
      console.log("SIRIUS CHAIN WALLET: WalletBackupQrcodePage -> this.navParams.data", this.navParams.data)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletBackupQrcodePage');
    this.QRData =this.privateKey; 
  }
  dismiss() {
     this.viewCtrl.dismiss(); 
  }

  copy() {
    this.clipboard.copy(this.privateKey).then(_ => {
      this.haptic.notification({ type: 'success' });
      this.toastProvider.show('Copied private key successfully', 3, true);
      this.dismiss();
    });
  }


  goHome() {
    this.navCtrl.setRoot(
      'TabsPage',
      {
        animate: true
      }
    );
  }

}
