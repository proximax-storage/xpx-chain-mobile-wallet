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
  catapultWallet: SimpleWallet;
  publicKey: string;
  selectedMosaic: AssetTransferable;
  credentials: { password: string; privateKey: string };
  privateKey: string;
  total: number;
  address: Address;
  nemWallet: any;
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
    const options: LoadingOptions = { content: 'Getting account information...' };
    const loader = this.loadingCtrl.create(options);
    loader.present();
    console.log('------------------> ', this.navParams.data.data);
    this.nemWallet = this.navParams.data.data.nemWallet;
    this.catapultWallet = Object.assign({}, this.navParams.data.data.catapultWallet);
    this.accountInfoNis1 = this.navParams.data.data.accountInfoNis1;
    this.address = new Address(this.nemWallet.address.value);
    this.maxAmount = this.accountInfoNis1.balance.length;
    this.createForm();
    this.amountChange();
    loader.dismiss();
  }


  async createTransaction() {
    if (!this.processing) {
      this.processing = true;
      const decrypt = this.proximaxProvider.decryptPrivateKey(new Password(this.form.get("password").value), this.catapultWallet.encryptedPrivateKey.encryptedKey, this.catapultWallet.encryptedPrivateKey.iv);
      console.log('decrypt', decrypt);
      if (decrypt) {
        const account = this.nemProvider.createAccountPrivateKey(decrypt);
        const quantity = this.form.get("amount").value;
        const assetId = this.accountInfoNis1.mosaic.assetId;
        const publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(decrypt, this.catapultWallet.network);
        const payloadTx = PlainMessage.create(publicAccount.publicKey);
        const transaction = await this.nemProvider.createTransaction(payloadTx, assetId, quantity);
        this.anounceTransaction(transaction, account, publicAccount);
      }
      /*if (this.ownedAccountSwap) {
        if (this.walletService.decrypt(common, this.ownedAccountSwap)) {
          const account = this.nemProvider.createAccountPrivateKey(common['privateKey']);
          const quantity = this.form.get("amount").value;
          //const assetId = this.ownedAccountSwap.mosaic.assetId;
          const assetId = this.accountToSwap.mosaic.assetId;
          // console.log(assetId);
          const msg = PlainMessage.create(this.ownedAccountSwap.publicAccount.publicKey);
          const transaction = await this.nemProvider.createTransaction(msg, assetId, quantity);
          // console.log('\nTRANSACTION CREATED -->', transaction)
          const publicAccount = this.proximaxProvider.createPublicAccount(this.ownedAccountSwap.publicAccount.publicKey);
          this.anounceTransaction(transaction, account, publicAccount);
        } else {
          this.spinnerVisibility = false;
          this.processing = false;
        }
      } else {
        this.router.navigate([`/${AppConfig.routes.home}`]);
      }*/
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
      content: 'Initiating swap...'
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
          // console.log('next --->', next);
          /*this.routeContinue = `/${AppConfig.routes.home}`;
          this.transactionNis1 = {
            siriusAddres: siriusAccount.address.pretty(),
            nis1Timestamp: this.nemProvider.getTimeStampTimeWindow(transaction),
            nis1PublicKey: transaction.signer.publicKey,
            nis1TransactionHash: next['transactionHash'].data
          };
  
          let walletNis1Storage: CurrentWalletTransNis;
          if (this.walletService.getCurrentWallet()) {
            walletNis1Storage = this.walletService.getWalletTransNisStorage().find(el => el.name === this.walletService.getCurrentWallet().name);
          } else {
            walletNis1Storage = this.walletService.getWalletTransNisStorage().find(el => el.name === this.walletService.accountWalletCreated.wallet.name);
          }
  
          const transactionWalletNis1: WalletTransactionsNis1Interface = {
            name: (this.walletService.getCurrentWallet()) ? this.walletService.currentWallet.name : this.walletService.accountWalletCreated.wallet.name,
            transactions: (walletNis1Storage) ? walletNis1Storage.transactions : []
          };
  
          transactionWalletNis1.transactions.push(this.transactionNis1);
          this.nemProvider.saveAccountWalletTransNisStorage(transactionWalletNis1);
          this.processing = false;
          this.spinnerVisibility = false;
          this.showCertifiedSwap = true;
          this.walletService.accountWalletCreated = null;
          this.sharedService.showSuccess('', next['message']);*/
        } else {
          loader.dismiss();
          this.nemProvider.validateCodeMsgError(next['code'], next['message']);
          /*this.showCertifiedSwap = false;
          this.nemProvider.validateCodeMsgError(next['code'], next['message']);
          this.spinnerVisibility = false
          this.processing = false;*/
        }
      }, error => {
        loader.dismiss();
        this.nemProvider.validateCodeMsgError(error.error.code, error.error.message);
        /*this.nemProvider.validateCodeMsgError(error.error.code, error.error.message);
        this.spinnerVisibility = false
        this.processing = false;*/
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
      if (value !== null && value !== undefined) {
        if (value > parseFloat(this.accountInfoNis1.balance.split(',').join(''))) {
          this.blockButton = true;
          this.insufficientBalance = true;
        } else if (value === 0) {
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
    this.showWalletCertificate(this.publicKey, this.hash, this.transferTransaction, this.catapultWallet.address);
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
