import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController, ViewController, ActionSheetController } from "ionic-angular";
import { SimpleWallet, Transaction, Pageable, AccountInfoWithMetaData } from "nem-library";
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

  /** Transaction list member variables */
  items = [];
  menu = 'confirmed';
  aggregateTransactions: Array<AggregateTransaction> = [];
  confirmedTransactions = [];
  unconfirmedTransactions = [];

  // --------------------------------------------------

  App = App;
  TransactionType = TransactionType;

  currentWallet: SimpleWallet;
  fakeList: Array<any>;

  showEmptyMessage: boolean;
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
  selectedAccount: any;

  mosaics: any[] = [];

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
    private translateService: TranslateService
  ) {
    const payload = this.navParams.data;
    console.log("SIRIUS CHAIN WALLET: TransactionListPage -> payload", payload)

    this.totalBalance = payload.total;
    this.confirmedTransactions = payload.transactions;
    this.aggregateTransactions = payload.aggregateTransactions;
    this.selectedAccount = payload.selectedAccount;
console.log('...........', this.aggregateTransactions);

    this.mosaics = payload.mosaics;

    if (this.confirmedTransactions === null) {
      this.showEmptyMessage = true;
    }

    for (let i = 0; i < 30; i++) {
      this.items.push(this.items.length);
    }
  }


  getMoreConfirmedTxn(infiniteScroll) {
    setTimeout(() => {
      console.log('Begin async operation');
      infiniteScroll.complete();
    }, 500);
    /*setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.items.push(this.items.length);
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);*/
  }


  // -------------------------------------------------------------------------------------------------------------



  goto(page) {
    this.navCtrl.push(page);
  }

  showReceiveModal() {
    let page = "ReceivePage";
    const modal = this.modalCtrl.create(page, this.selectedAccount, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

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
        buttons: [
          {
            text: normalTX,
            handler: () => {
              let page = 'SendPage';
              this.showModal(page, { mosaicSelectedName: 'xpx' })
            }
          },
          {
            text: multisigTX,
            handler: () => {
              this.showModal(page, { mosaicSelectedName: 'xpx' })
            }
          },
          {
            text: cancelButton,
            role: 'cancel',
            handler: () => {
              // this.showModal(page,{ mosaicSelectedName: 'xpx'})
            }
          }
        ]
      });
      actionSheet.present();
      // this.showModal(page,{ mosaicSelectedName: 'xpx'})
    } else {
      let page = "SendPage";
      this.showModal(page, { mosaicSelectedName: 'xpx' })
    }
  }

  showExportPrivateKeyModal() {
    let page = "PrivateKeyPasswordPage";
    this.showModal(page, {})
  }

  moreDetails() {
    let page = "WalletDetailsPage";
    this.showModal(page, { totalBalance: this.totalBalance, selectedAccount: this.selectedAccount });
  }

  showModal(page, params) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  /** Transaction list methods */
  trackByHash(index) {
    return index;
  }

  gotoTransactionDetail(tx: Transaction, status: string) {
    let page = "TransactionDetailPage";
    const transactions = tx;
    const mosaics = this.mosaics;
    const sts = status;
    const payload = { transactions, mosaics, status };
    this.showModal(page, payload);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  copy(val) {
    this.clipboard.copy(val).then(_ => {
      this.toastProvider.show(this.translateService.instant("WALLETS.DETAIL.COPY_ADDRESS"), 3, true);
    });
  }
}
