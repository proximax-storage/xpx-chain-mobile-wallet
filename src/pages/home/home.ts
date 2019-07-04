import { Component, ViewChild, trigger, transition, style, animate } from '@angular/core';
import { App, NavController, NavParams, ViewController, ActionSheetController, AlertController, Platform, InfiniteScroll, ModalController, Slides, Haptic, DateTime } from 'ionic-angular';
import { SimpleWallet, MosaicTransferable, TransactionTypes, Pageable, Transaction } from 'nem-library';

import { App as AppConfig } from '../../providers/app/app';
import { WalletProvider } from '../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { GetBalanceProvider } from '../../providers/get-balance/get-balance';
import { AlertProvider } from '../../providers/alert/alert';

import { NemProvider } from '../../providers/nem/nem';
import { Observable } from 'rxjs';
import { HapticProvider } from '../../providers/haptic/haptic';


import find from 'lodash/find';
import filter from 'lodash/filter';
import { GetMarketPricePipe } from '../../pipes/get-market-price/get-market-price';
import { TranslateService } from '@ngx-translate/core';



export enum WalletCreationType {
  NEW = 0,
  IMPORT = 1
}

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
  @ViewChild(Slides) slides: Slides;

  menu = 'mosaics';
  AppConfig = AppConfig;
  selectedMosaic: MosaicTransferable;
  mosaics: Array<MosaicTransferable>;
  wallets: SimpleWallet[];
  selectedWallet: SimpleWallet;
  fakeList: Array<any>;
  data: any[] = [];
  totalWalletBalance = 0;

  /** Transaction list member variables */
  App = App;
  TransactionTypes = TransactionTypes;
  currentWallet: SimpleWallet;
  // TransactionfakeList: Array<any>;
  unconfirmedTransactions: Array<any>;
  confirmedTransactions: Array<any>;
  showEmptyTransaction: boolean = false;
  showEmptyMosaic: boolean = false;
  isLoading: boolean = false;
  isLoadingInfinite: boolean = false;
  pageable: Pageable<Transaction[]>;
  @ViewChild(InfiniteScroll)
  private infiniteScroll: InfiniteScroll;
  tablet: boolean;



  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public getBalanceProvider: GetBalanceProvider,
    public alertProvider: AlertProvider,
    public walletProvider: WalletProvider,
    public utils: UtilitiesProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public platform: Platform,
    private modalCtrl: ModalController,
    private nemProvider: NemProvider,
    private haptic: HapticProvider,
    private marketPrice: GetMarketPricePipe,
    private translateService: TranslateService
  ) {
    this.totalWalletBalance = 0;
    this.menu = "mosaics";

    if (window.screen.width >= 768) { // 768px portrait
      this.tablet = true;
    }
   
  }
  ionViewDidEnter() {
	console.log("LOG: HomePage -> ionViewDidEnter -> ionViewDidEnter");
  }

  ionViewWillEnter() {
    console.log("1 ionViewWillEnter");
    this.utils.setHardwareBack();
    this.walletProvider.getWallets().then(wallets => {
      this.wallets = wallets


      if (this.wallets.length > 0) {
        // Show loader
        this.fakeList = [{}, {}];
        /** Transaction list business logic */

        this.isLoading = true;
        this.showEmptyTransaction = false;
        this.showEmptyMosaic = false;

        this.computeTotalWalletBalance(this.wallets);

        // this.unconfirmedTransactions = null;
        // this.confirmedTransactions = null;

        this.walletProvider.getSelectedWallet().then(selectedWallet => {
          console.log("Selected wallet:", selectedWallet);
          this.selectedWallet = selectedWallet ? selectedWallet : this.wallets[0];
          this.getTransactions(this.selectedWallet);
          this.getMosaicBalance(this.selectedWallet);
        }).catch(err => {
          this.selectedWallet = (!this.selectedWallet && this.wallets) ? this.wallets[0] : null;
          this.getTransactions(this.selectedWallet);
          this.getMosaicBalance(this.selectedWallet);
        });
      } else {
        this.showEmptyTransaction = true;
        this.showEmptyMosaic = true;
      }
    });


  }

  computeTotalWalletBalance(wallets: any) {
    console.log("2 computeTotalWalletBalance");
    wallets.map((wallet, index) => {
      this.getBalanceProvider.totalBalance(wallet).then(total => {
        if (wallet.name == this.selectedWallet.name) {
          this.slides.slideTo(index);
        }
        wallet.total = total;
        return wallet;
      })
    })
  }

  getTransactions(selectedWallet: SimpleWallet) {
    console.log("3 getTransactions");
    console.log("getTransactions", selectedWallet);
    // this.confirmedTransactions = null;
    // this.unconfirmedTransactions = null;
    this.isLoading = true;

    this.nemProvider
      .getUnconfirmedTransactions(selectedWallet.address)
      .flatMap(_ => _)
      .toArray()
      .subscribe(result => {
        this.unconfirmedTransactions = result;
      });


    this.nemProvider.getMosaicTransactions(selectedWallet.address).subscribe(mosaicTransactions => {
      let supportedMosaics = [
        { mosaicId: 'xpx' },
        { mosaicId: 'xem' },
        { mosaicId: 'npxs' },
        { mosaicId: 'sft' },
        { mosaicId: 'xar' },
      ]
      const filteredTransactions = filter(mosaicTransactions, (tx) => find(supportedMosaics, { mosaicId: tx._mosaics[0].mosaicId.name }));
      
      setTimeout(() => {
        this.nemProvider.getXEMTransactions(selectedWallet.address).subscribe(XEMTransactions => {
          const TRANSACTIONS = [].concat(filteredTransactions, XEMTransactions);
          // Check transaction is empty
          if (TRANSACTIONS.length == 0) {
            this.confirmedTransactions = null;
            this.showEmptyTransaction = true;
          } else {
            this.confirmedTransactions = TRANSACTIONS.sort((a,b) => {
              return new Date(b.timeWindow.timeStamp).getTime() - new Date(a.timeWindow.timeStamp).getTime()
            });
            this.showEmptyTransaction = false;
          }
          this.isLoading = false;
        })
      }, 1000);


    })

    return;
  }

  /**
   * Retrieves current account owned mosaics  into this.mosaics
   */
  public getMosaicBalance(selectedWallet: SimpleWallet) {
    console.log("4 getMosaicBalance");

    this.isLoading = true;
    this.mosaics = null; // Triggers the skeleton list loader
    this.getBalanceProvider
      .mosaics(selectedWallet.address)
      .subscribe(mosaics => {
        
        this.mosaics = mosaics;
        if (this.mosaics.length > 0) {
          this.isLoading = false;
          this.showEmptyMosaic = false;
          this.selectedMosaic =
            this.navParams.get('selectedMosaic') || this.mosaics[0];
        }
      });
  }



  slideChanged(index) {
    console.log("slideChanged");
    let currentIndex = index;
    console.log('Current index is', currentIndex);
    if (this.wallets.length != currentIndex) {
      this.showEmptyTransaction = false;
      this.showEmptyMosaic = false;
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
    this.ionViewWillEnter();
    this.menu = "mosaics"
  }

  trackByName(wallet) {
    return wallet.name;
  }

  onWalletSelect(wallet) {
    console.log("On wallet select");
    this.selectedWallet = wallet;
    this.walletProvider.setSelectedWallet(this.selectedWallet).then(() => {
      this.getMosaicBalance(this.selectedWallet);
      this.getTransactions(this.selectedWallet);
    });
  }

  showWalletDetails() {
    let page = 'TransactionListPage';
    let wallet = this.selectedWallet
    wallet.walletColor = this.wallets[this.slides._activeIndex].walletColor;
    const modal = this.modalCtrl.create(page, wallet, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
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

  showAddWalletPrompt() {
    this.haptic.selection();

    let alert = this.alertCtrl.create();
    const alertTitle = this.translateService.instant("WALLETS.CREATE.NEW");
    alert.setTitle(alertTitle);
    alert.setSubTitle('');

    let newWalletButton = this.translateService.instant("WALLETS.CREATE.NEW");
    let importWalletButton = this.translateService.instant("WALLETS.CREATE.IMPORT");

    alert.addInput({
      type: 'radio',
      label: newWalletButton,
      value: WalletCreationType.NEW.toString(),
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: importWalletButton,
      value: WalletCreationType.IMPORT.toString(),
      checked: false
    });
    const cancelButtonText = this.translateService.instant("WALLETS.BUTTON.CANCEL");
    const continueButtonText = this.translateService.instant("WALLETS.BUTTON.CONTINUE");
    alert.addButton(cancelButtonText);

    alert.addButton({
      text: continueButtonText,
      handler: data => {
        if (data === WalletCreationType.NEW.toString()) {
          this.navCtrl.push('WalletAddPage');
        } else if (data === WalletCreationType.IMPORT.toString()) {
          this.navCtrl.push("WalletAddPrivateKeyPage", {
            name: "",
            privateKey: ""
          });
        }
      }
    });

    alert.present();
  }

  public gotoWalletList() {
    this.utils.setRoot('TabsPage');
  }

  public gotoCoinPrice(mosaic) {
	console.log("LOG: HomePage -> publicgotoCoinPrice -> mosaic", mosaic);

    let coinId:string;

    if (mosaic.mosaicId.name === 'xem') {
      coinId = 'nem';
    }
    else if (mosaic.mosaicId.name === 'xpx') {
      coinId = 'proximax';
    } else if (mosaic.mosaicId.name === 'npxs') {
      coinId = 'pundi-x';
    } else {
      coinId = '';
    }

    this.marketPrice.transform(mosaic.mosaicId.name).then(price=>{
			console.log("LOG: HomePage -> publicgotoCoinPrice -> price", price);
      
      let totalBalance = mosaic.amount * price;
			console.log("LOG: HomePage -> publicgotoCoinPrice -> totalBalance", totalBalance);
    
      let page = "CoinPriceChartPage";
      const modal = this.modalCtrl.create(page, { 
        mosaicId: mosaic.mosaicId.name, 
        coinId: coinId, 
        currentWallet: this.selectedWallet, 
        mosaicAmount: mosaic.amount,
        totalBalance: totalBalance
      }, {
        enableBackdropDismiss: false,
        showBackdrop: true
      });
      modal.present();
  })
  }

  // public getFormat(mosaic) {
	// 	console.log("LOG: HomePage -> publicgetFormat -> mosaic", mosaic);
  //   return `1.${mosaic.properties.divisibility}-${mosaic.properties.divisibility}`
  // }

  public getPriceInUSD(amount, marketPrice) {
    let result = amount * marketPrice;
    this.totalWalletBalance += result

    return result;
  }

  /** Transaction list methods */
  trackByHash(index) {
    return index;
  }

  gotoTransactionDetail(tx) {
    let page = "TransactionDetailPage";
    this.showModal(page, tx);
  }

  showReceiveModal() {
    let page = "ReceivePage";

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
        await this.computeTotalWalletBalance(this.wallets);
        await this.getMosaicBalance(this.selectedWallet);
        await this.getTransactions(this.selectedWallet);
        refresher.complete();
      } catch (error) {
        this.isLoading = false;
        refresher.complete();
      }
    }, 2000);
  }

   getBalanceOfSelectedWallet() {
    if(this.selectedWallet) {
      return (  this.wallets.filter(wallet => wallet.name == this.selectedWallet.name)[0].total);
    }
  }
}

