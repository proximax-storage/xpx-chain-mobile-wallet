import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { SimpleWallet as SimpleWalletNEM, Password } from 'nem-library';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../../../../app/app.config';
import { App } from '../../../../providers/app/app';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../providers/auth/auth';
import { AlertProvider } from '../../../../providers/alert/alert';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { NemProvider, AccountsInfoNis1Interface } from '../../../../providers/nem/nem';
import { SharedService, ConfigurationForm } from '../../../../providers/shared-service/shared-service';
import { SimpleWallet } from 'tsjs-xpx-chain-sdk';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { ContactsProvider } from '../../../../providers/contacts/contacts';
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
  catapultAccount: SimpleWallet;
  nis1Account: SimpleWalletNEM;
  App = App;
  formGroup: FormGroup;

  PASSWORD: string;

  accountColor: string = "wallet-1";
  walletName: string = "Primary";

  tablet: boolean = false;
  configurationForm: ConfigurationForm = {};
  passwordType: string = "password";
  passwordIcon: string = "ios-eye-outline";
  privateKey: any;
  prefix: any;
  nameMin: boolean;
  nameMax: boolean;
  exampleAccount = AppConfig.accountExample


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
    private translateService: TranslateService,
    private modalCtrl: ModalController,
    private sharedService: SharedService,
    private barcodeScanner: BarcodeScanner,
    private proximaxProvider: ProximaxProvider,
    public contactsProvider: ContactsProvider,
  ) {
    this.accountColor = 'wallet-1';
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

        this.privateKey = form.privateKey;
        this.prefix = '';
        if (this.privateKey.length > 64) {
          const newPrivateKey = this.privateKey;
          this.prefix = newPrivateKey.slice(0, -64);
          this.privateKey = newPrivateKey.slice(2);
        }

        this.catapultAccount = this.walletProvider.createAccountFromPrivateKey(form.name, form.password, this.privateKey);
        const existAccount = await this.walletProvider.validateExistAccount(this.catapultAccount);
        if (!existAccount) {
          this.nis1Account = this.nem.createPrivateKeyWallet(form.name, form.password, form.privateKey);
          this.walletProvider.storeWalletCatapult(this.catapultAccount, this.nis1Account, this.accountColor, new Password(form.password), this.prefix).then(_ => {
            
            const data = {
              name: form.name.replace(" ", "-").concat('-owner'),
              address: this.catapultAccount.address.plain(),
              telegram: ""
            }
            this.contactsProvider.push(data)
            this.goToBackup(this.catapultAccount, form.privateKey, form.password);
          });

          const nis1Account = this.nem.createAccountPrivateKey(form.privateKey);
          const publicAccount = this.nem.createPublicAccount(nis1Account.publicKey);
          if (this.checkSwap) {
            this.nem.getAccountInfoNis1(publicAccount, form.name).then((data: AccountsInfoNis1Interface) => {
              if (data) {
                this.showSwap(data);
              }
            });
          }
        } else {
          this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.NAME_EXISTS"));
        }
      } else {
        this.alertProvider.showMessage(this.translateService.instant("APP.INVALID.PASSWORD"));
      }
    } catch (error) {
      console.log(error);

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
        Validators.maxLength(this.configurationForm.privateKey.maxLength)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(this.configurationForm.passwordWallet.minLength),
        Validators.maxLength(this.configurationForm.passwordWallet.maxLength)
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
  changeAccountColor(color: string) {
    this.accountColor = color;
  }

  /**
   *
   *
   * @param {*} wallet
   * @returns
   * @memberof WalletAddPrivateKeyPage
   */
  goToBackup(wallet: SimpleWallet, privateKey: string, password: string) {
    return this.navCtrl.push('WalletBackupPage', { wallet: wallet, privateKey: privateKey, password: password });
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
  }

  minName() {
    let name = this.formGroup.controls.name.value;
    if (name.length < this.configurationForm.nameWallet.minLength) {
      this.nameMin = true;
    } else if (name.length > this.configurationForm.nameWallet.maxLength) {
      this.nameMax = true;
    } else {
      this.nameMin = false
      this.nameMax = false;
    }
  }

  scan() {
    
    this.barcodeScanner.scan().then(barcodeData => {
      barcodeData.format = "QR_CODE";
      if (barcodeData.text.length === 64 || barcodeData.text.length === 66 && this.proximaxProvider.isHexString(barcodeData.text)) {
        this.formGroup.patchValue({ privateKey: barcodeData.text })
      } else {
        this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.PRIVATE_KEY_INVALID"))
      }
    })
      .catch(err => {
        console.log("Error", err);
        if (
          err
            .toString()
            .indexOf(
              this.translateService.instant("WALLETS.SEND.ERROR.CAMERA1")
            ) >= 0
        ) {
          let message = this.translateService.instant("WALLETS.SEND.ERROR.CAMERA2");
          this.alertProvider.showMessage(message);
        }
      });
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
          handler: () => this.showWalletInfoPage(this.nis1Account, this.catapultAccount, data)
        }
      ]
    });
    alert.present();
  }

  /**
   *
   *
   * @param {SimpleWalletNEM} nis1Account
   * @param {SimpleWallet} catapultAccount
   * @param {AccountsInfoNis1Interface} data
   * @memberof WalletAddPrivateKeyPage
   */
  showWalletInfoPage(nis1Account: SimpleWalletNEM, catapultAccount: SimpleWallet, data: AccountsInfoNis1Interface) {
    const page = "WalletInfoPage"
    this.showModal(page, {
      nis1Account: nis1Account,
      catapultAccount: catapultAccount,
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
   * @param {Event} e
   * @memberof WalletAddPrivateKeyPage
   */
  showHidePassword(e: Event) {
    e.preventDefault();
    this.passwordType = this.passwordType === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
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


