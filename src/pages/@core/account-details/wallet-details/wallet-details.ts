import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AccountInfo, SimpleWallet } from 'tsjs-xpx-chain-sdk';

import { NemProvider } from '../../../../providers/nem/nem';
import { ToastProvider } from '../../../../providers/toast/toast';
import { AuthProvider } from './../../../../providers/auth/auth';

/**
 * Generated class for the WalletDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-details',
  templateUrl: 'wallet-details.html',
})
export class WalletDetailsPage {
  accountInfo: AccountInfo;
  currentWallet: SimpleWallet;
  walletName: string = '';
  totalBalance: number;
  selectedAccount:any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private authProvider: AuthProvider
  ) {
    console.log("SIRIUS CHAIN WALLET: WalletDetailsPage -> this.navParams.data", this.navParams.data)
    this.totalBalance = this.navParams.get('totalBalance');
    this.selectedAccount = this.navParams.get('selectedAccount');
    // this.getAccountInfo();
  }

  getAccountInfo() {
    // this.nemProvider.getAccountInfo(this.currentWallet.address).subscribe(accountInfo => {
    //     this.accountInfo = accountInfo;
    //     console.log(this.accountInfo)
    //   }, (err: any) => {
    //     console.log(err)
    //   });
  }

  copy() {
    this.clipboard.copy(this.selectedAccount.address.plain()).then(_ => {
      this.toastProvider.show('Your address has been successfully copied to the clipboard.', 3, true);
    });
  }

  showExportPrivateKeyModal() {
    this.authProvider.getPassword().then(password => {
      let credentials = {
        password: password,
        privateKey: ''
      };

      let page = "PrivateKeyPage";
      this.showModal(page, { password: credentials.password });
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showWalletUpdate() {
    let page = "WalletUpdatePage";
    this.showModal(page, { wallet: this.currentWallet });
  }

  showWalletDete() {
    let page = "WalletDeletePage";
    this.showModal(page, { wallet: this.currentWallet });
  }

  showModal(page, params) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletDetailsPage');
  }

}
