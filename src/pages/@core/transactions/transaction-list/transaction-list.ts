import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController, ViewController, ActionSheetController } from "ionic-angular";
import { Transaction, Pageable, AccountInfoWithMetaData } from "nem-library";
import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from "@ionic-native/clipboard";
import { TransactionType, AggregateTransaction } from "tsjs-xpx-chain-sdk";
import { CoingeckoProvider } from "../../../../providers/coingecko/coingecko";
import { CoinPriceChartProvider } from "../../../../providers/coin-price-chart/coin-price-chart";
import { UtilitiesProvider } from "../../../../providers/utilities/utilities";
import { App } from "../../../../providers/app/app";
import { ToastProvider } from "../../../../providers/toast/toast";
import { GetMarketPricePipe } from "../../../../pipes/get-market-price/get-market-price";
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { TransactionsProvider } from "../../../../providers/transactions/transactions";
import { CatapultsAccountsInterface } from "../../../../providers/wallet/wallet";


/**
 * Generated class for the TransactionListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-list',
  templateUrl: 'transaction-list.html',
  providers: [GetMarketPricePipe]
})
export class TransactionListPage {

  App = App;
  aggregateTransactions: Array<AggregateTransaction> = [];
  confirmedTransactions = [];
  menu = 'confirmed';
  showEmptyMessage: boolean;
  TransactionType = TransactionType;
  unconfirmedTransactions = [];

  // --------------------------------------------------


  isLoading: boolean;
  isLoadingInfinite: boolean = false;
  pageable: Pageable<Transaction[]>;
  coindId: string;
  mosaicId: string;
  walletName: string;
  totalBalance: number;

  // Multisignature
  isMultisig: boolean;
  accountInfo: AccountInfoWithMetaData;
  selectedAccount: CatapultsAccountsInterface;
  mosaics: any[] = [];
  searchMore = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public coingeckoProvider: CoingeckoProvider,
    public coinPriceChartProvider: CoinPriceChartProvider,
    public utils: UtilitiesProvider,
    private modalCtrl: ModalController,
    private viewCtrl: ViewController,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private actionSheetCtrl: ActionSheetController,
    private haptic: HapticProvider,
    private translateService: TranslateService,
    private transactionsProvider: TransactionsProvider
  ) {
    const payload = this.navParams.data;
    console.log("SIRIUS CHAIN WALLET: TransactionListPage -> payload", payload)

    this.totalBalance = payload.total;
    this.confirmedTransactions = payload.transactions;
    this.unconfirmedTransactions = payload.unconfirmedTransactions;
    console.log('this.unconfirmedTransactions', this.unconfirmedTransactions);
    
    this.aggregateTransactions = payload.aggregateTransactions;
    this.selectedAccount = payload.selectedAccount;
    this.mosaics = payload.mosaics;

    if (this.confirmedTransactions === null) {
      this.showEmptyMessage = true;
    }
  }

  /**
   *
   *
   * @param {string} val
   * @memberof TransactionListPage
   */
  copy(val: string) {
    this.clipboard.copy(val).then(_ => {
      this.toastProvider.show(this.translateService.instant("WALLETS.DETAIL.COPY_ADDRESS"), 3, true);
    });
  }

  /**
   *
   *
   * @memberof TransactionListPage
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   *
   *
   * @param {*} infiniteScroll
   * @memberof TransactionListPage
   */
  getMoreConfirmedTxn(infiniteScroll: any) {
    if (this.searchMore) {
      setTimeout(async () => {
        const lastTransactionId = this.confirmedTransactions[this.confirmedTransactions.length - 1].transactionInfo.id;
        console.log('Begin async operation', lastTransactionId);
        this.transactionsProvider.getAllTransactionsFromAccount(this.selectedAccount.publicAccount, lastTransactionId).subscribe(
          next => {
            console.log('last 10 txn --->', next);
            if (next.length > 0) {
              next.forEach(element => {
                this.confirmedTransactions.push(element);
              });
            } else {
              this.searchMore = false;
            }
            infiniteScroll.complete();
          }
        );
      }, 1500);
    } else {
      infiniteScroll.complete();
    }
  }


  /**
  *
  *
  * @param {Transaction} tx
  * @param {string} status
  * @memberof TransactionListPage
  */
  goToTransactionDetail(tx: Transaction, status: string) {
    let page = "TransactionDetailPage";
    const transactions = tx;
    const mosaics = this.mosaics;
    const payload = { transactions, mosaics, status };
    this.showModal(page, payload);
  }

  /**
   *
   *
   * @memberof TransactionListPage
   */
  moreDetails() {
    let page = "WalletDetailsPage";
    this.showModal(page, { totalBalance: this.totalBalance, selectedAccount: this.selectedAccount });
  }

  /**
   *
   *
   * @memberof TransactionListPage
   */
  showReceiveModal() {
    let page = "ReceivePage";
    const modal = this.modalCtrl.create(page, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  /**
   *
   *
   * @memberof TransactionListPage
   */
  showSendModal() {
    console.log(this.accountInfo);
    if (this.isMultisig) {
      this.haptic.selection();
      let page = 'SendMultisigPage';
      const title = this.translateService.instant("WALLETS.SEND.PROMPT");
      const normalTX = this.translateService.instant("WALLETS.SEND.NORMAL");
      const multisigTX = this.translateService.instant("WALLETS.SEND.MULTISIG");
      const cancelButton = this.translateService.instant("WALLETS.BUTTON.CANCEL");
      const actionSheet = this.actionSheetCtrl.create({
        title: title,
        cssClass: 'wallet-on-press',
        buttons: [{
          text: normalTX,
          handler: () => {
            let page = 'SendPage';
            this.showModal(page, { mosaicSelectedName: 'xpx' })
          }
        }, {
          text: multisigTX,
          handler: () => {
            this.showModal(page, { mosaicSelectedName: 'xpx' })
          }
        }, {
          text: cancelButton,
          role: 'cancel',
          handler: () => {
          }
        }]
      });
      
      actionSheet.present();
    } else {
      let page = "SendPage";
      this.showModal(page, { mosaicSelectedName: 'xpx' })
    }
  }

  /**
   *
   *
   * @param {*} page
   * @param {*} params
   * @memberof TransactionListPage
   */
  showModal(page: any, params: any) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }
}
