import { CoingeckoProvider } from './../../../../../providers/coingecko/coingecko';
import { SimpleWallet, AssetDefinition, XEM, AssetTransferable } from 'nem-library';
import { NemProvider } from './../../../../../providers/nem/nem';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingOptions, LoadingController, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';

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
  optionsXPX = {
    prefix: '',
    thousands: ',',
    decimal: '.',
    precision: '6'
  };
  form: FormGroup;
  amount: number = 0;
  amountPlaceholder: string;
  periodCount: number;
  msgErrorBalance: any;
  coinGecko: any;
  mosaic: { namespaceId: string; mosaicId: string; balance: number; } = {
    namespaceId: 'proximax',
    mosaicId: 'xpx',
    balance: 0
  };
  App = App;
  decimalCount: number;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private nemProvider: NemProvider,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public platform: Platform,
    private coingeckoProvider: CoingeckoProvider,
    public utils: UtilitiesProvider,
    public alertProvider: AlertProvider,
    public translateService: TranslateService
  ) {

    // Show loader
    let options: LoadingOptions = {
      content: 'Getting account information...'
    };
    let loader = this.loadingCtrl.create(options);
    loader.present();

    const wallet = this.navParams.data.data.wallet;
    console.log('LOG: WalletInfoPage -> constructor -> wallet', wallet);

    // 0. initialize form
    this.init();

    // 1. Get wallet info
    this.getAccountInfo(wallet);

    // 2. Get mosaics
    this.ownedMosaics(wallet);

    // 3. Display XPX and ask for amount to be converted
    // TODO: Reuse Send Mosaic Page - ETA 30 mins

    // 4. Subscribe to amount change
    this.onAmountChange();

    // 5. Get coin price
    this.coingeckoProvider.getDetails('proximax').subscribe(coin => {
      this.coinGecko = coin;
    });


    loader.dismiss();

  }

  onSubmit() {
    
  }

  clearPlaceholder() {
    this.amountPlaceholder = "";
  }

  onAmountChange(){
    this.form.get('amount').valueChanges.subscribe(value => {
        if (value > this.mosaic.balance) {
          console.log('Insufficient balance.');

          const message = this.translateService.instant("WALLETS.SEND.ERROR.BALANCE");
          this.alertProvider.showMessage(message);
          this.amount = 0;
        }
      }
    );
  }
  

  init() {
    // Initialize form
    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
    });
  }

  ownedMosaics(wallet: SimpleWallet) {
    this.nemProvider.getOwnedMosaics(wallet.address).subscribe(mosaics => {
      console.log('LOG: WalletInfoPage -> ownedMosaics -> mosaics', mosaics);
      let xpx = mosaics.filter(m => {
        return m.assetId.name === 'xpx' && m.assetId.namespaceId === 'proximax'
      })
      console.log('LOG: WalletInfoPage -> ownedMosaics -> xpx', xpx);
      if(xpx) {
        const XPX = xpx[0];
        this.mosaic = {
          namespaceId: XPX.assetId.namespaceId,
          mosaicId: XPX.assetId.name,
          balance: XPX.quantity
        }
      }
    })
  }

  getAccountInfo(wallet: SimpleWallet) {
    console.info("Getting account information.", wallet.address)
    try {
      this.nemProvider
        .getAccountInfo(wallet.address)
        .subscribe(accountInfo => {
          if (accountInfo) {
            // this.accountInfo = accountInfo;
            console.log("accountInfo", accountInfo)
            // Check if account is a cosignatory of multisig account(s)
            if (accountInfo.cosignatoryOf.length > 0) {
              // console.clear();
              console.log("This is a multisig account");
              // this.isMultisig = true;
            }
          }

        }, (err: any) => {
          console.log(err)
          // this.isMultisig = false;
        });

    } catch (error) {
      console.log(error);
    }

  }

  dismiss() {
    this.viewCtrl.dismiss();
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
      console.log("LOG: SendPage -> checkAllowedInput -> this.periodCount", this.periodCount);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletInfoPage');
  }

}
