import { ModalController } from 'ionic-angular';
import { WalletProvider } from './../../../../../providers/wallet/wallet';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { App } from '../../../../../providers/app/app';


/**
 * Generated class for the Nis1WalletListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nis1-wallet-list',
  templateUrl: 'nis1-wallet-list.html',
})
export class Nis1WalletListPage {
  App = App;
  wallets: any;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private walletProvider: WalletProvider,
    private modalCtrl: ModalController
    ) {

      this.walletProvider.getLocalWalletsNis1().then(wallets => {
        this.wallets = wallets['luis'];
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Nis1WalletListPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  importNis1Wallet() {
    const page = "ImportWalletPage"
    this.showModal(page, {
      name: "",
      privateKey: ""
    });
  }

  showModal(page, params) {
    const modal = this.modalCtrl.create(page, { data: params }, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }
  
}
