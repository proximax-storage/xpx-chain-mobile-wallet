import { Component, trigger, transition, style, group, animate } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SimpleWallet, PlainMessage, TransferTransaction } from 'tsjs-xpx-chain-sdk';
import { App } from '../../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { HapticProvider } from '../../../../../providers/haptic/haptic';
import { TranslateService } from '@ngx-translate/core';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { TransferTransactionProvider } from '../../../../../providers/transfer-transaction/transfer-transaction';
import { AppConfig } from '../../../../../app/app.config';
import * as FeeCalculationStrategy from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/FeeCalculationStrategy';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';

/**
 * Generated class for the SendMosaicConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-send-mosaic-confirmation',
  templateUrl: 'send-mosaic-confirmation.html',
  animations: [

    trigger('container', [
      transition(':enter', [
        style({ opacity: '0' }),
        group([
          animate('500ms ease-out', style({ opacity: '1' })),
        ])

      ]),
      transition(':leave', [
        group([
          animate('500ms ease-out', style({ opacity: '0' })),
        ])
      ])
    ]),

    trigger('badge', [
      transition(':enter', [
        style({ transform: 'translateY(400%)' }),
        animate('500ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'translateY(400%)' }))
      ])
    ]),

    trigger('message', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('500ms 1000ms ease-out', style({ opacity: '1' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: '0' }))
      ])
    ])

  ]
})
export class SendMosaicConfirmationPage {
  generationHash: any;
  App = App;
  formGroup: FormGroup;
  currentWallet: SimpleWallet;

  credentials: { password: string; privateKey: string };

  data: any;


  displaySuccessMessage: boolean = false;
  block: boolean = false;
  transferBuilder: any;
  namexPX: string;
  fee: string;
  amountConfirm: any;
  amountFormatter: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertProvider: AlertProvider,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    private haptic: HapticProvider,
    private translateService: TranslateService,
    private walletProvider: WalletProvider,
    private transferTransaction: TransferTransactionProvider,
    private proximaxProvider: ProximaxProvider
  ) {
    this.init();
    this.generationHash = this.walletProvider.generationHash
  }

  ionViewWillEnter() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendMosaicConfirmationPage');
  }

  init() {
    // Inititalize empty fo  submission only
    this.formGroup = this.formBuilder.group({});

    // Get NavParams data
    this.data = this.navParams.data;
    this.currentWallet = <SimpleWallet>this.data.currentWallet;

    if (this.data.mosaic.length > 0) {
      this.amountFormatter = this.getAbsoluteAmount(this.data.mosaic[0].amount, this.data.divisibility)

      if (this.data.mosaic[0].id.toHex() === AppConfig.xpxHexId) {
        this.namexPX = 'PRX.XPX';
      } else {
        this.namexPX = this.data.mosaic[0].id.toHex();
      }
    }

    const params = {
      common: this.data.privateKey,
      recipient: this.data.recipientAddress,
      message: PlainMessage.create(this.data.message),
      network: this.data.currentWallet.account.network,
      mosaic: this.data.mosaic
    };
    this.transferBuilder = this.transferTransaction.buildTransferTransaction(params);
    this.calculateFee()

  }

  getAbsoluteAmount(amount, divisibility) {
    const amountFormatter = this.proximaxProvider.amountFormatter(amount, divisibility)
    return amountFormatter;
  }

  calculateFee() {
    const x = TransferTransaction.calculateSize(PlainMessage.create(this.data.message).size(), this.data.mosaic.length);
    const b = FeeCalculationStrategy.calculateFee(x);
    if (this.data.message.length > 0) {
      this.fee = this.proximaxProvider.amountFormatterSimple(b.compact());
    } else if (this.data.message.length === 0 && this.data.mosaic.length === 0) {
      this.fee = '0.037250';
    } else {
      this.fee = this.proximaxProvider.amountFormatterSimple(b.compact());
    }
  }


  goBack() {
    return this.navCtrl.pop();
  }

  onSubmit() {
    this.block = true;
    // console.log('transactionType', this.data.transactionType);
    if (this.data.transactionType == 'multisig') {
      console.log("Multisig transfer");
    } else if (this.data.transactionType = 'normal') {
      console.log("Normal transfer");

      this.transferTransaction.send(this.data.privateKey, this.transferBuilder.transferTransaction, this.data.currentWallet.account.network).subscribe(response => {
        const signedTxn = this.transferTransaction.signedTxn;
        this.transferTransaction.checkTransaction(signedTxn).subscribe(status => {
          this.block = false;
          if ( status.group && status.group === 'unconfirmed' || status.group === 'confirmed') {
            this.showSuccessMessage();
          } else {
            this.showErrorMessage(status.status);
          }
        }, error => {
          this.block = false;
          this.showErrorMessage(error);
        })
      });
    } else {
      this.showGenericError();
    }
  }

  showGenericError() {
    this.translateService.get('APP.ERROR').subscribe(
      value => {
        let alertTitle = value;
        this.alertProvider.showMessage(alertTitle);
      });

  }

  showErrorMessage(error) {
    this.haptic.notification({ type: 'warning' });
    console.log(error);
    if (error.toString().indexOf('FAILURE_INSUFFICIENT_BALANCE') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.TRANSFER.INSUFFICIENT_BALANCE"));
    } else if (error.toString().indexOf('Failure_Core_Insufficient_Balance') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.TRANSFER.INSUFFICIENT_BALANCE"));
    } else if (error.toString().indexOf('Failure_Multisig_Operation_Not_Permitted_By_Account') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.TRANSFER.ALLOWED_FOR_MULTISIG"));
    } else {
      this.alertProvider.showMessage(
        error
      );
    }


  }

  showSuccessMessage() {

    this.displaySuccessMessage = true;

    setTimeout(() => {
      this.displaySuccessMessage = false;

      this.haptic.notification({ type: 'success' });
      // this.alertProvider.showMessage(
      //   `You sent ${
      //   this.data.amount
      //   } ${this.data.mosaic.mosaicId.toUpperCase()} to ${
      //   this.data.recipientName || this.data.recipientAddress
      //   }`
      // );
      this.utils.setTabIndex(2);
      this.navCtrl.setRoot(
        'SendPage',
        {},
        {
          animate: true,
          direction: 'backward'
        }
      );

    }, 3000);



  }

  /**
   * User checking if it can do the send transaction.
   */
  // private _allowedToSendTx() {
  //   // TODO: do some checking before send transaction

  //   if (this.credentials.password) {
  //     const myPassword = new Password(this.credentials.password);
  //     console.log('myPassword', myPassword)
  //       return true;
  //   }
  //   return false;
  // }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
