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

import { App as AppConfig } from "../../providers/app/app";
import { WalletProvider } from "../../providers/wallet/wallet";
import { UtilitiesProvider } from "../../providers/utilities/utilities";
import { AlertProvider } from "../../providers/alert/alert";
import { HapticProvider } from "../../providers/haptic/haptic";
import { GetMarketPricePipe } from "../../pipes/get-market-price/get-market-price";
import { TranslateService } from "@ngx-translate/core";
import {
  SimpleWallet,
  Account,
  AccountInfo,
  TransactionType,
  Transaction,
  AggregateTransaction,
} from "tsjs-xpx-chain-sdk";
import { MosaicsProvider } from "../../providers/mosaics/mosaics";
import { TransactionsProvider } from "../../providers/transactions/transactions";
import { animate, style, transition, trigger } from "@angular/animations";
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
  wallets: Array<SimpleWallet> = [];

  fakeList: Array<any>;
  data: any[] = [];
  totalWalletBalance = 0;

  App = App;
  TransactionType = TransactionType;

  unconfirmedTransactions: Array<Transaction> = [];
  aggregateTransactions: Array<AggregateTransaction> = [];
  confirmedTransactions: Array<any> = [];
  showEmptyTransaction: boolean = false;
  showEmptyMosaic: boolean = false;
  isLoading: boolean = false;

  tablet: boolean;

  selectedWallet: any;
  selectedAccount: Account;
  accountInfo: AccountInfo;

  @ViewChild(Nav) navChild: Nav;
  address: any;

  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertProvider: AlertProvider,
    public walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private modalCtrl: ModalController,
    private haptic: HapticProvider,
    private marketPrice: GetMarketPricePipe,
    private translateService: TranslateService,
    public mosaicsProvider: MosaicsProvider,
    private transactionsProvider: TransactionsProvider,
    public loadingCtrl: LoadingController,
    private proximaxProvider: ProximaxProvider
  ) {
    //   this.platform.ready().then(()=> {

    //     this.deeplinks.routeWithNavController(this.navChild, {
    //      '/send': "SendPage",
    //    }).subscribe((match) => {
    //      console.log('Successfully routed', JSON.stringify(match));

    //      let page = "SendPage";
    //      this.showModal(page, { mosaicSelectedName: 'xpx', payload: match.$args })

    //      // isDeepLink = true;
    //      // redirectLink = match.$route;
    //      // params = match.$args

    //      // return;
    //    }, (nomatch) => {
    //      console.log('Unmatched Route', nomatch);        
    //  });
    //  })

  }

  ionViewDidEnter() {

  }

  ionViewWillEnter() {
    this.utils.setHardwareBack();
    this.init();
  }

  async init() {
    this.fakeList = [{}, {}];
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

    this.walletProvider.getWallets().then(wallets => {

      this.wallets = wallets;
      // console.log(
      //   "1. LOG: HomePage -> ionViewWillEnter -> this.wallets",
      //   this.wallets
      // );

      if (this.wallets.length > 0) {
        this.walletProvider.getSelectedWallet().then(selectedWallet => {

          if (selectedWallet) {
            if (Array.isArray(selectedWallet)) {
              // console.log(
              //   "LOG: HomePage -> init -> selectedWallet",
              //   JSON.stringify(selectedWallet, null, 2)
              // );
              this.selectedWallet = selectedWallet
                ? selectedWallet[0]
                : wallets[0];
              // console.log(
              //   "3. LOG: HomePage -> ionViewWillEnter -> myWallet",
              //   this.selectedWallet[0]
              // );
            } else {
              this.selectedWallet = selectedWallet
                ? selectedWallet
                : wallets[0];
              // console.log(
              //   "3. LOG: HomePage -> ionViewWillEnter -> myWallet",
              //   this.selectedWallet
              // );
            }
          } else {
            this.selectedWallet = wallets[0];
            // console.log(
            //   "LOG: HomePage -> init -> this.selectedWallet",
            //   JSON.stringify(this.selectedWallet, null, 2)
            // );
          }

          // Slide to selected wallet
          this.wallets.forEach((wallet, index) => {
            if (this.selectedWallet.account.name === wallet['account'].name) {
              this.slides.slideTo(index);
            }
          });
          this.address = this.proximaxProvider.createFromRawAddress(this.selectedWallet.account.address.address)
          console.log(
            "4. LOG: HomePage -> ionViewWillEnter -> account",
            this.address
          );
          try {
            this.mosaicsProvider
              .getMosaics(this.address)
              .subscribe(mosaics => {
                // console.log("5. TCL: HomePage -> init -> mosaics", mosaics);
                // console.log("6. LOG: HomePage -> init -> _myMergedMosaics");
                this.mosaics = mosaics;

                // Compute wallet balance in USD
                // console.log(
                //   "7. LOG: HomePage -> computeTotalBalance -> mosaics",
                //   mosaics
                // );
                this.mosaicsProvider
                  .computeTotalBalance(mosaics)
                  .then(total => {
                    this.totalWalletBalance = total as number;
                    // console.log(this.totalWalletBalance);
                    // console.log(
                    //   "SIRIUS CHAIN WALLET: HomePage -> init -> total",
                    //   total
                    // );
                    // loader.dismiss();
                  });

                // Show Transactions
                // console.log(
                //   "8. LOG: HomePage -> getTransactions -> selectedWallet",
                //   this.selectedWallet
                // );
                this.getTransactions(this.selectedWallet);
                this.getTransactionsUnconfirmed(this.selectedWallet);
                this.getTransactionsAggregate(this.selectedWallet);
              });
          } catch (error) {
            // this.hideLoaders();
            this.showEmptyMessage();
          }
        });
        this.hideEmptyMessage();
      } else {
        // this.hideLoaders();
        this.showEmptyMessage();
      }
      this.hideLoaders();
      loader.dismiss();
    });
  }
  showEmptyMessage() {
    this.mosaics = null;
    this.confirmedTransactions = null;
    this.unconfirmedTransactions = null;
    this.showEmptyMosaic = true;
    this.showEmptyTransaction = true;
  }
  hideEmptyMessage() {
    this.showEmptyMosaic = false;
    this.showEmptyTransaction = false;
  }
  hideLoaders() {
    this.isLoading = false;
  }
  showLoaders() {
    this.isLoading = true;
    this.showEmptyTransaction = true;
    this.showEmptyMosaic = true;
    this.unconfirmedTransactions = null;
    this.aggregateTransactions = null;
    this.confirmedTransactions = null;
  }

  getTransactions(account: Account) {
    this.isLoading = true;
    this.transactionsProvider
      .getAllTransactionsFromAccount(account.publicAccount)
      .subscribe(transactions => {
        if (transactions) {
          const transferTransactions: Array<Transaction> = transactions.filter(
            tx => tx.type == TransactionType.TRANSFER
          );
          this.confirmedTransactions = transferTransactions;
          // console.log(
          //   "this.confirmedTransactions ",
          //   this.confirmedTransactions
          // );
          this.showEmptyTransaction = false;
        } else {
          this.showEmptyTransaction = true;
        }
      });
    this.isLoading = false;
  }

  getTransactionsUnconfirmed(account: Account) {
    this.isLoading = true;
    this.transactionsProvider
      .getAllTransactionsUnconfirmed(account.publicAccount)
      .subscribe(transactions => {
        if (transactions) {
          const transferTransactionsUnconfirmed: Array<
            Transaction
          > = transactions.filter(tx => tx.type == TransactionType.TRANSFER);
          this.unconfirmedTransactions = transferTransactionsUnconfirmed;
          // console.log(
          //   "this.unconfirmedTransactions ",
          //   this.unconfirmedTransactions
          // );
          this.showEmptyTransaction = false;
        } else {
          this.showEmptyTransaction = true;
        }
      });
    this.isLoading = false;
  }

  getTransactionsAggregate(account: Account) {
    this.isLoading = true;
    this.transactionsProvider
      .getAllTransactionsAggregate(account.publicAccount)
      .subscribe(transactions => {
        // console.log('TCL: HomePage -> getTransactionsAggregate -> aggregateTransactions', transactions);
        if (transactions) {
          const transferTransactionsAggregate: Array<AggregateTransaction> = transactions.filter(tx => tx.innerTransactions[0].type == TransactionType.TRANSFER);
          this.aggregateTransactions = transferTransactionsAggregate;
          // console.log("this.aggregateTransactions ", this.aggregateTransactions);
          this.showEmptyTransaction = false;
        } else {
          this.showEmptyTransaction = true;
        }
      });
    this.isLoading = false;
  }

  async onWalletSelect(wallet) {
    if (this.selectedWallet.account === wallet.account) {
      this.selectedWallet = wallet;
    }
    await this.walletProvider.setSelectedWallet(wallet).then(async () => {
      await this.init();

    });
  }

  async showWalletDetails(wallet) {
    this.selectedWallet = wallet;
    let page = "TransactionListPage";
    let selectedAccount = this.selectedWallet;
    let transactions = this.confirmedTransactions;
    let aggregateTransactions = this.aggregateTransactions;
    let total = this.totalWalletBalance;
    let mosaics = this.mosaics;
    let payload = { selectedAccount, transactions, aggregateTransactions, total, mosaics };
    const modal = this.modalCtrl.create(page, payload, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    await modal.present().then(_ => {
      this.init();
    });
  }

  getAbsoluteAmount(amount, divisibility) {
    return this.proximaxProvider.amountFormatter(amount, divisibility)
  }

  onWalletPress(wallet) {
    this.haptic.impact({ style: "heavy" });
    this.selectedWallet = wallet;
    let editButton = this.translateService.instant("WALLETS.EDIT");
    let deleteButton = this.translateService.instant("WALLETS.DELETE");
    let cancelButton = this.translateService.instant("WALLETS.BUTTON.CANCEL");

    const actionSheet = this.actionSheetCtrl.create({
      title: ``,
      cssClass: "wallet-on-press",
      buttons: [
        {
          text: editButton,
          icon: this.platform.is("ios") ? null : "create",
          handler: () => {
            this.navCtrl.push("WalletUpdatePage", { wallet: wallet });
          }
        },
        {
          text: deleteButton,
          role: "destructive",
          icon: this.platform.is("ios") ? null : "trash",
          handler: () => {
            let page = "WalletDeletePage";
            this.showModal(page, { wallet: wallet });
          }
        },
        {
          text: cancelButton,
          role: "cancel",
          icon: this.platform.is("ios") ? null : "close",
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
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

  public gotoWalletList() {
    this.utils.setRoot("TabsPage");
  }

  public gotoCoinPrice(mosaic) {
    let coinName: string;

    if (mosaic.mosaicId === "xem") {
      coinName = "nem";
    } else if (mosaic.mosaicId === "xpx") {
      coinName = "proximax";
    } else if (mosaic.mosaicId === "npxs") {
      coinName = "pundi-x";
    } else if (mosaic.mosaicId === "sft") {
      coinName = "sportsfix";
    } else {
      coinName = "";
    }

    this.marketPrice.transform(mosaic.mosaicId).then(price => {
      const totalBalance = mosaic.amount * price;
      const mosaicHex = mosaic.hex;
      const mosaicId = mosaic.mosaicId;
      const namespaceId = mosaic.namespaceId;
      const coinId = coinName;
      const selectedAccount = this.selectedWallet;
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

  gotoTransactionDetail(tx) {
    const page = "TransactionDetailPage";
    const transactions = tx;
    const mosaics = this.mosaics;
    const payload = { transactions, mosaics };
    this.showModal(page, payload);
  }

  showReceiveModal() {
    const page = "ReceivePage";
    this.showModal(page, {});
  }

  showModal(page, params) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  doRefresh(refresher) {
    console.log("Begin async operation", refresher);

    setTimeout(async () => {
      this.mosaics = null; // Triggers the skeleton list loader
      console.log("Async operation has ended");
      try {
        await this.init();
        refresher.complete();
      } catch (error) {
        this.isLoading = false;
        refresher.complete();
      }
    }, 1500);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (this.wallets.length != currentIndex) {
      this.onWalletSelect(this.wallets[currentIndex]);
      console.log('this.wallets', this.wallets);
      
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

  showWalletList() {
    console.log('aqio log');
    
    this.haptic.impact({ type: "heavy" });
    const page = "WalletListPage";
    this.utils
      .showInsetModal(page, { wallets: this.wallets })
      .subscribe(data => {
        console.log(
          "SIRIUS CHAIN WALLET: HomePage -> showWalletList -> data",
          data
        );
        const wallet = data.account;
        const index = data.index;
        console.log('wallet',wallet);
        console.log('index',index);
        
        if (wallet) {
          this.slides.slideTo(index);
          this.onWalletSelect(wallet);
        }
      });
  }
}
