import { Component, ViewChild } from '@angular/core';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Clipboard } from '@ionic-native/clipboard';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import {
  ActionSheetController,
  Content,
  InfiniteScroll,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import {
  AccountInfo,
  ModifyMultisigAccountTransaction,
  SimpleWallet,
  Transaction,
  TransactionType,
  TransferTransaction,
  AggregateTransaction,
  Address,
  MultisigAccountInfo,
} from 'tsjs-xpx-chain-sdk';

import { GetMarketPricePipe } from '../../../pipes/get-market-price/get-market-price';
import { App } from '../../../providers/app/app';
import { CoinPriceChartProvider } from '../../../providers/coin-price-chart/coin-price-chart';
import { CoingeckoProvider } from '../../../providers/coingecko/coingecko';
import { GetBalanceProvider } from '../../../providers/get-balance/get-balance';
import { HapticProvider } from '../../../providers/haptic/haptic';
import { NemProvider } from '../../../providers/nem/nem';
import { ToastProvider } from '../../../providers/toast/toast';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { WalletProvider } from '../../../providers/wallet/wallet';
import { flatMap, toArray } from 'rxjs/operators';

/**
 * Generated class for the CoinPriceChartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-coin-price-chart",
  templateUrl: "coin-price-chart.html",
  providers: [GetMarketPricePipe]
})
export class CoinPriceChartPage {
  /** Mosaic details member variables */
  durations: Array<{ label: string; value: number }>;
  selectedDuration: { label: string; value: number };
  selectedCoin: any;
  descriptionLength: number = 600;


  /** Transaction list member variables */
  App = App;
  TransactionType = TransactionType;

  selectedAccount: any;
  fakeList: Array<any>;

  unconfirmedTransactions: Array<any>;
  confirmedTransactions: Array<any>;
  showEmptyMessage: boolean;
  isLoading: boolean;

  isLoadingInfinite: boolean = false;

  pageable: Transaction[];

  coinId: string;
  mosaicId: string;
  mosaicAmount: number;

  @ViewChild(InfiniteScroll)
  private infiniteScroll: InfiniteScroll;

  @ViewChild(Content) content: Content;

  selectedSegment: string = "transactions";

  totalBalance: number;

  accountInfo: MultisigAccountInfo;
  isMultisig: boolean;


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
    private getBalanceProvider: GetBalanceProvider,
    private marketPrice: GetMarketPricePipe,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private actionSheetCtrl: ActionSheetController,
    private haptic: HapticProvider,
    private browserTab: BrowserTab,
    private safariViewController: SafariViewController
  ) {
    this.selectedSegment = 'transactions';
    this.durations = [
      { label: "24H", value: 1 },
      { label: "7D", value: 7 },
      { label: "14D", value: 14 },
      { label: "30D", value: 30 },
      { label: "6M", value: 182 }

    ];
    this.selectedDuration = this.durations[0];

    console.log("navParams.data", this.navParams.data);
    this.mosaicId = this.navParams.data['mosaicId']; // will be used to filter transactions
    console.log("TCL: CoinPriceChartPage -> this.mosaicId", this.mosaicId)
    this.coinId = this.navParams.data['coinId'];
    this.selectedAccount = this.navParams.data['selectedAccount'];
    this.confirmedTransactions = this.navParams.data['transactions'];
    this.mosaicAmount = this.navParams.data['mosaicAmount']; 
    this.totalBalance = this.navParams.data['totalBalance'];



    if (this.mosaicId == "sft") {
      this.selectedCoin = {
        "name": "SportsFix",
        "symbol": "SFT",
        "links": {
          "homepage": ["https://sportsfix.io/"],
          "announcement_url": ["https://medium.com/@sportsfix"],
          "blockchain_site": ["https://bitcointalk.org/index.php?topic=4380637.msg39045279#msg39045279"],
          "facebook_username": "sportsfix.io",
          "twitter_screen_name": "SportsFix_io",
          "telegram_channel_identifier": "SFICO"
        },
        "genesis_date": "2018-12-18",
        "description": {
          en: "SportsFix aims to transform the most powerful content in the world – SPORTS. SF presents a decentralized sports media ecosystem which aims to completely change the way fans connect and engage with sports content. In its current stage, SF is a rapidly growing over-the-top (OTT) business in Asia streaming local and international sports events to millions of fans every week and on track to become one of the most valuable video streaming platforms in the region. In our next phase, SF will be issuing SportsFix Tokens (SFT) which allows fans to participate and engage with their favourite leagues and clubs in a self-contained economy with all digital transactions employing smart contracts backed by blockchain technology."
        }
      }

    } else if (this.mosaicId == 'xar') {

      this.selectedCoin = {
        "name": "Xarcade",
        "symbol": "XAR",
        "links": {
          "homepage": ["https://xarcade.io/"],
          "announcement_url": ["https://medium.com/@xarcadeofficial"],
          "blockchain_site": ["https://bitcointalk.org/index.php?topic=2648389.0"],
          "facebook_username": "xarcadeofficial",
          "twitter_screen_name": "xarcadeofficial",
          "telegram_channel_identifier": "EZvkTkPk7msNRR3yQX0wWw"
        },
        "genesis_date": "2018-03-05",
        "description": {
          en: "Xarcade is a ProximaX-powered cost-effective video game distribution/exchange platform for both game developers and gamers to use. It is a game changer and is a cost-less direct alternative to other app stores in the market. Xarcade does not levy game developers anything for the sale of in-game credits, changing the paradigm, and passing these cost savings to gamers."
        }
      }

    } else {
      // console.info(this.mosaicId, this.coinId );
      if (this.coinId) {
        this.coingeckoProvider.getDetails(this.coinId).subscribe(coin => {
          this.selectedCoin = coin;
          console.log("TCL: CoinPriceChartPage -> this.selectedCoin", this.selectedCoin)
        });
      }

    }


  }
  ionViewWillEnter() {

    // /** Transaction list business logic */
    // this.unconfirmedTransactions = null;
    // this.confirmedTransactions = null;
    // this.showEmptyMessage = false;
    // this.isLoading = true;

    // if (this.selectedAccount) {
    //   this.getAccountInfo();
    //   this.fakeList = [{}, {}];

    //   this.pageable = this.nemProvider.getAllTransactionsPaginated(
    //     this.selectedAccount.address
    //   );



    //   this.nemProvider.getUnconfirmedTransactions(this.selectedAccount.address).pipe(
    //     flatMap(_ => _),
    //     toArray()
    //   ).subscribe(result => {
    //       this.unconfirmedTransactions = result;
    //     });

    //   // temp
    //   if (this.mosaicId != 'xem') {
    //     this.nemProvider.getMosaicTransactions(this.selectedAccount.address).subscribe(transactions => {

    //       const filteredTransactions = transactions.filter(tx => tx!._mosaics[0].mosaicId.name == this.mosaicId);

    //       let mosaicInfo = [
    //         { mosaicId: 'xpx', divisibility: 1e6 },
    //         { mosaicId: 'npxs', divisibility: 1e6 },
    //         { mosaicId: 'sft', divisibility: 1e6 },
    //         { mosaicId: 'xar', divisibility: 1e4 },
    //       ]

    //       let currentMosaic = mosaicInfo.find(mosaic => mosaic.mosaicId == this.mosaicId);
    //       console.log("LOG: CoinPriceChartPage -> ionViewWillEnter -> currentMosaic", currentMosaic);


    //       let total: number = 0;


    //       filteredTransactions.forEach(tx => {
    //         let amount = tx.mosaics().map(mosaic => mosaic.quantity)[0] / currentMosaic.divisibility;
    //         console.log("LOG: CoinPriceChartPage -> ionViewWillEnter -> amount", amount);
    //         if (tx.recipient.value === this.selectedAccount.address.plain()) {
    //           total += amount
    //         }
    //         else {
    //           total -= amount
    //         }
    //       })
        

    //       this.nemProvider.getXEMTransactions(this.selectedAccount.address).subscribe(transactions => {
    //         console.log("LOG: CoinPriceChartPage -> ionViewWillEnter -> this.confirmedTransactions", this.confirmedTransactions);
    //         transactions.forEach(tx => {
    //           if(tx.type == TransactionType.MODIFY_MULTISIG_ACCOUNT) {
    //             console.log("LOG: CoinPriceChartPage -> ionViewWillEnter -> tx", tx);

    //             let transaction: TransferTransaction = ((tx as AggregateTransaction).innerTransactions[0] as TransferTransaction)
    //             let currentMosaicTransaction = transaction.mosaics.find(mosaic => mosaic.id.toHex() == this.mosaicId);
								
    //             if(currentMosaicTransaction ) {
    //               console.log("LOG: CoinPriceChartPage -> ionViewWillEnter -> currentMosaicTransaction", currentMosaicTransaction);
    //               this.confirmedTransactions.push(tx);
    //               if ((transaction.recipient as Address).plain() === this.selectedAccount.address.plain()) {
    //               total += currentMosaicTransaction.amount.compact() / currentMosaic.divisibility;
    //             }
    //             else {
    //               total -= currentMosaicTransaction.amount.compact() / currentMosaic.divisibility;
    //             }
    //             }
    //           }
    //         })
  
    //       })

    //       this.isLoading = false;
    //       this.showEmptyMessage = false;
    //       this.confirmedTransactions = filteredTransactions;


    //       // Check transaction is empty
    //       if (this.confirmedTransactions.length == 0) this.showEmptyMessage = true;
    //     })
    //   } else {
    //     this.nemProvider.getXEMTransactions(this.selectedAccount.address).subscribe(transactions => {
    //       this.isLoading = false;
    //       this.showEmptyMessage = false;
    //       this.confirmedTransactions = transactions;
    //       console.log("LOG: CoinPriceChartPage -> ionViewWillEnter -> this.confirmedTransactions", this.confirmedTransactions);

    //       if (!this.confirmedTransactions) this.showEmptyMessage = true;
    //     })
    //   }
    // }
  }

  getAccountInfo() {
    console.info("Getting account information.", this.selectedAccount.address)
    try {
      this.nemProvider.getMultisigAccountInfo(this.selectedAccount.address).subscribe(accountInfo => {
          if (accountInfo) {
            this.accountInfo = accountInfo;
            console.log("accountInfo", this.accountInfo)
            // Check if account is a cosignatory of multisig account(s)
            if (this.accountInfo.cosignatories.length > 0) {
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

  copy() {
    this.clipboard.copy(this.selectedAccount.address.plain()).then(_ => {
      this.toastProvider.show('Your address has been successfully copied to the clipboard.', 3, true);
    });
  }

  select(duration) {
    this.selectedDuration = duration;
    this.coinPriceChartProvider.load(
      this.selectedCoin,
      this.selectedDuration.value,
      "usd"
    );
  }

  readMore(descriptionLength) {
    this.descriptionLength =
      descriptionLength === this.descriptionLength ? 600 : descriptionLength;
  }

  goto(page) {
    this.navCtrl.push(page);
  }

  showReceiveModal() {
    let page = "ReceivePage";
    this.showModal(page, {});
  }

  showSendModal() {
    console.log(this.accountInfo);

    if (this.isMultisig) {
      this.haptic.selection();
      let page = 'SendMultisigPage';

      const actionSheet = this.actionSheetCtrl.create({
        title: `Selecte transaction type`,
        cssClass: 'wallet-on-press',
        buttons: [
          {
            text: 'Normal Transaction',
            handler: () => {
              let page = 'SendPage';
              this.showModal(page, { mosaicSelectedName: this.mosaicId })
            }
          },
          {
            text: 'Multisig Transaction',
            handler: () => {
              this.showModal(page, { mosaicSelectedName: this.mosaicId })
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              // this.showModal(page,{ mosaicSelectedName: this.mosaicId})
            }
          }
        ]
      });
      actionSheet.present();
      // this.showModal(page,{ mosaicSelectedName: this.mosaicId})
    } else {
      let page = "SendPage";
      this.showModal(page, { mosaicSelectedName: this.mosaicId })
    }
  }

  showModal(page, params) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  gotoTransactionDetail(tx) {
    let page = "TransactionDetailPage";
    this.showModal(page, tx);
  }

  /** Transaction list methods */
  trackByHash(index) {
    return index;
  }

  openLink(link) {
    this.browserTab.isAvailable()
      .then(isAvailable => {
        if (isAvailable) {
          this.browserTab.openUrl(link);
        } else {
          // open URL with InAppBrowser instead or SafariViewController

          this.safariViewController.isAvailable()
            .then((available: boolean) => {
              if (available) {

                this.safariViewController.show({
                  url: link,
                  hidden: false,
                  animated: false,
                  transition: 'curl',
                  enterReaderModeIfAvailable: true,
                  tintColor: '#ff0000'
                })
                  .subscribe((result: any) => {
                    if (result.event === 'opened') console.log('Opened');
                    else if (result.event === 'loaded') console.log('Loaded');
                    else if (result.event === 'closed') console.log('Closed');
                  },
                    (error: any) => console.error(error)
                  );

              } else {
                // use fallback browser, example InAppBrowser
              }
            }
            );
        }
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


}
