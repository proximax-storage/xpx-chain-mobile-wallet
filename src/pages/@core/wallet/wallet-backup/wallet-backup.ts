import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { App } from './../../../../providers/app/app';
import { WalletBackupProvider } from '../../../../providers/wallet-backup/wallet-backup';
import { SocialSharing } from '../../../../../node_modules/@ionic-native/social-sharing';
import { AuthProvider } from '../../../../providers/auth/auth';
import { NemProvider } from '../../../../providers/nem/nem';
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

  options: Array<{
    name: string;
    value: number;
    icon: string;
  }>;
  selectedOption: number = 0;
  showBackupfile: boolean;
  privateKey: string;
  QRData: string;
  currentWallet: SimpleWallet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private walletBackupProvider: WalletBackupProvider,
    private nemProvider: NemProvider,
    private socialSharing: SocialSharing,
    private utils: UtilitiesProvider,
    private modalCtrl: ModalController,
  ) {

  }

  ionViewWillEnter() {


  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WalletBackupPage');

    // this.utils.setHardwareBack(this.navCtrl);
    // this.currentWallet = <SimpleWallet>this.navParams.data;
    // if (this.currentWallet) {

    //   this.authProvider
    //     .getPassword()
    //     .then(password => {
    //       this.QRData = this.nemProvider.generateWalletQRText(password, this.currentWallet);
    //       const account = this.nemProvider.passwordToPrivateKey(
    //         password,
    //         this.currentWallet
    //       );
    //       this.privateKey = account.privateKey;
    //     });
    // }
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
    this.walletBackupProvider.copyToClipboard(<SimpleWallet>this.navParams.data);
    this.goHome();
  }

  share() {
    const WALLET: SimpleWallet = <SimpleWallet>this.navParams.data;
    this.authProvider.getPassword().then(async password => {
      const account = await this.nemProvider.passwordToPrivateKey(password, WALLET);

      await this.socialSharing.share(
        account.privateKey, null, null);
      this.goHome();
    });
  }

  gotoQRCodePage() {
    let page = "WalletBackupQrcodePage";
    const modal = this.modalCtrl.create(page, {QRData:this.QRData, privateKey: this.privateKey, walletName: this.currentWallet.name } ,{
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
    
  }

  dismiss() {
    this.goHome();
  }
}
