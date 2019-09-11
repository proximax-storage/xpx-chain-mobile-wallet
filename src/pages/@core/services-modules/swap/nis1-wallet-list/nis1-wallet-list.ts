import { ModalController } from 'ionic-angular';
import { WalletProvider } from './../../../../../providers/wallet/wallet';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { App } from '../../../../../providers/app/app';
import { SimpleWallet } from 'nem-library';
import { AuthProvider } from '../../../../../providers/auth/auth';


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
    private modalCtrl: ModalController,
    private authProvider: AuthProvider, 
    ) {
     this.getWallet();
  }

  getWallet(){
 this.walletProvider.getLocalWalletsNis().then(wallets => {
  this.authProvider.getUsername().then(username => { 
    this.wallets = wallets[username];
    console.log('this.walletsthis.wallets', this.wallets)
  })
        

        
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
  
  openWalletNis1(nemWallet){
    this.showWalletInfoPage(nemWallet.walletNis1, nemWallet.wallet);
  }

  showWalletInfoPage(wallet: SimpleWallet, walletC: SimpleWallet) {
    const page = "WalletInfoPage"
    this.showModal(page, {
      wallet: wallet,
      walletC: walletC
    });
  }
}
