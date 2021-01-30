import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
import { IonicPage, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import {
  Address,
  MosaicAmountView,
  MultisigAccountInfo,
  PublicAccount,
  SimpleWallet,
} from 'tsjs-xpx-chain-sdk';

import { AlertProvider } from '../../../../providers/alert/alert';
import { App } from '../../../../providers/app/app';
import { GetBalanceProvider } from '../../../../providers/get-balance/get-balance';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';

/**
 * Generated class for the SendMultisigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-multisig',
  templateUrl: 'send-multisig.html',
})
export class SendMultisigPage {
  App = App;

  addressSourceType: { from: string; to: string };
  currentWallet: SimpleWallet;
  selectedMosaic: MosaicAmountView[];
  selectedCoin: any;

  form: FormGroup;
  fee: number = 0;
  amount: number = 0;
  mosaicSelectedName: string;

  // Multisig
  multisigAccounts: MultisigAccountInfo[];
  selectedAccount: PublicAccount;
  selectedAccountAddress: string;
  accountInfo: MultisigAccountInfo;
  isMultisig: boolean;
  multisigAccountAddress: Address;

  amountPlaceholder: string = "0";

  periodCount = 0;
  decimalCount: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private proximaxProvider: ProximaxProvider,
    public getBalanceProvider: GetBalanceProvider,
    public walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
    public alertProvider: AlertProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage,
    public platform: Platform
  ) {
    console.log("Nav params", this.navParams.data);

    this.mosaicSelectedName = this.navParams.get('mosaicSelectedName');
    console.log(this.mosaicSelectedName);

    // If no mosaic selected, fallback to xpx
    if (!this.mosaicSelectedName) {
      this.mosaicSelectedName = 'xpx';
    }

    this.init();
  }

  onAccountSelected() {
    if (this.multisigAccounts) {
      this.selectedAccount = this.multisigAccounts.map(multisigAccount => multisigAccount.account).find(multisigAccount => multisigAccount.address.plain() === this.selectedAccountAddress);
      console.log("Selected account", this.selectedAccount); 

      this.getMosaics();
    }
  }

  getAccountInfo() {
    console.info("Getting account information.", this.currentWallet.address)
    this.proximaxProvider.getMultisigAccountInfo(this.currentWallet.address).subscribe(accountInfo => {
        if (accountInfo) {
          this.accountInfo = accountInfo;

          if (this.accountInfo.isMultisig()) {
            console.clear();
            console.log("This is a multisig account");
            this.isMultisig = true;

            
            this.multisigAccounts = [this.accountInfo]; // get multisig accounts the user has

            if(!this.selectedAccount) {
              this.selectedAccount = this.multisigAccounts[0].account; // select first account as default
              this.selectedAccountAddress = this.multisigAccounts[0].account.address.plain();
              this.multisigAccountAddress = this.multisigAccounts[0].account.address;
            }

            console.log("accountInfo", this.accountInfo)
            console.log("Multisig accounts", this.multisigAccounts)

            // Get Mosaic list + balance
            this.getMosaics();


          }

        }
      });
  }

  ionViewWillEnter() {
    // this.utils.setHardwareBack(this.navCtrl);
    console.log('ionViewWillEnter SendMultisigPage');
    this.walletProvider.getSelectedWallet().then(currentWallet => {
      if (currentWallet) {
        this.currentWallet = currentWallet;
        this.getAccountInfo(); // Get multisig account info
      }
    });



  }
  getMosaics() {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendMultisigPage');
  }

  ionViewDidLeave() {
  }


  init() {

    console.log('Init called');
    // Initialize form
    this.form = this.formBuilder.group({
      senderName: '',
      senderAddress: ['', Validators.required],

      recipientName: '',
      recipientAddress: ['', Validators.required],

      isMosaicTransfer: [false, Validators.required],
      message: ['', Validators.required],
      amount: ['', Validators.required],
      fee: ['', Validators.required],

      selectedAccountAddress: '',
    });

    // Initialize source type of NEM address in from and to
    this.addressSourceType = {
      from: 'contact',
      to: 'contact'
    };

    // Defaults to manual contact input
    this.addressSourceType.to = 'manual';

    if (this.addressSourceType.to === 'manual') {
      this.form.get('recipientAddress').setValue('');
    }

    this.fee = 0;
    this.amount = null;
  }

  onChangeFrom(val) {
    if (val === 'manual') {
      this.form.get('senderName').setValue(null);
      this.form.get('senderAddress').setValue(null);
    } else {
      this.form.get('senderName').setValue('Current wallet');
      this.form
        .get('senderAddress')
        .setValue(this.currentWallet.address.plain());
    }
  }

  onChangeTo(val) {
    if (val === 'manual') {
      this.form.get('recipientName').setValue(null);
      this.form.get('recipientAddress').setValue(null);
    }

    if (val === 'qrcode') {
      this.scan();
    }
  }

  selectMosaic() {

  }

  selectContact(title) {
    this.utils
      .showInsetModal('SendContactSelectPage', { title: title })
      .subscribe(data => {
        if (data != undefined || data != null) {
          this.form.get('recipientName').setValue(data.name);
          this.form.get('recipientAddress').setValue(data.address);
        }
      });
  }


  /**
   * Sets transaction amount and determine if it is mosaic or xem transaction, updating fees
   */
  onSubmit() {
 
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      barcodeData.format = "QR_CODE";
      let payload = JSON.parse(barcodeData.text);
      this.form.patchValue({ recipientName: payload.data.name })
      this.form.patchValue({ recipientAddress: payload.data.addr })
    }).catch(err => {
      console.log('Error', err);
      // this.alertProvider.showMessage(err);
      if (err.toString().indexOf('Access to the camera has been prohibited; please enable it in the Settings app to continue.') >= 0) {
        let message = "Camera access is disabled. Please enable it in the Settings app."
        this.alertProvider.showMessage(message);
      }
    });
  }

  clearPlaceholder() {
    this.amountPlaceholder = "";
  }

  countDecimals(value) {
    if (Math.floor(value) !== value)
      return value.toString().split(".")[1].length || 0;
    return 0;
  }

  checkAllowedInput(e) {
    const AMOUNT = this.form.get('amount').value;
    console.log("LOG: SendPage -> checkAllowedInput -> AMOUNT", AMOUNT);

    // Prevent "+" and "-"
    if (e.key === "-" || e.key === "+" || e.charCode === 43 || e.charCode === 45 || e.keyCode === 	189 || e.keyCode === 187 || e.key === "Unindentified" || e.keyCode === 229 ) {
      e.preventDefault();
      if(AMOUNT==null) {
        this.form.get('amount').setValue("")
        this.form.get('amount').reset();
        this.periodCount = 0
      }
    }

    if(AMOUNT==null) {
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
      console.log("LOG: SendPage -> checkAllowedInput -> this.periodCount", this.periodCount);    
    }
  }

  validateInput() {
    const AMOUNT = this.form.get('amount').value;
    if (AMOUNT) {
      this.decimalCount = this.countDecimals(AMOUNT);
    }
  }


}
