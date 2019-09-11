import { CoingeckoProvider } from './../../../../../providers/coingecko/coingecko';
import { SimpleWallet, AssetDefinition, XEM, AssetTransferable, Address, TransferTransaction, PublicAccount, PlainMessage} from 'nem-library';
import { NemProvider } from './../../../../../providers/nem/nem';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingOptions, LoadingController, Platform, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { AuthProvider } from '../../../../../providers/auth/auth';
import { AppConfig} from '../../../../../app/app.config'
import { HapticProvider } from '../../../../../providers/haptic/haptic';
import { Password } from 'tsjs-xpx-chain-sdk';

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
  walletC: any;
  message: PlainMessage;
  selectedMosaic: AssetTransferable;
  credentials: { password: string; privateKey: string };
  total: number;
  address: Address;
  wallet: any;
  recipient = AppConfig.swap.address
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
    public translateService: TranslateService,
    private alertCtrl: AlertController,
    private authProvider: AuthProvider,
    private haptic: HapticProvider,
  ) {

    // Show loader
    let options: LoadingOptions = {
      content: 'Getting account information...'
    };
    let loader = this.loadingCtrl.create(options);
    loader.present();

    
    this.wallet = this.navParams.data.data.wallet;
    this.walletC = this.navParams.data.data.walletC;
    console.log('********************************* this.wallet', this.wallet);
    console.log('********************************* this.walletC', this.walletC);
    this.address = new Address(this.wallet.address.value)
     console.log('********************************* address',  this.address);
    console.log('LOG: WalletInfoPage -> constructor -> wallet', this.wallet);

    // 0. initialize form
    this.init();

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

    loader.dismiss();

    
  }

  confirmSwap() {
    let total = this.coinGecko.market_data.current_price.usd * Number(this.form.get('amount').value);
    let alert = this.alertCtrl.create({
      title: 'Confirm Swap',
      message: 'Warning! this process might take few hours. If you choose to proceed, you wil receive a ticket with the transaction hash for your reference and follow up',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.onSubmit()
          }
        }
      ]
    });
    alert.present();
  }

  onSubmit() {
    this.amount = this.form.get('amount').value
    const recipient = new Address(this.recipient)
    let transferTransaction = this._prepareTx(recipient);

    console.log(transferTransaction);

    if (this._allowedToSendTx()) {
      this.nemProvider
        .confirmTransaction(
          transferTransaction,
          this.credentials.privateKey
        )
        .subscribe(
          value => {
            this.showSuccessMessage()
          },
          error => {
            console.log('erororrrr al enviar',error)
            this.showErrorMessage(error)
          }
        );
    } else {
      this.showGenericError();
    }
    // Show confirm transaction
  }


  clearPlaceholder() {
    this.amountPlaceholder = "";
  }

  onAmountChange(){
    this.form.get('amount').valueChanges.subscribe(value => {
        if (value > this.mosaic.balance) {
          console.log('Insuffwalleticient balance.');

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

  ownedMosaics(address: Address) {
    console.log()
    this.nemProvider.getOwnedMosaics(address).subscribe(mosaics => {
      // console.log('LOG: WalletInfoPage -> ownedMosaics -> mosaics', mosaics);
      let xpx = mosaics.filter(m => {
        return m.assetId.name === 'xpx' && m.assetId.namespaceId === 'prx'
      })
      // console.log('LOG: WalletInfoPage -> ownedMosaics -> xpx', xpx);
      if(xpx) {
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

  getAccountInfo(address: Address) {  
    try {
      this.nemProvider
        .getAccountInfo(address)
        .subscribe(accountInfo => {
          if (accountInfo) {
            this.message = PlainMessage.create(accountInfo.publicAccount.publicKey);
            // // Check if account is a cosignatory of multisig account(s)
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

  private _prepareTx(recipient: Address): TransferTransaction {
    let transferTransaction: TransferTransaction;
      const MOSAIC_TRANSFERRABLE = [
        new AssetTransferable(
          this.selectedMosaic.assetId,
          this.selectedMosaic.properties,
          this.amount,
          this.selectedMosaic.levy
        )
      ];
      console.log('realizandoswap proces MOSAIC_TRANSFERRABLE', MOSAIC_TRANSFERRABLE)
      transferTransaction = this.nemProvider.prepareMosaicTransaction(
        recipient,
        MOSAIC_TRANSFERRABLE,
        this.message
      );
    console.log('transferTransaction', transferTransaction);
    return transferTransaction;
  }
  
    /**
   * User checking if it can do the send transaction.
   */
  private _allowedToSendTx() {
    console.log('this.credentials.password', this.credentials.password)
    if (this.credentials.password) {
      console.log('entro en condicion')
      try {
        console.log('entro en try')
        const password = new Password(this.credentials.password)
        console.log('entro en password', password)
        this.credentials.privateKey = this.nemProvider.decryptPrivateKey(
          password,
          this.walletC.encryptedPrivateKey.encryptedKey,
          this.walletC.encryptedPrivateKey.iv
        );
        console.log('this.credentials.privateKey', this.credentials.privateKey)
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  showSuccessMessage() {
    this.haptic.notification({ type: 'success' });
    this.alertProvider.showMessage(
      `You have successfully sent ${
        this.amount
      } ${this.selectedMosaic.assetId.name.toUpperCase()}`
    );
    this.utils.setTabIndex(2);
    this.navCtrl.setRoot(
      'TabsPage',
      {},
      {
        animate: true,
        direction: 'backward'
      }
    );
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
