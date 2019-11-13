import { MosaicModel } from './../../../../../providers/transfer-transaction/mosaic.model';

import { Component, trigger, transition, style, group, animate } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { SimpleWallet, Password} from 'tsjs-xpx-chain-sdk';


import { App } from '../../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { AuthProvider } from '../../../../../providers/auth/auth';
import { HapticProvider } from '../../../../../providers/haptic/haptic';
import { TranslateService } from '@ngx-translate/core';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { TransferTransactionProvider } from '../../../../../providers/transfer-transaction/transfer-transaction';

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
          style({opacity: '0'}),
          group([
            animate('500ms ease-out', style({opacity: '1'})),
          ])
          
      ]),
      transition(':leave', [
          group([
            animate('500ms ease-out', style({opacity: '0'})),
          ])
      ])
    ]),

    trigger('badge', [
        transition(':enter', [
            style({transform: 'translateY(400%)'}),
            animate('500ms ease-out', style({transform: 'translateY(0)'}))
        ]),
        transition(':leave', [
            animate('500ms ease-in', style({transform: 'translateY(400%)'}))   
        ])
    ]),

    trigger('message', [
      transition(':enter', [
          style({opacity: '0'}),
          animate('500ms 1000ms ease-out', style({opacity: '1'}))
      ]),
      transition(':leave', [
          animate('500ms ease-in', style({opacity: '0'}))   
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

  fee: number = 0;

  displaySuccessMessage: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertProvider: AlertProvider,
    private authProvider: AuthProvider,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    private haptic: HapticProvider,
    private translateService: TranslateService,
    private walletProvider: WalletProvider,
    private transferTransaction: TransferTransactionProvider
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
    console.log('navParams', this.navParams.data);
    this.data = this.navParams.data;
    console.log("TCL: SendMosaicConfirmationPage -> init -> this.data", this.data)
    this.currentWallet = <SimpleWallet>this.data.currentWallet;

    // Initialize private data
    this.authProvider.getPassword().then(password => {
      this.credentials = {
        password: password,
        privateKey: ''
      };
    })

    // Prepare transfer Transaction
    this.prepareTransaction();
  }
  prepareTransaction() {
    
    const mosaicModel = new MosaicModel();
    mosaicModel.hexId = this.data.mosaic.hex;
    mosaicModel.amount = this.data.amount;

    //1. Build a transfer transaction
    this.transferTransaction.setRecipient(this.data.recipientAddress);
    this.transferTransaction.setMosaics([mosaicModel]);
    this.transferTransaction.setMessage(this.data.message);
    this.fee = this.transferTransaction.getFee();
    console.log("TCL: SendMosaicConfirmationPage -> onSubmit -> fee", this.fee)
  }

  goBack() {
    return this.navCtrl.pop();
  }

  onSubmit() {
    console.log('transactionType', this.data.transactionType);
    if (this.data.transactionType == 'multisig') {
      console.log("Multisig transfer");
      if (this._allowedToSendTx()) {
        // TODO: Multisig Send
      } else {
        this.showGenericError();
      }
    } else if (this.data.transactionType = 'normal'){
      console.log("Normal transfer");
      if (this._allowedToSendTx()) {
        
        this.transferTransaction.send().subscribe(response => {
          this.showSuccessMessage();
        }, (err) => {
            this.showErrorMessage(err);
        }, () => {
          console.log('Done transfer transaction.');
        });
      } else {
        this.showGenericError();
      }
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
        'TabsPage',
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
  private _allowedToSendTx() {
    // TODO: do some checking before send transaction
    
    if (this.credentials.password) {
      const myPassword = new Password(this.credentials.password);
      console.log('myPassword', myPassword)
        return true;
    }
    return false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
