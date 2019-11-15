import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SimpleWallet as SimpleWalletNEM, Password } from 'nem-library';
import { TranslateService } from '@ngx-translate/core';

import { App } from '../../../../providers/app/app';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../providers/auth/auth';
import { AlertProvider } from '../../../../providers/alert/alert';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { NemProvider, AccountsInfoNis1Interface } from '../../../../providers/nem/nem';
import { SharedService, ConfigurationForm } from '../../../../providers/shared-service/shared-service';
import { SimpleWallet } from 'tsjs-xpx-chain-sdk';
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

  checkSwap = false;
  catapultWallet: SimpleWallet;
  nemWallet: SimpleWalletNEM;
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
        const existAccount = await this.walletProvider.validateExistAccount(this.catapultWallet);
        if (!existAccount) {
          this.nemWallet = this.nem.createPrivateKeyWallet(form.name, form.password, form.privateKey);
          // this.walletProvider.checkIfWalletNameExists(this.catapultWallet.name, this.catapultWallet.address.plain()).then(async value => {

          this.walletProvider.storeWalletCatapult(this.catapultWallet, this.walletColor, new Password(form.password)).then(_ => {
            this.goToBackup(this.catapultWallet);
          });

          console.log('this.nemWallet', this.nemWallet);
          const nis1Wallet = this.nem.createAccountPrivateKey(form.privateKey);
          const publicAccount = this.nem.createPublicAccount(nis1Wallet.publicKey);
          if (this.checkSwap) {
            this.nem.getAccountInfoNis1(publicAccount, form.name).then((data: AccountsInfoNis1Interface) => {
              if (data) {
                this.showSwap(data);
              }
            });
          }

          /*this.nem.getOwnedMosaics(this.nemWallet.address).subscribe(mosacis => {
            for (let index = 0; index < mosacis.length; index++) {
              const element = mosacis[index];
              if (element.assetId.name === 'xpx' && element.assetId.namespaceId === 'prx') {
                this.walletProvider.storeWalletNis1(this.catapultWallet, this.nemWallet, this.walletColor).then(_ => {
                  this.showSwap();
                });
              }
            }
          });*/
          // });
        } else {
          this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.NAME_EXISTS"));
        }
      } else {
        this.alertProvider.showMessage('Invalid password');
      }
    } catch (error) {
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
  goToBackup(wallet: any) {
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

  /**
   *
   *
   * @param {AccountsInfoNis1Interface} data
   * @memberof WalletAddPrivateKeyPage
   */
  showSwap(data: AccountsInfoNis1Interface) {
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
          handler: () => this.showWalletInfoPage(this.nemWallet, this.catapultWallet, data)
        }
      ]
    });
    alert.present();
  }

  /**
   *
   *
   * @param {SimpleWalletNEM} nemWallet
   * @param {SimpleWallet} catapultWallet
   * @param {AccountsInfoNis1Interface} data
   * @memberof WalletAddPrivateKeyPage
   */
  showWalletInfoPage(nemWallet: SimpleWalletNEM, catapultWallet: SimpleWallet, data: AccountsInfoNis1Interface) {
    const page = "WalletInfoPage"
    this.showModal(page, {
      nemWallet: nemWallet,
      catapultWallet: catapultWallet,
      accountInfoNis1: data
    });
  }

  /**
   *
   *
   * @param {*} page
   * @param {*} params
   * @memberof WalletAddPrivateKeyPage
   */
  showModal(page: any, params: any) {
    const modal = this.modalCtrl.create(page, { data: params }, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  /**
   *
   *
   * @memberof WalletAddPrivateKeyPage
   */
  updateName() {
    let name = this.formGroup.value.name
    if (name) {
      this.walletName = name;
    } else {
      this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    }
  }
}


