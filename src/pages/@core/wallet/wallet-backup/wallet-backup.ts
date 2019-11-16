import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { App } from './../../../../providers/app/app';
import { WalletBackupProvider } from '../../../../providers/wallet-backup/wallet-backup';
import { SocialSharing } from '../../../../../node_modules/@ionic-native/social-sharing';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { SimpleWallet } from 'tsjs-xpx-chain-sdk';
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

  data = null;
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
    private utils: UtilitiesProvider
  ) {
  }

  /**
   *
   *
   * @memberof WalletBackupPage
   */
  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
    this.data = this.navParams.data;
  }

  /**
   *
   *
   * @memberof WalletBackupPage
   */
  ionViewDidLoad() {
  }

  /**
   *
   *
   * @memberof WalletBackupPage
   */
  ionViewDidLeave() {
    this.navCtrl.popToRoot();
  }

  /**
   *
   *
   * @memberof WalletBackupPage
   */
  copy() {
    this.walletBackupProvider.copyToClipboard(this.data.privateKey);
    this.goHome();
  }

  /**
   *
   *
   * @memberof WalletBackupPage
   */
  dismiss() {
    this.goHome();
  }

  /**
   *
   *
   * @memberof WalletBackupPage
   */
  gotoQRCodePage() {
    let page = "WalletBackupQrcodePage";
    const modal = this.modalCtrl.create(page, { privateKey: this.data.privateKey, walletName: this.data.wallet.name }, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }


  /**
   *
   *
   * @memberof WalletBackupPage
   */
  goHome() {
    this.navCtrl.setRoot('TabsPage', { animate: true });
  }

  /**
   *
   *
   * @memberof WalletBackupPage
   */
  share() {
    this.socialSharing.share(this.data.privateKey, null, null)
  }
}
