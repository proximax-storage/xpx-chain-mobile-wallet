import { AssetTransferable, Address, TransferTransaction, PlainMessage, Account as AccountNIS1 } from 'nem-library';
import { NemProvider, AccountsInfoNis1Interface } from './../../../../../providers/nem/nem';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingOptions, LoadingController, Platform, AlertController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../../../../../app/app.config'
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';
import { ConfigurationForm, SharedService } from '../../../../../providers/shared-service/shared-service';
import { SimpleWallet, Password, PublicAccount as PublicAccountTsjs, Address as AddressTsjs } from 'tsjs-xpx-chain-sdk';
import { first, timeout } from 'rxjs/operators';

/**
 * Generated class for the WalletInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-info',
  templateUrl: 'wallet-info.html',
})
export class WalletInfoPage {

  password = '';
  blockButton = false;
  maxAmount: number = 0;
  publicAccount: any;
  transferTransaction: TransferTransaction;
  hash: any;
  catapultAccount: SimpleWallet;
  publicKey: string;
  selectedMosaic: AssetTransferable;
  credentials: { password: string; privateKey: string };
  privateKey: string;
  total: number;
  address: Address;
  nis1Account: any;
  recipient = AppConfig.swap.burnAddress;
  optionsXPX = {
    prefix: '',
    thousands: ',',
    decimal: '.',
    precision: '6'
  };
  form: FormGroup;
  amount: number = 0;
  multisig: boolean = false;
  amountPlaceholder: string;
  periodCount: number;
  msgErrorBalance: any;
  coinGecko: any;
  mosaic: { namespaceId: string; mosaicId: string; balance: number; } = {
    namespaceId: 'prx',
    mosaicId: 'xpx',
    balance: 0
  };
  App = App;
  decimalCount: number;
  accountInfoNis1: AccountsInfoNis1Interface;
  insufficientBalance = false;
  configurationForm: ConfigurationForm = {};
  passwordType: string = "password";
  passwordIcon: string = "ios-eye-outline";
  processing = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private nemProvider: NemProvider,
    private proximaxProvider: ProximaxProvider,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public platform: Platform,
    public utils: UtilitiesProvider,
    public alertProvider: AlertProvider,
    public translateService: TranslateService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private sharedService: SharedService
  ) {

    this.configurationForm = this.sharedService.configurationForm;
    const options: LoadingOptions = { content: this.translateService.instant("SERVICES.SWAP_PROCESS.GETTING_INFORMATION") };
    const loader = this.loadingCtrl.create(options);
    loader.present();
    this.nis1Account = this.navParams.data.data.nis1Account;
    this.catapultAccount = Object.assign({}, this.navParams.data.data.catapultAccount);
    this.accountInfoNis1 = this.navParams.data.data.accountInfoNis1;
    this.address = new Address(this.nis1Account.address.value);
    this.maxAmount = this.accountInfoNis1.balance.length;
    this.createForm();
    this.amountChange();
    loader.dismiss();
  }

  /**
   *
   *
   * @memberof WalletInfoPage
   */
  async createTransaction() {
    if (!this.processing) {
      this.processing = true;
      const decrypt = this.proximaxProvider.decryptPrivateKey(new Password(this.form.get("password").value), this.catapultAccount.encryptedPrivateKey.encryptedKey, this.catapultAccount.encryptedPrivateKey.iv);
      if (decrypt) {
        const account = this.nemProvider.createAccountPrivateKey(decrypt);
        const quantity = this.form.get("amount").value;
        const assetId = this.accountInfoNis1.mosaic.assetId;
        const publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(decrypt, this.catapultAccount.network);
        const payloadTx = PlainMessage.create(publicAccount.publicKey);
        const transaction = await this.nemProvider.createTransaction(payloadTx, assetId, quantity);
        this.anounceTransaction(transaction, account, publicAccount);
      }
    }
  }

  /**
   *
   *
   * @param {TransferTransaction} transaction
   * @param {AccountNIS1} account
   * @param {PublicAccountTsjs} siriusAccount
   * @memberof WalletInfoPage
   */
  anounceTransaction(transaction: TransferTransaction, account: AccountNIS1, siriusAccount: PublicAccountTsjs) {
    let options: LoadingOptions = {
      content: this.translateService.instant("SERVICES.SWAP_PROCESS.INITIALIZING_SWAP")
    };
    let loader = this.loadingCtrl.create(options);
    loader.present();
    try {
      this.nemProvider.anounceTransaction(transaction, account).pipe(first()).pipe((timeout(AppConfig.timeOutTransactionNis1))).subscribe(next => {
        if (next && next['message'] && next['message'].toLowerCase() === 'success') {
          this.transferTransaction = transaction;
          this.publicKey = transaction.message.payload;
          this.hash = next['transactionHash'].data;
          this.showSuccessMessage()
          loader.dismiss();
        } else {
          loader.dismiss();
          this.nemProvider.validateCodeMsgError(next['code'], next['message']);
        }
      }, error => {
        loader.dismiss();
        this.nemProvider.validateCodeMsgError(error.error.code, error.error.message);
      });
    } catch (error) {
      loader.dismiss();
    }
  }



  /**
   *
   *
   * @memberof WalletInfoPage
   */
  amountChange() {
    this.form.get('amount').valueChanges.subscribe(value => {
      console.log(value);
      if (value !== null && value !== undefined) {
        if (value > parseFloat(this.accountInfoNis1.balance.split(',').join(''))) {
          this.blockButton = true;
          this.insufficientBalance = true;
        } else if (value === 0) {
          this.blockButton = true;
          this.insufficientBalance = false;
        } else if (value === '0.000000' || value === '0') {
          this.blockButton = true;
          this.insufficientBalance = false;
        } else {
          this.blockButton = false;
          this.insufficientBalance = false;
        }
      } else {
        this.form.get('amount').setValue('0.000000');
      }
    });
  }

  /**
   *
   *
   * @memberof WalletInfoPage
   */
  createForm() {
    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(this.configurationForm.passwordWallet.minLength),
        Validators.minLength(this.configurationForm.passwordWallet.minLength)
      ]]
    });
  }

  /**
   *
   *
   * @memberof WalletInfoPage
   */
  confirmSwap() {
    let alert = this.alertCtrl.create({
      title: this.translateService.instant("SERVICES.SWAP_PROCESS.STEP2.CONFIRM_SWAP.TITLE"),
      message: this.translateService.instant("SERVICES.SWAP_PROCESS.STEP2.CONFIRM_SWAP.MASSAGE"),
      buttons: [{
        text: this.translateService.instant("WALLETS.BUTTON.CANCEL"),
        role: 'cancel',
        handler: () => { }
      }, {
        text: this.translateService.instant("WALLETS.BUTTON.CONTINUE"),
        handler: () => {
          this.createTransaction()
        }
      }]
    });
    alert.present();
  }

  /**
   *
   *
   * @memberof WalletInfoPage
   */
  dismiss() {
    this.viewCtrl.dismiss();
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

  /**
   *
   *
   * @memberof WalletInfoPage
   */
  showSuccessMessage() {
    console.log("NIS1 transaction has been made.")
    this.navCtrl.setRoot('TabsPage', {}, {
      animate: true,
      direction: 'backward'
    });
    this.showWalletCertificate(this.publicKey, this.hash, this.transferTransaction, this.catapultAccount.address);
  }

  /**
   *
   *
   * @param {*} page
   * @param {*} params
   * @memberof WalletInfoPage
   */
  showModal(page: any, params: any) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present().then(_ => {
      this.dismiss();
    })
  }

  /**
   *
   *
   * @memberof WalletInfoPage
   */
  selectMaxAmount() {
    this.form.get('amount').setValue(this.accountInfoNis1.balance.split(',').join(''));
  }

  /**
   *
   *
   * @param {PlainMessage} publicKey
   * @param {*} hash
   * @param {TransferTransaction} transaction
   * @param {AddressTsjs} address
   * @memberof WalletInfoPage
   */
  showWalletCertificate(publicKey: string, hash: any, transaction: TransferTransaction, address: AddressTsjs) {
    const page = "SwapCertificatePage"
    this.showModal(page, {
      publicKey: publicKey,
      transactionHash: hash,
      timestamp: transaction.timeWindow.timeStamp,
      address: address
    });
  }

}
