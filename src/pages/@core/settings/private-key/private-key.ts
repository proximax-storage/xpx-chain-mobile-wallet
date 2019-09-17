import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { SimpleWallet, Password, Account } from 'tsjs-xpx-chain-sdk';

import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';

// import { NemProvider } from './../../../../providers/nem/nem';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { ToastProvider } from '../../../../providers/toast/toast';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { App } from '../../../../providers/app/app';
import { TranslateService } from '@ngx-translate/core';
import CryptoJS from 'crypto-js';
import { WalletBackupProvider } from '../../../../providers/wallet-backup/wallet-backup';

/**
 * Generated class for the PrivateKeyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-private-key',
  templateUrl: 'private-key.html'
})
export class PrivateKeyPage {
  App = App;

  currentWallet: SimpleWallet;
  privateKey: string;
  password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public walletProvider: WalletProvider,
    // private nemProvider: NemProvider,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastProvider: ToastProvider,
    private utils: UtilitiesProvider,
    private viewController: ViewController,
    private haptic: HapticProvider,
    private modalCtrl: ModalController,
    private walletBackupProvider: WalletBackupProvider
  ) {
    this.password = this.navParams.get('password');
    console.log("SIRIUS CHAIN WALLET: PrivateKeyPage -> this.password", this.password)
  
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);

    this.walletProvider.getSelectedWallet().then(currentWallet => {
    console.log("SIRIUS CHAIN WALLET: PrivateKeyPage -> ionViewWillEnter -> currentWallet", currentWallet)
      if (currentWallet) {
      this.currentWallet = currentWallet;
      this.walletProvider.getAccount(currentWallet).subscribe(account=> {
        this.privateKey = account.privateKey;
      })
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivateKeyPage');
  }


  copy() {
    this.walletBackupProvider.copyToClipboard(this.privateKey);
    this.dismiss();
  }

  share() {
    this.haptic.notification({ type: 'success' });
    this.socialSharing
      .share(
        `Private key of ${this.currentWallet.name}: \n${this.privateKey}`,
        null,
        null,
        null
      )
      .then(_ => {
        // this.dismiss();
      });
  }

  dismiss(){
    this.viewController.dismiss();
  }

  gotoQRCodePage() {
    let page = "WalletBackupQrcodePage";
    const modal = this.modalCtrl.create(page, { privateKey: this.privateKey, walletName: this.currentWallet.name }, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();

  }
}
