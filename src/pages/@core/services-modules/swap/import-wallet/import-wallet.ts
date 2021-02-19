import { SimpleWallet } from 'nem-library';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ModalController, LoadingOptions, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { NemProvider } from '../../../../../providers/nem/nem';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the ImportWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-import-wallet',
  templateUrl: 'import-wallet.html',
})
export class ImportWalletPage {

  App = App;
  formGroup: FormGroup;

  PASSWORD: string;

  walletColor: string = "wallet-1";
  walletName: string = "Primary";

  tablet: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertProvider: AlertProvider,
    private nem: NemProvider,
    private walletProvider: WalletProvider,
    private authProvider: AuthProvider,
    private utils: UtilitiesProvider,
  
    private translateService: TranslateService,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController
  ) {
    console.log('LOG: ImportWalletPage -> init -> this.navParams.data', this.navParams.data.data);

    this.walletColor = 'wallet-1';
    this.init();
    this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
  }

  changeWalletColor(color) {
    this.walletColor = color;
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImportWalletPage');
  }

  ionViewDidLeave() {
  }

  init() {
    if (window.screen.width >= 768) { // 768px portrait
      this.tablet = true;
    }

    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.minLength(3), Validators.required]],
      privateKey: ['', [Validators.minLength(3), Validators.required]]
    });

    if (this.navParams.data.data) {
      this.formGroup.setValue(this.navParams.data.data);
    }

    this.authProvider.getPassword().then(password => {
      this.PASSWORD = password;
    });
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      let privKey = JSON.parse(barcodeData.text);

      if (privKey) {
        this.formGroup.patchValue({ privateKey: privKey })
      }
    });
  }

  gotoBackup(wallet) {
    return this.navCtrl.push('WalletBackupPage', wallet);
  }

  goHome() {
    this.navCtrl.setRoot(
      'TabsPage',
      {
        animate: true
      }
    );
  }

  onSubmit(form) {
    let options: LoadingOptions = {
      content: ''
    };
    let loader = this.loadingCtrl.create(options);

    loader.present();

    try {
      const catapultWallet = this.walletProvider.createAccountFromPrivateKey(form.name, this.PASSWORD, form.privateKey);
      const nemWallet = this.nem.createPrivateKeyWallet(form.name, this.PASSWORD, form.privateKey);
      this.walletProvider.checkIfWalletNameExists(catapultWallet.name, catapultWallet.address.plain()).then(value => {
        if (value) {
          this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.NAME_EXISTS"));
          loader.dismiss();
        } else {
          this.nem.getOwnedMosaics(nemWallet.address).subscribe(mosacis => {
            for (let index = 0; index < mosacis.length; index++) {
              const element = mosacis[index];
              if (element.assetId.name === 'xpx') {
                /*this.walletProvider.storeWalletNis1(catapultWallet, nemWallet, this.walletColor).then(_ => {
                  // RJ
                  this.walletProvider.storeWallet({ wallet: catapultWallet, walletColor: this.walletColor }).then(_ => {
                    this.walletProvider.setSelectedWallet(catapultWallet);
                    loader.dismiss();
                    this.showWalletInfoPage(nemWallet, catapultWallet, form.privateKey);
                  });
                });*/
              }
            }
          });
        }
      });
    }
    catch (error) {
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.PRIVATE_KEY_INVALID"));
    }
  }

  showWalletInfoPage(nemWallet: SimpleWallet, catapultWallet: any, privateKey: string) {
    console.log("TCL: ImportWalletPage -> showWalletInfoPage -> nemWallet", nemWallet)
    const page = "WalletInfoPage"
    this.showModal(page, {
      nemWallet: nemWallet,
      catapultWallet: catapultWallet,
      privateKey: privateKey
    });
  }

  showModal(page, params) {
    const modal = this.modalCtrl.create(page, { data: params }, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  updateName() {
    let name = this.formGroup.value.name
    if (name) {
      this.walletName = name;
    } else {
      this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

