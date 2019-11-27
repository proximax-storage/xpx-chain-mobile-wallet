import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AccountInfo, SimpleWallet, Password } from 'tsjs-xpx-chain-sdk';

import { ToastProvider } from '../../../../providers/toast/toast';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationForm, SharedService } from '../../../../providers/shared-service/shared-service';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { AlertProvider } from '../../../../providers/alert/alert';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the WalletDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-details',
  templateUrl: 'wallet-details.html',
})
export class WalletDetailsPage {
  accountInfo: AccountInfo;
  currentWallet: SimpleWallet;
  form: FormGroup;
  walletName: string = '';
  totalBalance: number;
  selectedAccount: any;
  passwordType: string = "password";
  passwordIcon: string = "ios-eye-outline";
  pass: boolean = false;
  export: boolean = true;
  deletePass: boolean = false;
  delete: boolean = true;
  configurationForm: ConfigurationForm = {};
  privateKey: string = '';
  amountXpx: any;


  constructor(
    public alertProvider: AlertProvider,
    private clipboard: Clipboard,
    public formBuilder: FormBuilder,
    private haptic: HapticProvider,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private proximaxProvider: ProximaxProvider,
    private socialSharing: SocialSharing,
    private sharedService: SharedService,
    private toastProvider: ToastProvider,
    private translateService: TranslateService,
    private viewCtrl: ViewController,
  ) {
    console.log("SIRIUS CHAIN WALLET: WalletDetailsPage -> this.navParams.data", this.navParams.data)
    this.configurationForm = this.sharedService.configurationForm;
    this.totalBalance = this.navParams.get('totalBalance');
    this.amountXpx = this.navParams.get('amountXpx');
    this.selectedAccount = this.navParams.get('selectedAccount');
    this.createForm();
  }


  copy(address) {
    this.clipboard.copy(address).then(_ => {
      this.toastProvider.show(this.translateService.instant("WALLETS.DETAIL.COPY_ADDRESS"), 3, true);
    });
  }


  createForm() {
    // Initialize form
    this.form = this.formBuilder.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.configurationForm.passwordWallet.minLength),
          Validators.minLength(this.configurationForm.passwordWallet.minLength)
        ]
      ]
    });
  }
  
  /**
 *
 *
 * @param {Event} e
 * @memberof WalletInfoPage
 */
  showHidePassword(e: Event) {
    e.preventDefault();
    this.passwordType = this.passwordType === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
  }

  showExportPrivateKeyModal() {
    this.pass = true;
    this.export = false
    this.deletePass = false;
    this.delete = true
    this.form.get("password").setValue('');
  }

  cancel(val) {
    if (val === 1) {
      this.pass = false;
      this.export = true
    } else {
      this.deletePass = false;
      this.delete = true
    }
    this.form.get("password").setValue('');
  }

  aceptar(val) {
    this.privateKey = ''
    let password = new Password(this.form.get("password").value);
    const iv = this.selectedAccount.account.encryptedPrivateKey.iv;
    const encryptedKey = this.selectedAccount.account.encryptedPrivateKey.encryptedKey;
    this.privateKey = this.proximaxProvider.decryptPrivateKey(password, encryptedKey, iv);
    
    if (this.privateKey && this.privateKey !== '' && (this.privateKey.length === 64 || this.privateKey.length === 66) ) {
      if (val === 1) {
        this.pass = false;
        this.export = true

        this.haptic.notification({ type: 'success' });
        this.socialSharing
          .share(
            `Private key of ${this.selectedAccount.account.name}: \n${this.privateKey}`,
            null,
            null,
            null
          )
          .then(_ => {
            this.dismiss();
          });
      } else {
        this.deletePass = false;
        this.delete = true
    let page = "WalletDeletePage";
    this.showModal(page, { wallet: this.selectedAccount });
      }
      this.form.get("password").setValue('');
    } else {
      this.alertProvider.showMessage(this.translateService.instant("APP.INVALID.PASSWORD"));
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showWalletUpdate() {
    let page = "WalletUpdatePage";
    this.showModal(page, { wallet: this.selectedAccount, amountXpx:this.amountXpx,  totalBalance: this.totalBalance});
  }

  showWalletDelete() {
    this.deletePass = true;
    this.delete = false
    this.pass = false;
    this.export = true
    this.form.get("password").setValue('');
  }

  showModal(page, params) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletDetailsPage');
  }

}

