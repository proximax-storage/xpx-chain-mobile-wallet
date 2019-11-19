import { ModalController } from "ionic-angular";
import { WalletProvider, NIS1AccountsInterface } from "./../../../../../providers/wallet/wallet";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { App } from "../../../../../providers/app/app";
import { SimpleWallet as NISWallet } from "nem-library";
import { PublicAccount } from "tsjs-xpx-chain-sdk";

/**
 * Generated class for the Nis1WalletListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-nis1-wallet-list",
  templateUrl: "nis1-wallet-list.html"
})
export class Nis1WalletListPage {

  App = App;
  accountsNIS1: NIS1AccountsInterface[] = null;
  wallets: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private walletProvider: WalletProvider,
    private modalCtrl: ModalController
  ) {
    this.getWallet();
  }

  ionViewDidLoad() {}

  /**
   *
   *
   * @memberof Nis1WalletListPage
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   *
   *
   * @memberof Nis1WalletListPage
   */
  getWallet() {
    this.walletProvider.getAccountsNis1().then(accountsNis1 => {
      this.accountsNIS1 = accountsNis1;
    });
  }

  /**
   *
   *
   * @memberof Nis1WalletListPage
   */
  importNis1Wallet() {
    const page = "ImportWalletPage";
    this.showModal(page, {
      name: "",
      privateKey: ""
    });
  }


  /**
   *
   *
   * @param {NIS1AccountsInterface} nis1Account
   * @memberof Nis1WalletListPage
   */
  openAccountNis1(nis1Account: NIS1AccountsInterface) {
    this.showWalletInfoPage(nis1Account.account, nis1Account.publicAccountCatapult);
  }

  /**
   *
   *
   * @param {*} page
   * @param {*} params
   * @memberof Nis1WalletListPage
   */
  showModal(page, params) {
    const modal = this.modalCtrl.create(
      page,
      { data: params },
      {
        enableBackdropDismiss: false,
        showBackdrop: true
      }
    );
    modal.present();
  }

  /**
   *
   *
   * @param {NISWallet} nemWallet
   * @param {SimpleWallet} catapultWallet
   * @memberof Nis1WalletListPage
   */
  showWalletInfoPage(nemWallet: NISWallet, publicAccountCatapult: PublicAccount) {
    /*this.walletProvider.getAccount(catapultWallet).subscribe(account => {
      const page = "WalletInfoPage";
      this.showModal(page, {
        nemWallet: nemWallet,
        catapultWallet: catapultWallet,
        privateKey: account.privateKey
      });
    })*/
  }
}
