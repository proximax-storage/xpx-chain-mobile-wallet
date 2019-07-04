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
  MosaicDefinitionCreationTransaction
} from "nem-library";
import { AlertProvider } from "../../../../../providers/alert/alert";

/**
 * Generated class for the MosaicCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-mosaic-create",
  templateUrl: "mosaic-create.html"
})
export class MosaicCreatePage {
  App = App;
  formGroup: FormGroup;

  currentWallet: SimpleWallet;
  mosaicTx: MosaicDefinitionCreationTransaction;
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
    private viewCtrl: ViewController
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

      this.nemProvider
        .getNamespacesOwned(this.currentWallet.address)
        .subscribe(namespaces => {
          this.namespaces = namespaces;
          this.formGroup
            .get("parentNamespace")
            .setValue(this.namespaces[0].name);

          this.initMosaicTx();
        });
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MosaicCreatePage");
  }

  init() {
    this.formGroup = this.formBuilder.group({
      parentNamespace: [""],
      mosaicName: ["", [Validators.minLength(3), Validators.required]],
      description: ["", [Validators.required]],
      divisibility: ["", [Validators.required]],
      supply: ["", [Validators.required]],
      transferrable: [true, [Validators.required]],
      supplyMutable: [true, [Validators.required]],
      requiresLevy: [false, [Validators.required]],
      sinkAddress: ["", [Validators.required]],
      fee: ["", [Validators.required]],
      rentalFee: ["", [Validators.required]]
    });

    this.authProvider.getPassword().then(password => {
      this.PASSWORD = password;
    });
  }

  initMosaicTx() {
    // Create ProvisionNamespaceTransaction to get the sinkAddress, fee and rentalFee.
    this.nemProvider
      .getAccountInfo(this.currentWallet.address)
      .subscribe(accountInfo => {
        this.mosaicTx = this.nemProvider.prepareMosaicCreationTransaction(
          accountInfo,
          this.namespaces[0].name,
          "",
          "",
          0,
          0,
          true,
          true
        );

        const fee = this.mosaicTx.fee / 1000000;
        const rentalFee = this.mosaicTx.creationFee / 1000000;

        this.formGroup
          .get("sinkAddress")
          .setValue(this.mosaicTx.creationFeeSink.pretty());
        this.formGroup.get("rentalFee").setValue(rentalFee);
        this.formGroup.get("fee").setValue(fee);
      });
  }

  onSubmit(form) {
    console.log(form)

    this.nemProvider
      .getAccountInfo(this.currentWallet.address)
      .subscribe(accountInfo => {
        let tx: MosaicDefinitionCreationTransaction = this.nemProvider.prepareMosaicCreationTransaction(
          accountInfo,
          form.parentNamespace,
          form.mosaicName,
          form.description,
          form.divisibility,
          form.supply,
          form.transferrable,
          form.supplyMutable
        );

        this.nemProvider
          .confirmTransaction(tx, this.currentWallet, this.PASSWORD)
          .subscribe(res => {
            this.navCtrl.pop().then(() => {
              this.alertProvider.showMessage("New namespace created");
            });
          });
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
