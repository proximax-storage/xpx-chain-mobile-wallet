import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { BarcodeScannerProvider } from "../../../../providers/barcode-scanner/barcode-scanner";
import { FilePickerProvider } from "../../../../providers/file-picker/file-picker";
import { UtilitiesProvider } from "../../../../providers/utilities/utilities";

/**
 * Generated class for the WalletImportOptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export enum WalletImportOption {
  PRIVATE_KEY = 0,
  WALLET_FILE = 1,
  NANO_WALLET = 2,
  NEM_MOBILE_WALLET = 3,
  SHELTER_DAO = 4,
  RACCOON_WALLET = 5,
  NEM_PAY = 6,
  PROXIMAX_WALLET = 7
}

@IonicPage()
@Component({
  selector: "page-wallet-import-option",
  templateUrl: "wallet-import-option.html"
})
export class WalletImportOptionPage {
  options: Array<{
    name: string;
    icon: string;
    value: number;
    prompt?: string;
  }>;
  selectedOption: {
    name: string;
    value: number;
    icon: string;
    prompt?: string;
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public storage: Storage,
    private filePickerProvider: FilePickerProvider,
    private barcodeScannerProvider: BarcodeScannerProvider,
    private utils: UtilitiesProvider
  ) {
    this.init();
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WalletImportOptionPage");
  }

  init() {
    this.options = [
      {
        name: "Private key",
        icon: "key",
        value: WalletImportOption.PRIVATE_KEY
      },
      {
        name: "Import from ProximaX Wallet",
        value: WalletImportOption.NANO_WALLET,
        icon: "barcode",
        prompt: "Scan QR from ProximaX Wallet"
      },
      {
        name: "Import from nanoWallet",
        value: WalletImportOption.NANO_WALLET,
        icon: "barcode",
        prompt: "Scan QR from nanoWallet"
      },
      {
        name: "Import from NEM Mobile Wallet",
        value: WalletImportOption.NEM_MOBILE_WALLET,
        icon: "barcode",
        prompt: "Scan QR from NEM Mobile Wallet"
      },
      {
        name: "Import from NEMPay",
        value: WalletImportOption.NEM_PAY,
        icon: "barcode",
        prompt: "Scan QR from NEMPay"
      }
    ];
    // {
    //   name: 'Shelter DAO',
    //   value: WalletImportOption.SHELTER_DAO,
    //   prompt: 'Scan QR from NEM Shelter DAO'
    // },
    // {
    //   name: 'Raccoon wallet',
    //   value: WalletImportOption.RACCOON_WALLET,
    //   prompt: 'Scan QR from Raccoon wallet'
    // },
    // {
    //   name: 'ProximaX wallet',
    //   value: WalletImportOption.PROXIMAX_WALLET,
    //   prompt: 'Scan QR from ProximaX wallet'
    // }

    if (this.platform.is("android")) {
      this.options.splice(1, 0, {
        name: "Wallet file",
        icon: "document",
        value: WalletImportOption.WALLET_FILE
      });
    }

    this.selectedOption = this.options[0];
  }

  onSelect(option) {
    this.selectedOption = option;

    this.onSubmit();
  }

  onSubmit() {
    if (this.selectedOption.value === WalletImportOption.PRIVATE_KEY) {
      this.navCtrl.push("WalletAddPrivateKeyPage", {
        name: "",
        privateKey: "",
        password: ""
      });
    } else if (this.selectedOption.value === WalletImportOption.WALLET_FILE) {
      this.storage.set("isAppPaused", true).then(_ => {
        this.filePickerProvider.open().then(data => {
          this.navCtrl.push("WalletAddPasswordConfirmationPage", data);
        });
      });
    } else {
      this.barcodeScannerProvider
        .getData("WalletImportOption", this.selectedOption.prompt)
        .then(data => {
          // Check value based on length of properties in data.
          const hasValue = Object.keys(data).length;

          console.log("barcodeScannerProvider :: data", JSON.stringify(data));

          if (hasValue) {
            this.navCtrl.push("WalletAddPasswordConfirmationPage", data);
          }
        });
    }
  }
}
