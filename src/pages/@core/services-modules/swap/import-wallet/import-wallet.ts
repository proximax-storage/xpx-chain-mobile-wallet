import { SimpleWallet } from 'nem-library';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, AlertController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';
import { NemProvider } from '../../../../../providers/nem/nem';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

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
    private storage: Storage,
    private translateService: TranslateService,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {
    console.log('LOG: WalletAddPrivateKeyPage -> init -> this.navParams.data', this.navParams.data.data);

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
    console.log('ionViewDidLoad WalletAddPage');
    this.storage.set('isQrActive', true);
  }

  ionViewDidLeave() {
    this.storage.set('isQrActive', false);
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
    try {
      const catapultWallet = this.walletProvider.createAccountFromPrivateKey({ walletName: form.name, password: this.PASSWORD, privateKey: form.privateKey });
      const nemWallet = this.nem.createPrivateKeyWallet(form.name, this.PASSWORD, form.privateKey);
      
      this.walletProvider.checkIfWalletNameExists(catapultWallet.name, catapultWallet.address.plain()).then(value => {
        if (value) {
          this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.NAME_EXISTS"));
        } else {

          this.walletProvider
          .storeWallet(catapultWallet, this.walletColor)
          .then(_ => {
            return this.walletProvider.setSelectedWallet(catapultWallet);
          });
  
        
        this.nem.getOwnedMosaics(nemWallet.address)
        .subscribe(mosacis => {
          for (let index = 0; index < mosacis.length; index++) {
            const element = mosacis[index];
  
            if (element.assetId.name === 'xpx') {
              this.walletProvider
                .storeWalletNis1(catapultWallet, nemWallet, this.walletColor)
                .then(_ => {
                this.showWalletInfoPage(nemWallet, catapultWallet);
                });
            } else {
  
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

  showWalletInfoPage(wallet: SimpleWallet, walletC: any) {
    const page = "WalletInfoPage"
    this.showModal(page, {
      wallet: wallet,
      walletC: walletC
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

