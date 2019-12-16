import { AppConfig } from './../../../../app/app.config';
import { GetBalanceProvider } from "./../../../../providers/get-balance/get-balance";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ModalController,
  Platform
} from "ionic-angular";

import { App } from "../../../../providers/app/app";
import { NemProvider } from "./../../../../providers/nem/nem";
import { WalletProvider } from "./../../../../providers/wallet/wallet";
import { UtilitiesProvider } from "../../../../providers/utilities/utilities";
import { AlertProvider } from "../../../../providers/alert/alert";

import { CoingeckoProvider } from "../../../../providers/coingecko/coingecko";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Storage } from "@ionic/storage";
import { MosaicsProvider } from "../../../../providers/mosaics/mosaics";
import { ProximaxProvider } from "../../../../providers/proximax/proximax";
import { TranslateService } from "@ngx-translate/core";
import { DefaultMosaic } from "../../../../models/default-mosaic";
import { SharedService, ConfigurationForm } from '../../../../providers/shared-service/shared-service';
import { Password, MosaicId } from 'tsjs-xpx-chain-sdk';
import { emit } from 'cluster';

/**
 * Generated class for the SendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-send",
  templateUrl: "send.html"
})
export class SendPage {
  wallet: string;
  msgErrorBalance: any;
  msgErrorUnsupported: any;
  mosaics: DefaultMosaic[] = [];
  App = App;
  addressSourceType: { from: string; to: string };
  currentWallet: any;
  selectedMosaic: DefaultMosaic = new DefaultMosaic({ namespaceId: 'prx', mosaicId: 'xpx', hex: AppConfig.xpxHexId, name:'prx.xpx', amount: 0, amountCompact: 0, divisibility: 0 });
  selectedCoin: any;
  form: FormGroup;
  fee: number = 0;
  amount: number = 0;
  selectedMosaicName: string;
  periodCount = 0;
  decimalCount: number = 0;
  optionsXPX = {
    prefix: "",
    thousands: ",",
    decimal: ".",
    precision: "6"
  };
  passwordType: string = "password";
  passwordIcon: string = "ios-eye-outline";
  payload: any = {};
  configurationForm: ConfigurationForm = {};
  address: any;
  maxAmount: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public nemProvider: NemProvider,
    public getBalanceProvider: GetBalanceProvider,
    public walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
    public alertProvider: AlertProvider,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private coingeckoProvider: CoingeckoProvider,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage,
    public platform: Platform,
    public mosaicsProvider: MosaicsProvider,
    private proximaxProvider: ProximaxProvider,
    private translateService: TranslateService,
    private sharedService: SharedService
  ) {
    // console.log("TCL: SendPage -> this.navParams.data", JSON.stringify(this.navParams.data));
    this.selectedMosaicName = this.navParams.get("mosaicSelectedName");
    this.configurationForm = this.sharedService.configurationForm;
    
    // If no mosaic selected, fallback to xpx
    if (!this.selectedMosaicName) {
      this.selectedMosaicName = "xpx";
    }
    this.createForm();
    this.subscribeValue();
    this.amount = 0;
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
    this.walletProvider.getAccountSelected().then(currentWallet => {

      if (!currentWallet) {
        this.navCtrl.setRoot(
          "TabsPage",
          {},
          {
            animate: true,
            direction: "backward"
          }
        );
      } else {
        this.currentWallet = currentWallet;
        console.log('this.currentWalle', this.currentWallet);

        this.address = this.proximaxProvider.createFromRawAddress(this.currentWallet.account.address.address)
        this.wallet = this.address.plain();
        console.log(' this.wallet', this.wallet);

        this.mosaicsProvider
          .getMosaics(this.address)
          .subscribe(mosaics => {
            this.mosaics = mosaics;

            mosaics.forEach(_mosaic => {
              if (_mosaic.mosaicId === this.selectedMosaicName) {
                this.selectedMosaic = this.selectedMosaic.divisibility === 0 ? _mosaic : this.selectedMosaic;
                console.log('trae name', this.selectedMosaic);
                if(this.selectedMosaic.mosaicId === 'xpx'){
                  this.selectedMosaic.name = 'prx.xpx';
                }
                // this.selectedMosaic.name = 'prx.xpx';
              }

              // console.log('selectedMosaic', this.selectedMosaic);
              
              let mosaicId = _mosaic.mosaicId;
              let coinId: string;

              if (mosaicId === "xpx") {
                coinId = "proximax";
              } else if (mosaicId === "npxs") {
                coinId = "pundi-x";
              }

              // Get coin price
              // Check if  null
              if (coinId) {
                this.coingeckoProvider.getDetails(coinId).subscribe(coin => {
                  this.selectedCoin = coin;
                });
              }
            });
          });
        // Set sender address to currenWallet.address
        this.form.get("senderName").setValue(this.currentWallet.name);
        this.form.get("senderAddress").setValue(this.currentWallet.address);
      }
    });

    // if deeplink
    this.payload = this.navParams.data;
    if (this.payload.amount) {
      this.form.patchValue({ amount: this.payload.amount });
      this.form.patchValue({ recipientAddress: this.payload.address });
      this.form.patchValue({ message: this.payload.message });
    }

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SendPage");
  }

  // ionViewDidLeave() {
  //   // this.storage.set("isQrActive", false);
  // }

  createForm() {
    this.storage.set("isQrActive", true);
    // Initialize form
    this.form = this.formBuilder.group({
      senderName: "",
      senderAddress: [""],
      recipientName: "",
      recipientAddress: [
        "",
        [
          Validators.required,
          Validators.minLength(this.configurationForm.address.minLength),
          Validators.maxLength(this.configurationForm.address.maxLength)
        ]
      ],
      isMosaicTransfer: [false, Validators.required],
      message: ["", [Validators.maxLength(this.configurationForm.message.maxLength)]],
      amount: [
        "",
        [
          Validators.required,
        ]
      ],
      fee: [""],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.configurationForm.passwordWallet.minLength),
          Validators.maxLength(this.configurationForm.passwordWallet.maxLength)
        ]
      ]
    });

    // Initialize source type of NEM address in from and to
    this.addressSourceType = {
      from: "contact",
      to: "contact"
    };

    // Defaults to manual contact input
    this.addressSourceType.to = "manual";
    if (this.addressSourceType.to === "manual") {
      this.form.get("recipientAddress").setValue("");
    }

    this.fee = 0;
    this.amount = null;
  }

  getAbsoluteAmount(amount, divisibility) {
    const amountFormatter = this.proximaxProvider.amountFormatter(amount, divisibility)
    //   this.maxAmount = String(amountFormatter).length
    //   console.log('this.maxAmount', this.maxAmount);
    return amountFormatter;
  }

  subscribeValue() {
    // Account recipient
    this.form.get("recipientAddress").valueChanges.subscribe(value => {
      console.log("value", value);
      const accountRecipient = value !== undefined && value !== null && value !== "" ? value.split("-").join("") : "";

      if (accountRecipient !== null && accountRecipient !== undefined && accountRecipient.length === 40) {
        if (!this.proximaxProvider.verifyNetworkAddressEqualsNetwork(this.wallet, accountRecipient)) {
          // this.blockSendButton = true;
          this.msgErrorUnsupported = this.translateService.instant("WALLETS.SEND.ADDRESS.UNSOPPORTED");
        } else {
          // this.blockSendButton = false;
          this.msgErrorUnsupported = "";
        }
      } else {
        // this.blockSendButton = true;
        this.msgErrorUnsupported = this.translateService.instant("WALLETS.SEND.ADDRESS.INVALID");
      }
    });

    this.form.get("amount").valueChanges.subscribe(value => {
      if (value > this.selectedMosaic.amount) {
        this.msgErrorBalance = this.translateService.instant("WALLETS.SEND.ERROR.BALANCE");
      } else {
        this.msgErrorBalance = "";
      }
    });
  }

  onChangeFrom(val) {
    if (val === "manual") {
      this.form.get("senderName").setValue(null);
      this.form.get("senderAddress").setValue(null);
    } else {
      this.form.get("senderName").setValue("Current wallet");
      this.form.get("senderAddress").setValue(this.address.plain());
    }
  }

  onChangeTo(val) {
    if (val === "manual") {
      this.form.get("recipientName").setValue(null);
      this.form.get("recipientAddress").setValue(null);
    }
    if (val === "qrcode") {
      this.scan();
    }
  }

  selectMosaic() {
    this.utils.showInsetModal("SendMosaicSelectPage", {
      selectedMosaic: this.selectMosaic,
      walletAddress: this.address.plain()
    }).subscribe(data => {
      console.log("TCL: SendPage -> selectMosaic -> data", data)
      if (data) {
        this.optionsXPX = {
          prefix: "",
          thousands: ",",
          decimal: ".",
          precision: data.divisibility
        };
        this.selectedMosaic = data;

        console.log('12345678, selectedMosaic', this.selectedMosaic);
        // this.mosaics = data;
      }
    });
  }

  selectContact(title) {
    this.utils.showInsetModal("SendContactSelectPage", { title: title }).subscribe(data => {
      if (data != undefined || data != null) {
        this.form.get("recipientName").setValue(data.name);
        this.form.get("recipientAddress").setValue(data.address);
      }
    });
  }

  send() {
    const password = new Password(this.form.get("password").value);
    const iv = this.currentWallet.account.encryptedPrivateKey.iv;
    const encryptedKey = this.currentWallet.account.encryptedPrivateKey.encryptedKey;
    const privateKey = this.proximaxProvider.decryptPrivateKey(password, encryptedKey, iv);

    const mosaicsToSend = this.validateMosaicsToSend();

    console.log('mosaicsmosaics', mosaicsToSend);
    
    if (privateKey) {
      let message = this.form.get("message").value;
      let total = this.selectedCoin.market_data.current_price.usd * Number(this.form.get("amount").value);
      let page = "SendMosaicConfirmationPage";
      const modal = this.modalCtrl.create(
        page,
        {
          ...this.form.value,
          mosaic: mosaicsToSend,
          currentWallet: this.currentWallet,
          transactionType: "normal",
          // total: total,
          message: message,
          privateKey: privateKey
        },
        {
          enableBackdropDismiss: false,
          showBackdrop: true
        }
      );
      modal.present();
    } else {
      this.alertProvider.showMessage(this.translateService.instant("APP.INVALID.PASSWORD"));
    }
  }


  validateMosaicsToSend(){
    const mosaics = [];
    const amountXpx = this.form.get('amount').value;

    console.log('amountXpx', amountXpx);
    
    if (amountXpx !== '' && amountXpx !== null && Number(amountXpx) !== 0) {
      // console.log(amountXpx);
      const arrAmount = amountXpx.toString().replace(/,/g, '').split('.');
      let decimal;
      let realAmount;

      if (arrAmount.length < 2) {
        decimal = this.addZeros(6);
      } else {
        const arrDecimals = arrAmount[1].split('');
        decimal = this.addZeros(6 - arrDecimals.length, arrAmount[1]);
      }
      realAmount = `${arrAmount[0]}${decimal}`;
      mosaics.push({
        id: new MosaicId(this.selectedMosaic.hex),
        amount: realAmount
      });
    }

      return mosaics
    }
  

    addZeros(cant: any, amount: string = '0') {
      const x = '0';
      if (amount === '0') {
        for (let index = 0; index < cant - 1; index++) {
          amount += x;
        }
      } else {
        for (let index = 0; index < cant; index++) {
          amount += x;
        }
      }
      return amount;
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  scan() {
    this.storage.set("isQrActive", true);
    this.form.patchValue({ recipientAddress: "", emitEvent: false, onlySelf: true});
    this.barcodeScanner.scan().then(barcodeData => {
      barcodeData.format = "QR_CODE";
      let address = barcodeData.text.split("-").join("")
      if (address.length != 40) {
        this.alertProvider.showMessage(this.translateService.instant("WALLETS.SEND.ADDRESS.INVALID"))
        
      } else if (!this.proximaxProvider.verifyNetworkAddressEqualsNetwork(this.wallet, address)) {
        this.alertProvider.showMessage(this.translateService.instant("WALLETS.SEND.ADDRESS.UNSOPPORTED"))
      } else {
        this.form.patchValue({ recipientAddress: barcodeData.text });
      }
    }).catch(err => {
      if (err.toString().indexOf(this.translateService.instant("WALLETS.SEND.ERROR.CAMERA1")) >= 0) {
        let message = this.translateService.instant("WALLETS.SEND.ERROR.CAMERA2");
        this.alertProvider.showMessage(message);
      }
    });
  }


  countDecimals(value) {
    if (Math.floor(value) !== value)
      return value.toString().split(".")[1].length || 0;
    return 0;
  }

  checkAllowedInput(e) {
    const AMOUNT = this.form.get("amount").value;
    if (
      e.key === "-" ||
      e.key === "+" ||
      e.charCode === 43 ||
      e.charCode === 45 ||
      e.keyCode === 189 ||
      e.keyCode === 187 ||
      e.key === "Unindentified" ||
      e.keyCode === 229
    ) {
      e.preventDefault();
      if (AMOUNT == null) {
        this.form.get("amount").setValue("");
        this.form.get("amount").reset();
        this.periodCount = 0;
      }
    }

    if (AMOUNT == null) {
      this.periodCount = 0;
    }

    if (this.decimalCount >= 6 && e.key !== "Backspace") {
      e.preventDefault();
    }

    if ((e.charCode >= 48 && e.charCode <= 57) || (e.key == "." || e.charCode == 46 || e.keyCode == 8 || e.key == "Backspace")) {
      if (e.key == "." || e.charCode == 46) {
        ++this.periodCount;
      }
      if (this.periodCount > 1) {
        e.preventDefault();
        --this.periodCount;
      }
    }
  }
}
