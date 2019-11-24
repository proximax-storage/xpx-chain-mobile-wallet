import { Component, ViewChild } from '@angular/core';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Clipboard } from '@ionic-native/clipboard';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import {
  ActionSheetController,
  Content,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  ViewController,
} from 'ionic-angular';
import {
  Transaction,
  TransactionType,
  MultisigAccountInfo,
} from 'tsjs-xpx-chain-sdk';

import { GetMarketPricePipe } from '../../../pipes/get-market-price/get-market-price';
import { App } from '../../../providers/app/app';
import { CoinPriceChartProvider } from '../../../providers/coin-price-chart/coin-price-chart';
import { CoingeckoProvider } from '../../../providers/coingecko/coingecko';
import { HapticProvider } from '../../../providers/haptic/haptic';
import { ToastProvider } from '../../../providers/toast/toast';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { DefaultMosaic } from '../../../models/default-mosaic';
import { ProximaxProvider } from '../../../providers/proximax/proximax';
import { CatapultsAccountsInterface } from '../../../providers/wallet/wallet';

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
  showEmptyMosaic: boolean;
  confirmed: any;
  mosaicHex: any;
  /** Mosaic details member variables */
  durations: Array<{ label: string; value: number }>;
  selectedDuration: { label: string; value: number };
  selectedCoin: any;
  descriptionLength: number = 600;


  /** Transaction list member variables */
  App = App;
  TransactionType = TransactionType;

  selectedAccount: CatapultsAccountsInterface;
  fakeList: Array<any>;
  confirmedTransactions: Transaction[] = [];
  showEmptyMessage: boolean;
  isLoading: boolean;

  isLoadingInfinite: boolean = false;

  pageable: Transaction[];

  coinId: string;
  mosaicId: string;
  namespaceId: string;
  mosaicAmount: number;

  @ViewChild(Content) content: Content;

  selectedSegment: string = "transactions";

  totalBalance: number;

  accountInfo: MultisigAccountInfo;
  isMultisig: boolean;
  public mosaics: DefaultMosaic[] = [];
  array: any[] = [];
  account: any;
  divisibility: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public coingeckoProvider: CoingeckoProvider,
    public coinPriceChartProvider: CoinPriceChartProvider,
    public utils: UtilitiesProvider,
    private modalCtrl: ModalController,
    private proximaxProvider: ProximaxProvider,
    private viewCtrl: ViewController,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private actionSheetCtrl: ActionSheetController,
    private haptic: HapticProvider,
    private browserTab: BrowserTab,
    private safariViewController: SafariViewController,
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

    const payload = this.navParams.data;
    console.log("TCL: CoinPriceChartPage -> payload", payload)

    this.mosaicHex = payload.mosaicHex;
    
    this.mosaicId = payload.mosaicId;
    this.namespaceId = payload.namespaceId;
    console.log(this.mosaicId);
    console.log(this.mosaicHex);
    // will be used to filter transactions
    this.coinId = payload.coinId;
    this.selectedAccount = payload.selectedAccount;
    console.log('selectedAccount', this.selectedAccount);
    this.confirmed = payload.transactions;
    this.mosaics = payload.mosaics;
    this.account = payload.selectedAccount;
    this.confirmed.forEach((confirmed: Transaction) => {
      console.log('confirmed', confirmed);
      if (confirmed.type === TransactionType.TRANSFER) {
        confirmed['mosaics'].forEach(async _mosaic => {
          if (_mosaic.id.toHex().toLowerCase() == this.mosaicHex) {
            this.confirmedTransactions.push(confirmed);
            this.showEmptyMessage = false;
          }
        });
      } else if(this.mosaicId === 'xpx') {
        this.confirmedTransactions.push(confirmed);
      }
    });

    if (this.confirmedTransactions.length < 1) {
      this.showEmptyMessage = true;
    }

    this.navParams.data.mosaics.forEach(element => {
      if (element.hex === this.navParams.data.mosaicHex) {
        this.mosaicAmount = element.amountCompact;
        this.divisibility = element.divisibility;
      }
    });
    this.totalBalance = this.navParams.data['totalBalance'];

    if (this.mosaicId == 'xar') {
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
      this.showEmptyMosaic = true;
    } else if (this.mosaicId !== 'xpx' && this.mosaicId !== 'npxs' && this.mosaicId !== 'sft' && this.mosaicId !== 'xar') {
      this.selectedCoin = {
        "name": this.mosaicId,
        "symbol": this.namespaceId,
        "links": {
          "homepage": [""],
          "announcement_url": [""],
          "blockchain_site": [""],
          "facebook_username": "",
          "twitter_screen_name": "",
          "telegram_channel_identifier": ""
        },
        "genesis_date": "2018-03-05",
        "description": {
          en: "Xarcade is a ProximaX-powered cost-effective video game distribution/exchange platform for both game developers and gamers to use. It is a game changer and is a cost-less direct alternative to other app stores in the market. Xarcade does not levy game developers anything for the sale of in-game credits, changing the paradigm, and passing these cost savings to gamers."
        }
      }
      this.showEmptyMosaic = true;
    } else {
      if (this.coinId !== "") {
        this.coingeckoProvider.getDetails(this.coinId).subscribe(coin => {
          this.selectedCoin = coin;
          if (coin.id === 'proximax') {
            this.selectedCoin.links.announcement_url = ["https://blog.proximax.com"]
            this.selectedCoin.links.blockchain_site = ["https://bctestnetexplorer.xpxsirius.io/#/"]
          }
          this.showEmptyMosaic = false;
        });
      } else {
        this.showEmptyMosaic = true;
      }

    }
  }


  ionViewWillEnter() {
  }

  getAbsoluteAmount(amount, divisibility) {
    return this.proximaxProvider.amountFormatter(amount, divisibility)
  }

  getAccountInfo() {
    // console.info("Getting account information.", this.selectedAccount.address)
    try {
      const address = this.proximaxProvider.createFromRawAddress(this.selectedAccount.account.address['address']);
      this.proximaxProvider.getMultisigAccountInfo(address).subscribe(accountInfo => {
        if (accountInfo) {
          this.accountInfo = accountInfo;
          console.log('this.accountInfo', this.accountInfo)
          // Check if account is a cosignatory of multisig account(s)
          if (this.accountInfo.cosignatories.length > 0) {
            // console.log("This is a multisig account");
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
    console.log(this.selectedAccount);
    const address = this.proximaxProvider.createFromRawAddress(this.selectedAccount.account.address['address']);
    this.clipboard.copy(address.plain()).then(_ => {
      this.toastProvider.show('Your address has been successfully copied to the clipboard.', 3, true);
    });
  }

  select(duration) {
    // console.log('duration',duration)
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
    const modal = this.modalCtrl.create(page, this.account, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
    // this.showModal(page, this.account, {
    // });
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

  goToTransactionDetail(tx) {
    const page = "TransactionDetailPage";
    const transactions = tx;
    const mosaics = this.mosaics;
    const payload = { transactions, mosaics };
    this.showModal(page, payload);
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
