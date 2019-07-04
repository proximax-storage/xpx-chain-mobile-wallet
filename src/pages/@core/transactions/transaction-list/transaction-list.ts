import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController, InfiniteScroll, ViewController, ActionSheetController } from "ionic-angular";
import { TransactionTypes, SimpleWallet, Transaction, Pageable, TransferTransaction, AccountInfoWithMetaData, AccountInfo } from "nem-library";
import { Observable } from "rxjs";
import { CoingeckoProvider } from "../../../../providers/coingecko/coingecko";
import { CoinPriceChartProvider } from "../../../../providers/coin-price-chart/coin-price-chart";
import { UtilitiesProvider } from "../../../../providers/utilities/utilities";
import { NemProvider } from "../../../../providers/nem/nem";
import { WalletProvider } from "../../../../providers/wallet/wallet";
import find from 'lodash/find';
import { App } from "../../../../providers/app/app";
import { ToastProvider } from "../../../../providers/toast/toast";
import { Clipboard } from "@ionic-native/clipboard";
import sortBy from 'lodash/sortBy';
import { GetBalanceProvider } from "../../../../providers/get-balance/get-balance";
import { GetMarketPricePipe } from "../../../../pipes/get-market-price/get-market-price";
import { HapticProvider } from '../../../../providers/haptic/haptic';
import filter from 'lodash/filter';
import { TranslateService } from '@ngx-translate/core';

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
  TransactionTypes = TransactionTypes;

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public coingeckoProvider: CoingeckoProvider,
    public coinPriceChartProvider: CoinPriceChartProvider,
    public utils: UtilitiesProvider,
    private modalCtrl: ModalController,
    private nemProvider: NemProvider,
    private walletProvider: WalletProvider,
    private viewCtrl: ViewController,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private getBalanceProvider: GetBalanceProvider,
    private marketPrice: GetMarketPricePipe,
    private actionSheetCtrl: ActionSheetController,
    private haptic: HapticProvider,
    private translateService: TranslateService
  ) {
    // this.getTotalBalance(currentWallet);
    console.log("Wallet from home", this.navParams.data);
    this.currentWallet = this.navParams.data;
    this.totalBalance = this.currentWallet.total || 0;

  }

  getAccountInfo() {
    console.info("Getting account information.", this.currentWallet.address)


    try {
      this.nemProvider
        .getAccountInfo(this.currentWallet.address)
        .subscribe(accountInfo => {
          if (accountInfo) {
            this.accountInfo = accountInfo;
            console.log("accountInfo", this.accountInfo)
            // Check if account is a cosignatory of multisig account(s)
            if (this.accountInfo.cosignatoryOf.length > 0) {
              // console.clear();
              console.log("This is a multisig account");
              this.isMultisig = true;
            }
          }

        }, (err: any) => {
          console.log(err)
          this.isMultisig = false;
        });

    } catch (error) {
      console.log(error);
    }

  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);

    /** Transaction list business logic */
    this.unconfirmedTransactions = null;
    this.confirmedTransactions = null;

    if (this.currentWallet) {
      this.walletName = this.currentWallet.name;
      this.currentWallet = this.currentWallet;
      this.fakeList = [{}, {}];
      this.isLoading = true;

      this.getAccountInfo();

      this.nemProvider
        .getUnconfirmedTransactions(this.currentWallet.address)
        .flatMap(_ => _)
        .toArray()
        .subscribe(result => {
          this.unconfirmedTransactions = result;
        });


      this.nemProvider.getMosaicTransactions(this.currentWallet.address).subscribe(mosaicTransactions => {

        console.clear();

        let supportedMosaics = [
          { mosaicId: 'xpx' },
          { mosaicId: 'xem' },
          { mosaicId: 'npxs' },
          { mosaicId: 'sft' },
          { mosaicId: 'xar' },
        ]

        const filteredTransactions = filter(mosaicTransactions, (tx) => find(supportedMosaics, { mosaicId: tx._mosaics[0].mosaicId.name }));
      
        setTimeout(() => {
          this.nemProvider.getXEMTransactions(this.currentWallet.address).subscribe(XEMTransactions => {
            const TRANSACTIONS = [].concat(filteredTransactions, XEMTransactions);
            console.log("LOG: TransactionListPage -> ionViewWillEnter -> TRANSACTIONS.length", TRANSACTIONS.length);
            
            // Check transaction is empty
            if (TRANSACTIONS.length == 0) {
              this.confirmedTransactions = null;
              this.showEmptyMessage = true;
            } else {
              this.confirmedTransactions = TRANSACTIONS.sort((a,b) => {
                return new Date(b.timeWindow.timeStamp).getTime() - new Date(a.timeWindow.timeStamp).getTime()
              });
              this.showEmptyMessage = false;
            }
            this.isLoading = false;
          })
        }, 1000);


      })
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TransactionListPage");

  }
  goto(page) {
    this.navCtrl.push(page);
  }

  showReceiveModal() {
    let page = "ReceivePage";
    const modal = this.modalCtrl.create(page, {
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
    this.showModal(page, { totalBalance: this.totalBalance, wallet: this.currentWallet });
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

  copy() {
    this.clipboard.copy(this.currentWallet.address.plain()).then(_ => {
      this.toastProvider.show('Your address has been successfully copied to the clipboard.', 3, true);
    });
  }
}
