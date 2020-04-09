import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { App } from './../../../../providers/app/app';
import { SocialSharing } from '../../../../../node_modules/@ionic-native/social-sharing';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { SimpleWallet, Password } from 'tsjs-xpx-chain-sdk';
import { Clipboard } from '@ionic-native/clipboard';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from '../../../../providers/toast/toast';
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
  publicAccount: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    private modalCtrl: ModalController,
    private utils: UtilitiesProvider,
    private proximaxProvider: ProximaxProvider,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private translateService: TranslateService

  ) {
    this.data = this.navParams.data;


    console.log('his.data', this.data);

    if (this.data && this.data.password) {
      let password = new Password(this.data.password);
      this.data.privateKey = this.proximaxProvider.decryptPrivateKey(password, this.data.wallet.encryptedPrivateKey.encryptedKey,
        this.data.wallet.encryptedPrivateKey.iv);
        this.publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(this.data.privateKey, this.data.wallet.network)
    }
  }

  /**
   *
   *
   * @memberof WalletBackupPage
   */
  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
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
  copy(val) {
    if (val === 1) {
      this.translateService.get('WALLETS.EXPORT.COPY_PRIVATE_KEY.RESPONSE').subscribe(value => {
        let alertTitle = value;
        this.clipboard.copy(this.data.privateKey).then(_ => {
          this.toastProvider.show(alertTitle, 3, true);
        });
      })
    } else {
      this.translateService.get('WALLETS.EXPORT.COPY_PRIVATE_KEY.RESPONSE').subscribe(value => {
        let alertTitle = value;
        this.clipboard.copy(this.publicAccount.publicKey).then(_ => {
          this.toastProvider.show(alertTitle, 3, true);
        });
      })
    }
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
  shared(val) {
    if (val === 1) {
      this.socialSharing.share(this.data.privateKey, null, null)
    } else {
      this.socialSharing.share(this.publicAccount.publicKey, null, null)
    }
  }
}
