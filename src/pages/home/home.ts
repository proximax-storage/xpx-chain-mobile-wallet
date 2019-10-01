import { Component, ViewChild } from '@angular/core';
import { App, NavController, NavParams, ViewController, ActionSheetController, Platform, ModalController, Slides, LoadingController, LoadingOptions } from 'ionic-angular';

import { App as AppConfig } from '../../providers/app/app';
import { WalletProvider } from '../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { AlertProvider } from '../../providers/alert/alert';
import { HapticProvider } from '../../providers/haptic/haptic';
import { GetMarketPricePipe } from '../../pipes/get-market-price/get-market-price';
import { TranslateService } from '@ngx-translate/core';
import { SimpleWallet, Mosaic, Password, Account, AccountInfo, TransactionType, Transaction, MosaicInfo } from 'tsjs-xpx-chain-sdk';
import { AuthProvider } from '../../providers/auth/auth';
import { MosaicsProvider } from '../../providers/mosaics/mosaics';
import { TransactionsProvider } from '../../providers/transactions/transactions';
import { Observable, from } from 'rxjs';
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('itemState', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('250ms ease-out')
      ]),
      transition('* => void', [
        animate('250ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  providers: [GetMarketPricePipe]
})
export class HomePage {
  mosaicInfo: { mosaicId: string; namespaceId: string; hex: string; amount: string; disivitity: any; };
  amount: string;
  disivitity: MosaicInfo;
  hex: string;

  mosaicName: string[];


  @ViewChild(Slides) slides: Slides;

  menu = 'mosaics';
  AppConfig = AppConfig;

  mosaics: Array<any>;
  wallets: SimpleWallet[];

  fakeList: Array<any>;
  data: any[] = [];
  totalWalletBalance = 0;

  App = App;
  TransactionType = TransactionType;

  unconfirmedTransactions: Array<Transaction>;
  confirmedTransactions: Array<any>;
  showEmptyTransaction: boolean = false;
  showEmptyMosaic: boolean = false;
  isLoading: boolean = false;

  tablet: boolean;

  selectedWallet: SimpleWallet;
  selectedAccount: Account;
  accountInfo: AccountInfo;

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
    private authProvider: AuthProvider,
    public mosaicsProvider: MosaicsProvider,
    private transactionsProvider: TransactionsProvider,
    public loadingCtrl: LoadingController,
  ) {
    

  }

  ionViewWillEnter() {
    console.log("1 ionViewWillEnter");
    this.utils.setHardwareBack();
    this.init();
  }

  async init() {
    this.fakeList = [{}, {}];
    this.totalWalletBalance = 0;
    this.menu = "mosaics";

    if (window.screen.width >= 768) { // 768px portrait
      this.tablet = true;
    }

    let options:LoadingOptions = {
      content: 'Loading...'
    };

    let loader = this.loadingCtrl.create(options);

    loader.present();
    this.totalWalletBalance = 0;



    this.showLoaders();

    this.walletProvider.getWallets().then(wallets => {

      this.wallets = this.walletProvider.convertToSimpleWallets(wallets);
      console.log("1. LOG: HomePage -> ionViewWillEnter -> this.wallets", this.wallets);

      if (this.wallets.length > 0) {

        this.walletProvider.getSelectedWallet().then(selectedWallet => {
          // console.log("2. Selected wallet:", JSON.stringify(selectedWallet, null, 4));

          

          // console.log('LOG: HomePage -> init -> selectedWallet', JSON.stringify(selectedWallet, null, 4));
          

          if (selectedWallet) {
            if (Array.isArray(selectedWallet)) {
              console.log('LOG: HomePage -> init -> selectedWallet', JSON.stringify(selectedWallet, null, 2));
              this.selectedWallet = selectedWallet ? selectedWallet[0] : wallets[0];
              console.log("3. LOG: HomePage -> ionViewWillEnter -> myWallet", this.selectedWallet[0]);
            } else {
              this.selectedWallet = selectedWallet ? selectedWallet : wallets[0];
              console.log("3. LOG: HomePage -> ionViewWillEnter -> myWallet", this.selectedWallet);
            }
          } else {
            this.selectedWallet = wallets[0];
            console.log('LOG: HomePage -> init -> this.selectedWallet', JSON.stringify(this.selectedWallet, null, 2));
          }

          // Slide to selected wallet
          this.wallets.forEach((wallet, index) => {
            if (this.selectedWallet.name === wallet.name) {
              this.slides.slideTo(index);
            }
          })

          



          this.getAccount(this.selectedWallet).subscribe(account => {
            console.log("4. LOG: HomePage -> ionViewWillEnter -> account", account);
            this.selectedAccount = account;

            try {
              this.walletProvider.getAccountInfo(account).subscribe(accountInfo => {
                console.log("5. LOG: HomePage -> ionViewWillEnter -> accountInfo", accountInfo);

                // Owned mosaics
                const ownedMosaics = accountInfo.mosaics
                console.log('Owned mosaics', ownedMosaics)

                // Merge owned mosaics & default mosaics
                const myMergedMosaics = from(this.mosaicsProvider.getMosaicInfo(ownedMosaics));

                myMergedMosaics.subscribe(_myMergedMosaics => {
                  console.log('6. LOG: HomePage -> init -> _myMergedMosaics');
                  this.mosaics = _myMergedMosaics;

                  // this.isLoading = false;
                  // Update asset info
                  // console.log("7. LOG: HomePage -> updateAssetsInfo", accountInfo)
                  // this.updateAssetsInfo(accountInfo);

                  // Compute wallet balance in USD
                  console.log("7. LOG: HomePage -> computeTotalBalance -> mosaics", _myMergedMosaics)
                  this.mosaicsProvider.computeTotalBalance(_myMergedMosaics).then(total => {
                    this.totalWalletBalance = total as number;
                    console.log("SIRIUS CHAIN WALLET: HomePage -> init -> total", total)
                    // loader.dismiss();
                  });

                  // Show Transactions
                  console.log("8. LOG: HomePage -> getTransactions -> selectedWallet", this.selectedWallet);
                  this.getTransactions(account);
                  this.getTransactionsUnconfirmed(account);
                  // this.hideLoaders();
                })
              }, err => {
                // this.hideLoaders();
                this.showEmptyMessage();
              })
            } catch (error) {
              // this.hideLoaders();
              this.showEmptyMessage();
            }
          })
        })
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
    this.confirmedTransactions = null

  }

  private getAccount(wallet: SimpleWallet): Observable<Account> {
    return new Observable(observer => {
      // Get user's password and unlock the wallet to get the account
      this.authProvider
        .getPassword()
        .then(password => {
          // Get user's password
          const myPassword = new Password(password);

          // Convert current wallet to SimpleWallet
          const myWallet = this.walletProvider.convertToSimpleWallet(wallet)

          // Unlock wallet to get an account using user's password 
          const account = myWallet.open(myPassword);

          observer.next(account);

        });
    });
  }

  getTransactions(account: Account) {
    this.isLoading = true;
    this.transactionsProvider.getAllTransactionsFromAccount(account.publicAccount).subscribe(transactions => {
      if (transactions) {
        const transferTransactions: Array<Transaction> = transactions.filter(tx => tx.type == TransactionType.TRANSFER)
        this.confirmedTransactions = transferTransactions;
        console.log('this.confirmedTransactions ', this.confirmedTransactions)
        this.showEmptyTransaction = false;
      } else {
        this.showEmptyTransaction = true
      }
    });
    this.isLoading = false;
  }

  getTransactionsUnconfirmed(account: Account) {
    this.isLoading = true;
    this.transactionsProvider.getAllTransactionsUnconfirmed(account.publicAccount).subscribe(transactions => {
      if (transactions) {
        const transferTransactionsUnconfirmed: Array<Transaction> = transactions.filter(tx => tx.type == TransactionType.TRANSFER)
        this.unconfirmedTransactions = transferTransactionsUnconfirmed;
        console.log('this.unconfirmedTransactions ', this.unconfirmedTransactions)
        this.showEmptyTransaction = false;
      } else {
        this.showEmptyTransaction = true
      }
    });
    this.isLoading = false;
  }

  async onWalletSelect(wallet) {
    console.log("LOG: HomePage -> onWalletSelect -> wallet", wallet);
    if(this.selectedWallet===wallet) {
      this.selectedWallet = wallet;
    }
    await this.walletProvider.setSelectedWallet(wallet).then(async () => {
      await this.init();
    });
  }

  async showWalletDetails(wallet) {
    this.selectedWallet = wallet;
    let page = 'TransactionListPage';
    
    let selectedAccount = this.selectedWallet
    let transactions = this.confirmedTransactions;
    let total = this.totalWalletBalance;
    let mosaics = this.mosaics;

    let payload = { selectedAccount, transactions, total, mosaics };

    const modal = this.modalCtrl.create(page, payload, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    await modal.present().then(_=> {
      this.init();
    })

  }

  onWalletPress(wallet) {
    this.haptic.impact({ style: 'heavy' });

    this.selectedWallet = wallet;

    let editButton = this.translateService.instant("WALLETS.EDIT");
    let deleteButton = this.translateService.instant("WALLETS.DELETE");
    let cancelButton = this.translateService.instant("WALLETS.BUTTON.CANCEL");

    const actionSheet = this.actionSheetCtrl.create({
      title: ``,
      cssClass: 'wallet-on-press',
      buttons: [
        {
          text: editButton,
          icon: this.platform.is('ios') ? null : 'create',
          handler: () => {
            this.navCtrl.push('WalletUpdatePage', { wallet: wallet });
          }
        },
        {
          text: deleteButton,
          role: 'destructive',
          icon: this.platform.is('ios') ? null : 'trash',
          handler: () => {
            let page = "WalletDeletePage";
            this.showModal(page, { wallet: wallet });
          }
        },
        {
          text: cancelButton,
          role: 'cancel',
          icon: this.platform.is('ios') ? null : 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  async showAddWalletPrompt() {
    await this.alertProvider.showAddWalletPrompt().then(option => {
      if (option === 'create') {
        this.navCtrl.push('WalletAddPage');
      } else {
        this.navCtrl.push("WalletAddPrivateKeyPage", {
          name: "",
          privateKey: ""
        });
      }
    })
  }

  public gotoWalletList() {
    this.utils.setRoot('TabsPage');
  }

  public gotoCoinPrice(mosaic) {

    console.log('mosaicmosaicmosaic', mosaic)
    // console.log("LOG: HomePage -> publicgotoCoinPrice -> mosaic", mosaic);
    // console.log("SIRIUS CHAIN WALLET: HomePage -> gotoCoinPrice -> this.confirmedTransactions", this.confirmedTransactions)

    let coinName: string;

    if (mosaic.mosaicId === 'xem') {
      coinName = 'nem';
    }
    else if (mosaic.mosaicId === 'xpx') {
      coinName = 'proximax';
    } else if (mosaic.mosaicId === 'npxs') {
      coinName = 'pundi-x';
    } else if (mosaic.mosaicId === 'sft') {
      coinName = 'sportsfix';
    } else {
      coinName = '';
    }

    this.marketPrice.transform(mosaic.mosaicId).then(price => {
      console.log("LOG: HomePage -> publicgotoCoinPrice -> price", price);
      const totalBalance = mosaic.amount * price;
      const mosaicHex =  mosaic.hex;
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
      }
      let page = "CoinPriceChartPage";
      
      const modal = this.modalCtrl.create(page, payload, {
          enableBackdropDismiss: false,
          showBackdrop: true
        });
      modal.present();
    })
  }

  gotoTransactionDetail(tx) {
    const page = "TransactionDetailPage";

    const transactions = tx;
    const mosaics = this.mosaics;
    const payload = { transactions, mosaics};
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
    console.log('Begin async operation', refresher);

    setTimeout(async () => {
      this.mosaics = null; // Triggers the skeleton list loader
      console.log('Async operation has ended');
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
    console.log("slideChanged");
    let currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', currentIndex);

    if (this.wallets.length != currentIndex) {
      this.onWalletSelect(this.wallets[currentIndex])
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
    this.haptic.impact({ type: 'heavy' });
    const page = "WalletListPage";
    this.utils
      .showInsetModal(page, { wallets: this.wallets })
      .subscribe(data => {
        console.log("SIRIUS CHAIN WALLET: HomePage -> showWalletList -> data", data)
        const wallet = data.wallet;
        const index = data.index;
        if (wallet) {

          this.slides.slideTo(index);
          this.onWalletSelect(wallet);
        }

      });

  }
}