import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  AlertController,
  ViewController,
  ModalController
} from "ionic-angular";

import { SimpleWallet, Namespace } from "nem-library";

import { App } from "../../../../../providers/app/app";
import { WalletProvider } from "../../../../../providers/wallet/wallet";
import { NemProvider } from "../../../../../providers/nem/nem";
import { UtilitiesProvider } from "../../../../../providers/utilities/utilities";

/**
 * Generated class for the NamespaceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-namespace-list",
  templateUrl: "namespace-list.html"
})
export class NamespaceListPage {
  App = App;

  currentWallet: SimpleWallet;
  selectedData: Namespace;

  namespaces: Namespace[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public walletProvider: WalletProvider,
    public nemProvider: NemProvider,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad WalletListPage");
  }

  ionViewWillEnter() {
    this.walletProvider.getSelectedWallet().then(currentWallet => {
      if (!currentWallet) {
        this.utils.setRoot("WalletListPage");
      } else {
        this.currentWallet = currentWallet;
      }

      this.nemProvider
        .getNamespacesOwned(this.currentWallet.address)
        .subscribe(namespaces => {
          this.namespaces = namespaces;
          this.selectedData = namespaces[0];
        });
    });
  }

  onSelect(namespace) {
    this.selectedData = namespace;
  }

  gotoAdd() {
    let page = 'NamespaceCreatePage';
    const modal = this.modalCtrl.create(page, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
