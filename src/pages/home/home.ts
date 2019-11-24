import { Component, ViewChild } from "@angular/core";
import {
  App,
  NavController,
  NavParams,
  ViewController,
  ActionSheetController,
  Platform,
  ModalController,
  Slides,
  LoadingController,
  LoadingOptions,
  Nav
} from "ionic-angular";
import {
  AccountInfo,
  TransactionType,
  Transaction,
  AggregateTransaction,
  PublicAccount,
} from "tsjs-xpx-chain-sdk";
import { TranslateService } from "@ngx-translate/core";
import { animate, style, transition, trigger } from "@angular/animations";
import { App as AppConfig } from "../../providers/app/app";
import { WalletProvider, CatapultsAccountsInterface } from "../../providers/wallet/wallet";
import { UtilitiesProvider } from "../../providers/utilities/utilities";
import { AlertProvider } from "../../providers/alert/alert";
import { HapticProvider } from "../../providers/haptic/haptic";
import { GetMarketPricePipe } from "../../pipes/get-market-price/get-market-price";
import { MosaicsProvider } from "../../providers/mosaics/mosaics";
import { TransactionsProvider } from "../../providers/transactions/transactions";
import { DefaultMosaic } from "../../models/default-mosaic";
import { ProximaxProvider } from '../../providers/proximax/proximax';

@Component({
  selector: "page-home",
  templateUrl: "home.html",
  animations: [
    trigger("itemState", [
      transition("void => *", [
        style({ transform: "translateX(-100%)" }),
        animate("250ms ease-out")
      ]),
      transition("* => void", [
        animate("250ms ease-in", style({ transform: "translateX(100%)" }))
      ])
    ])
  ],
  providers: [GetMarketPricePipe]
})
export class HomePage {
  amount: string;
  hex: string;

  mosaicName: string[];

  @ViewChild(Slides) slides: Slides;

  menu = "mosaics";
  AppConfig = AppConfig;

  mosaics: Array<DefaultMosaic> = [];
  accounts: Array<CatapultsAccountsInterface> = [];

  data: any[] = [];
  totalWalletBalance = 0;

  App = App;
  TransactionType = TransactionType;

  unconfirmedTransactions: Array<Transaction> = [];
  aggregateTransactions: Array<AggregateTransaction> = [];
  confirmedTransactions = [];
  showEmptyTransaction: boolean = false;
  showEmptyMosaic: boolean = false;
  isLoading: boolean = false;

  tablet: boolean;

  selectedWallet: CatapultsAccountsInterface;
  selectedAccount: CatapultsAccountsInterface;
  accountInfo: AccountInfo;

  @ViewChild(Nav) navChild: Nav;
  address: any;

  constructor(
    public app: App,
    public actionSheetCtrl: ActionSheetController,
    public alertProvider: AlertProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
    public platform: Platform,
    private modalCtrl: ModalController,
    private haptic: HapticProvider,
    private marketPrice: GetMarketPricePipe,
    private translateService: TranslateService,
    public mosaicsProvider: MosaicsProvider,
    private transactionsProvider: TransactionsProvider,
    public loadingCtrl: LoadingController,
    private proximaxProvider: ProximaxProvider
  ) { }


  ionViewWillEnter() {
    this.utils.setHardwareBack();
    console.log('\n\n ------------ ionViewWillEnter ---> this.init() -------------------');
    this.init();
  }

  /**
   *
   *
   * @memberof HomePage
   */
  async init() {
    this.totalWalletBalance = 0;
    this.menu = "mosaics";

    if (window.screen.width >= 768) {
      // 768px portrait
      this.tablet = true;
    }

    let options: LoadingOptions = {
      content: "Loading..."
    };

    let loader = this.loadingCtrl.create(options);
    loader.present();
    this.totalWalletBalance = 0;
    this.showLoaders();
    this.walletProvider.getAccountsCatapult().then(catapulAccounts => {
      this.accounts = catapulAccounts;
      if (this.accounts.length > 0) {
        this.walletProvider.getAccountSelected().then(selectedAccount => {
          if (selectedAccount) {
            this.selectedAccount = selectedAccount;
          } else {
            this.selectedAccount = catapulAccounts[0];
          }

          // Slide to selected wallet
          this.accounts.forEach((acc, index) => {
            if (this.selectedAccount.account.name === acc.account.name) {
              this.slides.slideTo(index);
            }
          });

          this.address = this.proximaxProvider.createFromRawAddress(this.selectedAccount.account.address['address'])
          try {
            this.mosaicsProvider.getMosaics(this.address).subscribe(mosaics => {
              if (mosaics === null) {
                this.showEmptyMessage();
                this.hideLoaders();
                loader.dismiss();
              } else {
                this.mosaicsProvider.computeTotalBalance(mosaics).then(total => {
                  this.totalWalletBalance = total as number;
                });

                this.confirmedTransactions = [];
                this.unconfirmedTransactions = [];
                this.aggregateTransactions = [];
                this.mosaics = mosaics;
                this.getConfirmedTxn(this.selectedAccount.publicAccount);
                this.getTransactionsUnconfirmed(this.selectedAccount.publicAccount);
                this.getTransactionsAggregate(this.selectedAccount.publicAccount);
                this.hideEmptyMessage();
                this.hideLoaders();
                loader.dismiss();
              }
            }, error => {
              this.showEmptyMessage();
              this.hideLoaders();
              loader.dismiss();
            });
          } catch (error) {
            console.log('error ', error);
            this.showEmptyMessage();
            this.hideLoaders();
            loader.dismiss();
          }
        });
      } else {
        this.showEmptyMessage();
        this.hideLoaders();
        loader.dismiss();
      }
    });
  }

  /**
   *
   *
   * @param {CatapultsAccountsInterface} selectedAccount
   * @memberof HomePage
   */
  async onWalletSelect(selectedAccount: CatapultsAccountsInterface) {
    console.log('\n\n-----------onWalletSelect --> init()-----------------\n\n');

    if (this.selectedAccount.account === selectedAccount.account) {
      this.selectedAccount = selectedAccount;
    }

    await this.walletProvider.setSelectedAccount(selectedAccount).then(async () => {
      await this.init();
    });
  }



  /**
   *
   *
   * @param {CatapultsAccountsInterface} selectedAccount
   * @memberof HomePage
   */
  async showWalletDetails(selectedAccount: CatapultsAccountsInterface) {
    console.log('------------showWalletDetails ---> this.init() -------------------');
    this.selectedAccount = selectedAccount;
    const page = "TransactionListPage";
    const transactions = this.confirmedTransactions;
    const unconfirmedTransactions = this.unconfirmedTransactions;
    const aggregateTransactions = this.aggregateTransactions;
    const total = this.totalWalletBalance;
    const mosaics = this.mosaics;
    const payload = { selectedAccount, transactions, aggregateTransactions, unconfirmedTransactions, total, mosaics };
    const modal = this.modalCtrl.create(page, payload, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });

    modal.present();
  }

  /**
   *
   *
   * @param {*} refresher
   * @memberof HomePage
   */
  doRefresh(refresher: any) {
    console.log('\n\n ------------ Begin async operation ---> this.init() -------------------');
    setTimeout(async () => {
      this.mosaics = null; // Triggers the skeleton list loader
      try {
        await this.init();
        refresher.complete();
      } catch (error) {
        this.isLoading = false;
        refresher.complete();
      }
    }, 1500);
  }

  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @memberof HomePage
   */
  getConfirmedTxn(publicAccount: PublicAccount, id = null) {
    let options: LoadingOptions = {
      content: "Loading..."
    };

    let loader = this.loadingCtrl.create(options);
    loader.present();
    this.isLoading = true;
    this.transactionsProvider.getAllTransactionsFromAccount(publicAccount, id).subscribe(transactions => {
      this.isLoading = false;
      loader.dismiss();
      if (transactions.length > 0) {
        this.confirmedTransactions = (!this.confirmedTransactions) ? [] : this.confirmedTransactions;
        const txn = this.confirmedTransactions;
        transactions.forEach(element => {
          txn.push(element);
        });

        this.confirmedTransactions = txn;
      }
    }, error => {
      this.isLoading = false;
      loader.dismiss();
    });
  }

  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @memberof HomePage
   */
  getTransactionsUnconfirmed(publicAccount: PublicAccount) {
    this.isLoading = true;
    this.transactionsProvider.getAllTransactionsUnconfirmed(publicAccount).subscribe(transactions => {
      if (transactions) {
        const transferTransactionsUnconfirmed: Array<Transaction> = transactions.filter(tx => tx.type == TransactionType.TRANSFER);
        this.unconfirmedTransactions = transferTransactionsUnconfirmed;
        this.showEmptyTransaction = false;
      } else {
        this.showEmptyTransaction = true;
      }
    });
    this.isLoading = false;
  }

  /**
   *
   *
   * @param {PublicAccount} publicAccount
   * @memberof HomePage
   */
  getTransactionsAggregate(publicAccount: PublicAccount) {
    this.isLoading = true;
    this.transactionsProvider.getAllTransactionsAggregate(publicAccount).subscribe(transactions => {
      if (transactions) {
        const transferTransactionsAggregate: Array<AggregateTransaction> = transactions.filter(tx => tx.innerTransactions[0].type == TransactionType.TRANSFER);
        this.aggregateTransactions = transferTransactionsAggregate;
        this.showEmptyTransaction = false;
      } else {
        this.showEmptyTransaction = true;
      }
    });
    this.isLoading = false;
  }

  /**
   *
   *
   * @memberof HomePage
   */
  hideEmptyMessage() {
    this.showEmptyMosaic = false;
    this.showEmptyTransaction = false;
  }

  /**
   *
   *
   * @memberof HomePage
   */
  hideLoaders() {
    this.isLoading = false;
  }

  /**
   *
   *
   * @memberof HomePage
   */
  slideChanged() {
    this.mosaics = null;
    this.unconfirmedTransactions = null;
    this.confirmedTransactions = null;
    this.showEmptyTransaction = true;
    this.showEmptyMosaic = true;
    let currentIndex = this.slides.getActiveIndex();
    if (this.accounts.length !== currentIndex) {
      this.onWalletSelect(this.accounts[currentIndex]);
      this.haptic.selection();
    } else {
      this.mosaics = null;
      this.isLoading = false;
      this.unconfirmedTransactions = null;
      this.confirmedTransactions = null;
      this.showEmptyTransaction = true;
      this.showEmptyMosaic = true;
    }
  }

  /**
  *
  *
  * @memberof HomePage
  */
  showEmptyMessage() {
    this.mosaics = null;
    this.confirmedTransactions = null;
    this.unconfirmedTransactions = null;
    this.showEmptyMosaic = true;
    this.showEmptyTransaction = true;
  }

  /**
   *
   *
   * @memberof HomePage
   */
  showLoaders() {
    this.isLoading = true;
    this.showEmptyTransaction = true;
    this.showEmptyMosaic = true;
    this.unconfirmedTransactions = null;
    this.aggregateTransactions = null;
    this.confirmedTransactions = null;
  }


  // -----------------------------------------------------------------------------------




  getAbsoluteAmount(amount, divisibility) {
    return this.proximaxProvider.amountFormatter(amount, divisibility)
  }


  async showAddWalletPrompt() {
    await this.alertProvider.showAddWalletPrompt().then(option => {
      if (option === "create") {
        this.navCtrl.push("WalletAddPage");
      } else {
        this.navCtrl.push("WalletAddPrivateKeyPage", {
          name: "",
          privateKey: "",
          password: ""
        });
      }
    });
  }

  /**
   *
   *
   * @memberof HomePage
   */
  gotoWalletList() {
    this.utils.setRoot("TabsPage");
  }

  /**
   *
   *
   * @param {*} mosaic
   * @memberof HomePage
   */
  gotoCoinPrice(mosaic) {
    let coinName = "";
    if (mosaic.mosaicId === "xem") {
      coinName = "nem";
    } else if (mosaic.mosaicId === "xpx") {
      coinName = "proximax";
    } else if (mosaic.mosaicId === "npxs") {
      coinName = "pundi-x";
    } else if (mosaic.mosaicId === "sft") {
      coinName = "sportsfix";
    }

    this.marketPrice.transform(mosaic.mosaicId).then(price => {
      const totalBalance = mosaic.amount * price;
      const mosaicHex = mosaic.hex;
      const mosaicId = mosaic.mosaicId;
      const namespaceId = mosaic.namespaceId;
      const coinId = coinName;
      const selectedAccount = this.selectedAccount;
      const transactions = this.confirmedTransactions;
      const mosaicAmount = mosaic.amount;
      const mosaics = this.mosaics;
      const payload = {
        totalBalance,
        mosaicHex,
        mosaicId,
        namespaceId,
        coinId,
        selectedAccount,
        transactions,
        mosaicAmount,
        mosaics
      };
      let page = "CoinPriceChartPage";

      const modal = this.modalCtrl.create(page, payload, {
        enableBackdropDismiss: false,
        showBackdrop: true
      });
      modal.present();
    });
  }

  /**
   *
   *
   * @param {Transaction} tx
   * @param {string} status
   * @memberof HomePage
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
   * @memberof HomePage
   */
  showReceiveModal() {
    const page = "ReceivePage";
    this.showModal(page, {});
  }

  /**
   *
   *
   * @param {*} page
   * @param {*} params
   * @memberof HomePage
   */
  showModal(page, params) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }
}
