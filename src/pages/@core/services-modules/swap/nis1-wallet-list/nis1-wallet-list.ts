import { ModalController, LoadingOptions, LoadingController, ViewController } from "ionic-angular";
import { WalletProvider, NIS1AccountsInterface } from "./../../../../../providers/wallet/wallet";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import { App } from "../../../../../providers/app/app";
import { NemProvider, AccountsInfoNis1Interface } from "../../../../../providers/nem/nem";
import { AlertProvider } from "../../../../../providers/alert/alert";

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
    private alertProvider: AlertProvider,
    private nemProvider: NemProvider,
    private viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private walletProvider: WalletProvider,
    private modalCtrl: ModalController
  ) {
    this.walletProvider.getAccountsNis1().then(accountsNis1 => {
      this.accountsNIS1 = accountsNis1;
    });
  }


  /**
   *
   *
   * @param {NIS1AccountsInterface} nis1Account
   * @memberof Nis1WalletListPage
   */
  async openAccountNis1(nis1Account: NIS1AccountsInterface) {
    let options: LoadingOptions = {
      content: 'Getting account information...'
    };
    let loader = this.loadingCtrl.create(options);
    loader.present();

    const myAccountCatapult = await this.walletProvider.filterCatapultAccountInWalletSelected(nis1Account.publicAccountCatapult);
    if (myAccountCatapult) {
      const publicAccountNis1 = this.nemProvider.createPublicAccount(nis1Account.publicAccount.publicKey);
      this.nemProvider.getAccountInfoNis1(publicAccountNis1, nis1Account.account.name).then((data: AccountsInfoNis1Interface) => {
        loader.dismiss();
        if (data) {
          const modal = this.modalCtrl.create('WalletInfoPage', {
            data: {
              nis1Account: nis1Account.account,
              catapultAccount: myAccountCatapult.account,
              accountInfoNis1: data
            }
          }, {
            enableBackdropDismiss: false,
            showBackdrop: true
          });

          modal.present();
        }
      }, error => loader.dismiss());
    } else {
      // this.translateService.instant("SERVICES.SWAP_PROCESS.STEP2.CONFIRM_SWAP.TITLE")
      this.alertProvider.showMessage('Service not available');
    }
  }

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
  goImportAccount() {
    this.navCtrl.push("WalletAddPrivateKeyPage", {
      name: "",
      privateKey: "",
      password: ""
    });
  }
}
