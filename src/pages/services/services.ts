import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { AlertProvider } from '../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ProximaxProvider } from '../../providers/proximax/proximax';
import { WalletProvider } from '../../providers/wallet/wallet';

/**
 * Generated class for the ServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {
  account: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utils: UtilitiesProvider,
    private modalCtrl: ModalController,
    private alertProvider: AlertProvider,
    private translateService: TranslateService,
    private barcodeScanner: BarcodeScanner,
    private proximaxProvider: ProximaxProvider,
    private walletProvider: WalletProvider, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }

  showComingSoon() {
    this.utils.showInsetModal("ComingSoonPage", {}, "small");
  }

  showModal(page) {
    this.utils.showInsetModal(page, {}, "small");
  }

  goto(page) {
    const modal = this.modalCtrl.create(page, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  async getCurrentAccount() {
    this.account = await this.walletProvider.getAccountSelected();
  }


  gotoGift(page, data) {
    const modal = this.modalCtrl.create(page, data, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }



  async scanGiftCards(value) {

    await this.getCurrentAccount();
    if (this.account != null) {

      // FUNCION SCAN QUE CAPTURA LOS VALORES DEL QR Y LOS DESERIALIZA

      // this.barcodeScanner
      //   .scan()
      //   .then(barcodeData => {
      //     const dataFormat = this.proximaxProvider.unSerialize(barcodeData)
      //     // console.log('dataFormat', dataFormat);

      //     if (dataFormat && dataFormat[0].mosaicGift && dataFormat[0].pkGift) {
      //       this.gotoGift('GiftCardsPage', dataFormat)
      //     } else {
      //       this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.TRANSFER.ERROR"));
      //     }
      //   }).catch(err => {
      //     if (err.toString().indexOf(
      //       this.translateService.instant("WALLETS.SEND.ERROR.CAMERA1")) >= 0) {
      //       let message = this.translateService.instant("WALLETS.SEND.ERROR.CAMERA2");
      //       this.alertProvider.showMessage(message);
      //     }
      //   });


      // DATA DE PRUEBA BINARIO CERIALIZADO DE LA GIFT CARD

      // no transferable
      const dataHex = '0000000000000001942110B5FF15C06141A14322E7A3054D5B1227215B7836224F106471C1AAF2ED4FF17E357254D451306769667420706172612063616D62696F'

      // transferable
      // const dataHex = '0000000000000001942110B5FF15C06141A14322E7A3054D5B1227215B7836224F106471C1AAF2ED4FF17E357254D451316769667420706172612063616D62696F'

      if (value === true) {
        const dataFormat = this.proximaxProvider.unSerialize(dataHex)
        if (dataFormat && dataFormat[0].mosaicGift && dataFormat[0].pkGift) {
          this.gotoGift('GiftCardsPage', dataFormat)
        } else {
          this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.TRANSFER.ERROR"));
        }
      }


    } else {
      this.alertProvider.showMessage(this.translateService.instant("APP.POPUP.NO.ACCOUNTS"))
    }
  }
}
