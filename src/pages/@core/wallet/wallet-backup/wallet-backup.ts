import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { App } from './../../../../providers/app/app';
import { WalletBackupProvider } from '../../../../providers/wallet-backup/wallet-backup';
import { SocialSharing } from '../../../../../node_modules/@ionic-native/social-sharing';
import { AuthProvider } from '../../../../providers/auth/auth';
import { NemProvider } from '../../../../providers/nem/nem';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { SimpleWallet } from 'tsjs-xpx-chain-sdk';
import { WalletProvider } from '../../../../providers/wallet/wallet';
/**
 * Generated class for the WalletBackupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-wallet-backup',
  templateUrl: 'wallet-backup.html'
})
export class WalletBackupPage {
  App = App;

  options: Array<{
    name: string;
    value: number;
    icon: string;
  }>;
  selectedOption: number = 0;
  showBackupfile: boolean;
  privateKey: string;
  currentWallet: SimpleWallet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private walletBackupProvider: WalletBackupProvider,
    private socialSharing: SocialSharing,
    private modalCtrl: ModalController,
    private utils: UtilitiesProvider,
    private walletProvider: WalletProvider
  ) {
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
  }

  ionViewDidLeave() {
    this.navCtrl.popToRoot();
  }


  goHome() {
    this.navCtrl.setRoot(
      'TabsPage',
      {
        animate: true
      }
    );
  }

  copy() {
    this.walletBackupProvider.copyToClipboard(this.privateKey);
    this.goHome();
  }

  share() {
      this.socialSharing.share(
      this.privateKey, null, null);
      this.goHome();
  }

  gotoQRCodePage() {
    let page = "WalletBackupQrcodePage";
    const modal = this.modalCtrl.create(page, {privateKey: this.privateKey, walletName: this.currentWallet.name } ,{
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
    
  }

  dismiss() {
    this.goHome();
  }
}
