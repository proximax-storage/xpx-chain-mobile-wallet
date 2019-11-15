import { AssetTransferable, Address, TransferTransaction, PlainMessage } from 'nem-library';
import { NemProvider, AccountsInfoNis1Interface } from './../../../../../providers/nem/nem';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingOptions, LoadingController, Platform, AlertController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../../../../../app/app.config'
import { HapticProvider } from '../../../../../providers/haptic/haptic';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';
import { ConfigurationForm, SharedService } from '../../../../../providers/shared-service/shared-service';
import { SimpleWallet, Password } from 'tsjs-xpx-chain-sdk';

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
  message: PlainMessage;
  selectedMosaic: AssetTransferable;
  credentials: { password: string; privateKey: string };
  privateKey: string;
  total: number;
  address: Address;
  nemWallet: any;
  recipient = AppConfig.swap.burnAccountAddress
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
    private haptic: HapticProvider,
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
    // this.privateKey = this.navParams.data.data.privateKey;
    this.accountInfoNis1 = this.navParams.data.data.accountInfoNis1;
    this.createForm();
    this.address = new Address(this.nemWallet.address.value);
    this.maxAmount = this.accountInfoNis1.balance.length;
    this.amountChange();
    loader.dismiss();

    /*this.address = new Address(this.nemWallet.address.value);
    // 1. Get wallet info
    this.getAccountInfo(this.address);
    // 2. Get mosaics
    this.ownedMosaics(this.address);
    // 3. Display XPX and ask for amount to be converted
    // TODO: Reuse Send Mosaic Page - ETA 30 mins
    // 4. Subscribe to amount change
    this.onAmountChange();
    // 5. Get coin price
    this.coingeckoProvider.getDetails('proximax').subscribe(coin => {
      this.coinGecko = coin;
    });
    // 6. Get password  
    this.authProvider.getPassword().then(password => {
      console.log('password', password)
      this.credentials = {
        password: password,
        privateKey: ''
      };
    })
    loader.dismiss(); */
  }


  async createTransaction() {
    if (!this.processing) {
      this.processing = true;
      const decrypt = this.proximaxProvider.decryptPrivateKey(new Password(this.form.get("password").value), this.catapultWallet.encryptedPrivateKey.encryptedKey, this.catapultWallet.encryptedPrivateKey.iv); 
      console.log('decrypt', decrypt);
      if (decrypt) {

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
   * @param {Event} e
   * @memberof WalletInfoPage
   */
  showHidePassword(e: Event) {
    e.preventDefault();
    this.passwordType = this.passwordType === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
  }

  // ------------------------------------------------------------------------------------

  confirmSwap() {
    let alert = this.alertCtrl.create({
      title: this.translateService.instant("SERVICES.SWAP_PROCESS.STEP2.CONFIRM_SWAP.TITLE"),
      message: this.translateService.instant("SERVICES.SWAP_PROCESS.STEP2.CONFIRM_SWAP.MASSAGE"),
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
            this.onSubmit()
          }
        }
      ]
    });
    alert.present();

  }

  async onSubmit() {
    let options: LoadingOptions = {
      content: 'Initiating swap...'
    };
    let loader = this.loadingCtrl.create(options);

    loader.present();
    let quantity = this.form.get('amount').value;

    if (this.multisig) {
      // console.log('es multifirma', transferTransaction);

    } else {

      if (this._allowedToSendTx()) {

        console.log("TCL: onSubmit -> this.credentials.privateKey", this.credentials.privateKey)
        // return;

        const publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(this.privateKey, AppConfig.sirius.networkType)
        console.log('this.publicAccount publicKey', publicAccount.publicKey)

        const account = this.nemProvider.createAccountPrivateKey(this.privateKey);
        console.log('this.account', account)

        const transaction = await this.nemProvider.createTransaction(publicAccount.publicKey, this.selectedMosaic.assetId, quantity);
        this.transferTransaction = transaction;

        console.log('this.transferTransaction', this.transferTransaction)

        this.nemProvider.anounceTransaction(transaction, account)
          .then(resp => {
            this.hash = resp.transactionHash;
            this.showSuccessMessage()
            loader.dismiss();
          })
          .catch(error => {
            this.showErrorMessage(error)
          });
      } else {
        this.showGenericError();
      }
    }

  }


  ownedMosaics(address: Address) {
    console.log()
    this.nemProvider.getOwnedMosaics(address).subscribe(mosaics => {
      // console.log('LOG: WalletInfoPage -> ownedMosaics -> mosaics', mosaics);
      let xpx = mosaics.filter(m => {
        return m.assetId.name === 'xpx' && m.assetId.namespaceId === 'prx'
      })
      // console.log('LOG: WalletInfoPage -> ownedMosaics -> xpx', xpx);
      if (xpx) {
        const XPX = xpx[0];
        this.selectedMosaic = XPX;
        this.mosaic = {
          namespaceId: XPX.assetId.namespaceId,
          mosaicId: XPX.assetId.name,
          balance: XPX.quantity
        }
      }
    })
  }



  /**
 * User checking if it can do the send transaction.
 */
  private _allowedToSendTx() {
    if (this.credentials.password) {
      try {
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  showSuccessMessage() {
    console.log("NIS1 transaction has been made.")
    // this.navCtrl.setRoot(
    //   'TabsPage',
    //   {},
    //   {
    //     animate: true,
    //     direction: 'backward'
    //   }
    // );
    // this.showWalletCertificate(this.message, this.hash, this.transferTransaction, this.catapultWallet.address);
  }

  showWalletCertificate(publicKey: PlainMessage, hash: any, transaction: TransferTransaction, address: Address) {
    const page = "SwapCertificatePage"
    this.showModal(page, {
      publicKey: publicKey,
      transactionHash: hash,
      timestamp: transaction.timeWindow.timeStamp,
      address: address
    });

  }

  showModal(page, params) {
    console.log("TCL: showModal -> params", params)
    console.log("Showing modal");
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present().then(_ => {
      this.dismiss();
    })
  }

  showErrorMessage(error) {
    this.haptic.notification({ type: 'warning' });
    console.log(error);
    if (error.toString().indexOf('FAILURE_INSUFFICIENT_BALANCE') >= 0) {
      this.alertProvider.showMessage(
        'Sorry, you don\'t have enough balance to continue the transaction.'
      );
    } else if (
      error.toString().indexOf('FAILURE_MESSAGE_TOO_LARGE') >= 0
    ) {
      this.alertProvider.showMessage(
        'The note you entered is too long. Please try again.'
      );
    } else if (error.statusCode == 404) {
      this.alertProvider.showMessage(
        'This address does not belong to this network'
      );
    } else if (error.toString().indexOf('FAILURE_TRANSACTION_NOT_ALLOWED_FOR_MULTISIG') >= 0) {
      this.alertProvider.showMessage(
        'Transaction is not allowed for multisignature enabled wallets.'
      );
    } else {
      // this.alertProvider.showMessage(
      //   'An error occured. Please try again.'
      // );
      this.alertProvider.showMessage(
        error
      );
    }
  }

  showGenericError() {
    this.translateService.get('APP.ERROR').subscribe(
      value => {
        let alertTitle = value;
        this.alertProvider.showMessage(alertTitle);
      });

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  countDecimals(value) {
    if (Math.floor(value) !== value)
      return value.toString().split(".")[1].length || 0;
    return 0;
  }

  /*checkAllowedInput(e) {
    const AMOUNT = this.form.get('amount').value;
    console.log("LOG: WalletInfoPage -> checkAllowedInput -> AMOUNT", AMOUNT);

    // Prevent "+" and "-"
    if (e.key === "-" || e.key === "+" || e.charCode === 43 || e.charCode === 45 || e.keyCode === 189 || e.keyCode === 187 || e.key === "Unindentified" || e.keyCode === 229) {
      e.preventDefault();
      if (AMOUNT == null) {
        this.form.get('amount').setValue("")
        this.form.get('amount').reset();
        this.periodCount = 0
      }
    }

    if (AMOUNT == null) {
      this.periodCount = 0;
    }

    if (this.decimalCount >= 6 && e.key !== "Backspace") {
      e.preventDefault();
    }

    if ((e.charCode >= 48 && e.charCode <= 57) || (e.key == "." || e.charCode == 46 || e.keyCode == 8 || e.key == "Backspace")) {

      // Check for "." or char code "46"
      if (e.key == "." || e.charCode == 46) {
        ++this.periodCount;
      }

      if (this.periodCount > 1) {
        e.preventDefault();
        --this.periodCount;
      }
      console.log("LOG: WalletInfoPage -> checkAllowedInput -> this.periodCount", this.periodCount);
    }
  }*/



}
