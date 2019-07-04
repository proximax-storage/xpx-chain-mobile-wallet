import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";

import { App } from "../../../../../providers/app/app";
import { AuthProvider } from "../../../../../providers/auth/auth";
import { NemProvider } from "../../../../../providers/nem/nem";
import { WalletProvider } from "../../../../../providers/wallet/wallet";
import { UtilitiesProvider } from "../../../../../providers/utilities/utilities";
import {
  SimpleWallet,
  Namespace,
  ProvisionNamespaceTransaction
} from "nem-library";
import { AlertProvider } from "../../../../../providers/alert/alert";

/**
 * Generated class for the NamespaceCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-namespace-create",
  templateUrl: "namespace-create.html"
})
export class NamespaceCreatePage {
  App = App;
  formGroup: FormGroup;

  currentWallet: SimpleWallet;
  namespaceTx: ProvisionNamespaceTransaction;
  namespaces: Namespace[];
  PASSWORD: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private authProvider: AuthProvider,
    private alertProvider: AlertProvider,
    private walletProvider: WalletProvider,
    private utils: UtilitiesProvider,
    private nemProvider: NemProvider,
    private viewController: ViewController
  ) {
    this.init();
  }

  ionViewWillEnter() {
    this.walletProvider.getSelectedWallet().then(currentWallet => {
      if (!currentWallet) {
        this.utils.setRoot("WalletListPage");
      } else {
        this.currentWallet = currentWallet;
      }

      // Create ProvisionNamespaceTransaction to get the sinkAddress, fee and rentalFee.
      this.namespaceTx = this.nemProvider.prepareNamespaceTransaction("");

      const fee = this.namespaceTx.fee / 1000000;
      const rentalFee = this.namespaceTx.rentalFee / 1000000;

      this.formGroup
        .get("sinkAddress")
        .setValue(this.namespaceTx.rentalFeeSink.pretty());
      this.formGroup.get("rentalFee").setValue(rentalFee);
      this.formGroup.get("fee").setValue(fee);

      this.nemProvider
        .getNamespacesOwned(this.currentWallet.address)
        .subscribe(namespaces => {
          this.namespaces = namespaces;
        });
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WalletAddPage");
  }

  init() {
    this.formGroup = this.formBuilder.group({
      parentNamespace: [""],
      name: ["", [Validators.minLength(3), Validators.required]],
      sinkAddress: ["", [Validators.required]],
      fee: ["", [Validators.required]],
      rentalFee: ["", [Validators.required]]
    });

    this.authProvider.getPassword().then(password => {
      this.PASSWORD = password;
    });
  }

  onSubmit(form) {
    let tx: ProvisionNamespaceTransaction;

    if (form.parentNamespace) {
      tx = this.nemProvider.prepareSubNamespaceTransaction(
        form.name,
        form.parentNamespace
      );
    } else {
      tx = this.nemProvider.prepareNamespaceTransaction(form.name);
    }

    this.nemProvider
      .confirmTransaction(tx, this.currentWallet, this.PASSWORD)
      .subscribe(res => {
        this.navCtrl.pop().then(() => {
          this.alertProvider.showMessage("New namespace created");
        });
      });
  }

  dismiss(){
    this.viewController.dismiss();
  }
}
