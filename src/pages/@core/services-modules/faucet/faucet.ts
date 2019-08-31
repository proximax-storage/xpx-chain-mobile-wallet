import { AppConfig } from './../../../../app/app.config';
import { AlertProvider } from '../../../../providers/alert/alert';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Account, TransactionHttp } from 'tsjs-xpx-chain-sdk';
import { MosaicModel } from './mosaic.model';
import { TransferTransactionProvider } from '../../../../providers/transfer-transaction/transfer-transaction';

/**
 * Generated class for the FaucetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faucet',
  templateUrl: 'faucet.html',
})
export class FaucetPage {
  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    private proximaxProvider: ProximaxProvider,
    private toastCtrl: ToastController,
    private alertProvider: AlertProvider,
    private translateService: TranslateService,
    private viewCtrl: ViewController,
    private transferTransaction: TransferTransactionProvider
    ) {
    this.formGroup = this.formBuilder.group({
      address: ['', [Validators.minLength(40), Validators.required]]
    });
  }

  onSubmit(form) {
    const ADDRESS = this.formGroup.get('address').value.toUpperCase().replace('-', '');

    try {
      if (this.proximaxProvider.isValidAddress(ADDRESS)) {
        this.sendXPXTo(ADDRESS);

        const message = "100 XPX will be sent to your account."
        this.toastCtrl.create({
          message: message,
          duration: 2000
        }).present().then(_=>this.dismiss());
      }
    } catch (error) {
      this.alertProvider.showMessage(
          error
        );
    }
  }

  sendXPXTo(address:string) {
    console.log('LOG: FaucetPage -> sendXPXTo -> address', address);
    // Do a Sirius Transfer Transaction

    const recipient = address;

    // 0. Setup mosaic id
    const mosaicModel = new MosaicModel();
    mosaicModel.hexId = '3c0f3de5298ced2d';
    mosaicModel.amount = 1;   // TODO: change to desired amount

    // 1. Setup sender account / faucet
    const sender = Account.createFromPrivateKey('65F5A572ADD524CA56E2D6210F1A8BE3A7C2340D4F4F6E4BFE3D36797B37DF2F', AppConfig.sirius.networkType);

    // 2. Build a transfer transaction
    this.transferTransaction.setRecipient(recipient);
    this.transferTransaction.setMosaics([mosaicModel]);
    this.transferTransaction.setMessage('Swap service test');
    const transferTx = this.transferTransaction.build();

    // 3. Sign a transaction
    const signedTxn = sender.sign(transferTx, AppConfig.sirius.networkGenerationHash);
    console.log(JSON.stringify(signedTxn, null, 4));
  
    // 4. Announce the transaction
    const transactionHttp = new TransactionHttp(AppConfig.sirius.httpNodeUrl);
    transactionHttp.announce(signedTxn).subscribe(response => {
      console.log(response);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaucetPage');
  }

}
