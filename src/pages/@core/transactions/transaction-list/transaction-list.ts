import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController, InfiniteScroll, ViewController, ActionSheetController } from "ionic-angular";
import { SimpleWallet, Transaction, Pageable, AccountInfoWithMetaData } from "nem-library";
import { CoingeckoProvider } from "../../../../providers/coingecko/coingecko";
import { CoinPriceChartProvider } from "../../../../providers/coin-price-chart/coin-price-chart";
import { UtilitiesProvider } from "../../../../providers/utilities/utilities";
import { App } from "../../../../providers/app/app";
import { ToastProvider } from "../../../../providers/toast/toast";
import { Clipboard } from "@ionic-native/clipboard";
import { GetMarketPricePipe } from "../../../../pipes/get-market-price/get-market-price";
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { TranslateService } from '@ngx-translate/core';
import { TransactionType } from "tsjs-xpx-chain-sdk";

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
  App = App;
  TransactionType = TransactionType;

  currentWallet: SimpleWallet;
  fakeList: Array<any>;

  unconfirmedTransactions: Array<any>;
  confirmedTransactions: Array<any>;
  showEmptyMessage: boolean;
  isLoading: boolean;

  isLoadingInfinite: boolean = false;

  pageable: Pageable<Transaction[]>;

  @ViewChild(InfiniteScroll)
  private infiniteScroll: InfiniteScroll;

  coindId: string;
  mosaicId: string;
  walletName: string;


  totalBalance: number;

  // Multisignature
  isMultisig: boolean;
  accountInfo: AccountInfoWithMetaData;
  selectedAccount: any;

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
    this.selectedAccount = payload.selectedAccount;

    if(this.confirmedTransactions === null){
      this.showEmptyMessage = true;
    }

  }

  getAccountInfo() {

  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TransactionListPage");
    
  }
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

  gotoTransactionDetail(tx) {
    let page = "TransactionDetailPage";
    this.showModal(page, tx);
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
