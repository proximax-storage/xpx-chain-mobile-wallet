import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SimpleWallet, Password } from 'nem-library';
import { TranslateService } from '@ngx-translate/core';

import { App } from '../../../../providers/app/app';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../providers/auth/auth';
import { AlertProvider } from '../../../../providers/alert/alert';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { NemProvider } from '../../../../providers/nem/nem';
import { SharedService, ConfigurationForm } from '../../../../providers/shared-service/shared-service';
/**
 * Generated class for the WalletAddPrivateKeyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-add-private-key',
  templateUrl: 'wallet-add-private-key.html'
})
export class WalletAddPrivateKeyPage {

  catapultWallet: any;
  nemWallet: SimpleWallet;
  App = App;
  formGroup: FormGroup;

  PASSWORD: string;

  walletColor: string = "wallet-1";
  walletName: string = "Primary";

  tablet: boolean = false;
  configurationForm: ConfigurationForm = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertProvider: AlertProvider,
    private nem: NemProvider,
    private walletProvider: WalletProvider,
    private authProvider: AuthProvider,
    private utils: UtilitiesProvider,
    private alertCtrl: AlertController,
    private storage: Storage,
    private translateService: TranslateService,
    private modalCtrl: ModalController,
    private sharedService: SharedService
  ) {
    this.walletColor = 'wallet-1';
    this.configurationForm = this.sharedService.configurationForm;
    this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    this.createForm();

  }


  /**
   *
   *
   * @param {{ name: any; password: any; privateKey: any; }} form
   * @memberof WalletAddPrivateKeyPage
   */
  async createAccount(form: { name: any; password: any; privateKey: any; }) {
    try {
      const decrypted = await this.authProvider.decryptAccountUser(form.password);
      if (decrypted) {
        this.catapultWallet = this.walletProvider.createAccountFromPrivateKey(form.name, form.password, form.privateKey);
        console.log('\n\ncatapultWallet\n', this.catapultWallet);
        console.log('\n\nform.password\n', form.password);
        this.nemWallet = this.nem.createPrivateKeyWallet(form.name, form.password, form.privateKey);
        this.walletProvider.checkIfWalletNameExists(this.catapultWallet.name, this.catapultWallet.address.plain()).then(value => {
          if (value) {
            this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.NAME_EXISTS"));
          } else {
            this.walletProvider.storeWallet(this.catapultWallet, this.walletColor, new Password(form.password)).then(_ => {
              return this.walletProvider.setSelectedWallet(this.catapultWallet);
            }).then(_ => {
              this.gotoBackup(this.catapultWallet);
            });

            this.nem.getOwnedMosaics(this.nemWallet.address).subscribe(mosacis => {
              for (let index = 0; index < mosacis.length; index++) {
                const element = mosacis[index];
                if (element.assetId.name === 'xpx' && element.assetId.namespaceId === 'prx') {
                  this.walletProvider.storeWalletNis1(this.catapultWallet, this.nemWallet, this.walletColor).then(_ => {
                    this.showSwap();
                  });
                }
              }
            });
          }
        });
      } else {
        this.alertProvider.showMessage('Invalid password');
      }
    }
    catch (error) {
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.PRIVATE_KEY_INVALID"));
    }
  }

  /**
   *
   *
   * @memberof WalletAddPrivateKeyPage
   */
  createForm() {
    if (window.screen.width >= 768) { // 768px portrait
      this.tablet = true;
    }

    this.formGroup = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(this.configurationForm.nameWallet.minLength),
        Validators.maxLength(this.configurationForm.nameWallet.maxLength)
      ]],
      privateKey: ['', [
        Validators.required,
        Validators.minLength(this.configurationForm.privateKey.minLength),
        Validators.minLength(this.configurationForm.privateKey.minLength)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(this.configurationForm.passwordWallet.minLength),
        Validators.minLength(this.configurationForm.passwordWallet.minLength)
      ]]
    });

    if (this.navParams.data) {
      this.formGroup.setValue(this.navParams.data);
    }
  }

  /**
   *
   *
   * @param {string} color
   * @memberof WalletAddPrivateKeyPage
   */
  changeWalletColor(color: string) {
    this.walletColor = color;
  }

  /**
   *
   *
   * @param {*} wallet
   * @returns
   * @memberof WalletAddPrivateKeyPage
   */
  gotoBackup(wallet: any) {
    return this.navCtrl.push('WalletBackupPage', wallet);
  }

  /**
   *
   *
   * @memberof WalletAddPrivateKeyPage
   */
  goHome() {
    this.navCtrl.setRoot('TabsPage', { animate: true });
  }

  /**
   *
   *
   * @memberof WalletAddPrivateKeyPage
   */
  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);

    // Hide Tabs
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.display = 'none';
      });
    }
  }

  /**
   *
   *
   * @memberof WalletAddPrivateKeyPage
   */
  ionViewDidLeave() {
    this.storage.set('isQrActive', false);
    // show tabs when page is dismissed
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.display = 'flex';
      });
    }
  }

  /**
   *
   *
   * @memberof WalletAddPrivateKeyPage
   */
  ionViewDidLoad() {
    this.storage.set('isQrActive', true);
  }

  // ------------------------------------------------------------------------------------------------------------


















  showSwap() {
    let alert = this.alertCtrl.create({
      title: this.translateService.instant("WALLETS.IMPORT.SWAP_TITLE"),
      message: this.translateService.instant("WALLETS.IMPORT.SWAP_MESSAGE"),
      buttons: [
        {
          text: this.translateService.instant("WALLETS.BUTTON.CANCEL"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translateService.instant("WALLETS.BUTTON.CONTINUE"),
          handler: () => {
            this.showWalletInfoPage(this.nemWallet, this.catapultWallet)
          }
        }
      ]
    });
    alert.present();
  }

  showWalletInfoPage(wallet: SimpleWallet, walletC) {
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

}


