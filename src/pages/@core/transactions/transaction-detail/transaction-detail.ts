import { DefaultMosaic } from './../../../../models/default-mosaic';
import { NavParams, IonicPage, NavController, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { TransactionType, SimpleWallet, AggregateTransaction, Password, Account } from 'tsjs-xpx-chain-sdk';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { Observable } from 'rxjs';
import { AuthProvider } from '../../../../providers/auth/auth';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { AlertProvider } from '../../../../providers/alert/alert';

/**
 * Generated class for the TransactionDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html'
})
export class TransactionDetailPage {
  public TransactionType = TransactionType;
  public tx: any;
  public mosaics:DefaultMosaic[] = [];
  public selectedAccount: Account;
  isSelectedAccountMultisig: boolean = false;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    public walletProvider: WalletProvider,
    public authProvider: AuthProvider,
    public proximaxProvider: ProximaxProvider,
    public alertProvider: AlertProvider,
  ) {
    const payload = this.navParams.data;
    this.tx = payload.transactions
    this.mosaics = payload.mosaics;
    
    this.walletProvider.getSelectedWallet().then(selectedWallet => {
      this.getAccount(selectedWallet).subscribe((selectedAccount: Account) => {
        this.selectedAccount = selectedAccount;
      });
    });
  }

  private getAccount(wallet: SimpleWallet): Observable<Account> {
    return new Observable(observer => {
      // Get user's password and unlock the wallet to get the account
      this.authProvider.getPassword().then(password => {
        // Get user's password
        const myPassword = new Password(password);

        // Convert current wallet to SimpleWallet
        const myWallet = this.walletProvider.convertToSimpleWallet(wallet);

        // Unlock wallet to get an account using user's password
        const account = myWallet.open(myPassword);

        observer.next(account);
      });
    });
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  cosign(tx: AggregateTransaction) {
    this.proximaxProvider.cosignAggregateBondedTransaction(tx, this.selectedAccount).subscribe(() => {
      this.alertProvider.showTranslated('TRANSACTION_DETAIL.COSIGN_DONE', 'TRANSACTION_DETAIL.COSIGN_MESSAGE').then(() => {
        this.viewCtrl.dismiss();
      });
    });
  }

  toShowCosign(tx: AggregateTransaction): boolean {
    return tx.signer.publicKey === this.selectedAccount.publicKey || !!tx.cosignatures.find(cosigner => cosigner.signer.publicKey === this.selectedAccount.publicKey);
  }
}
