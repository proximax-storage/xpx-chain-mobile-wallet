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

  async scanGiftCards() {
    await this.getCurrentAccount();
    if (this.account != null) {

    // //   // FUNCION SCAN QUE CAPTURA LOS VALORES DEL QR Y LOS DESERIALIZA
      this.barcodeScanner
        .scan()
        .then(barcodeData => {
          barcodeData.format = "QR_CODE";

          if (barcodeData.cancelled === true) {
            console.log('no tiene datos el scan');
          } else {
            // aqui va la validacion 
            const dataFormat = this.proximaxProvider.unSerialize(barcodeData.text)

            console.log( JSON.stringify(dataFormat));
            
            if (dataFormat && dataFormat[0].amountGift && dataFormat[0].pkGift) {
              this.gotoGift('GiftCardsPage', dataFormat)
            } else {
              this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.TRANSFER.ERROR"));
            }
          }

        })
        .catch(err => {
          if (err.toString().indexOf(
            this.translateService.instant("WALLETS.SEND.ERROR.CAMERA1")) >= 0) {
            let message = this.translateService.instant("WALLETS.SEND.ERROR.CAMERA2");
            this.alertProvider.showMessage(message);
          }
        });


      // DATA DE PRUEBA BINARIO CERIALIZADO DE LA GIFT CARD

      // misaics no transferable
      //  const dataHex = '00000000000000013035777FC55F5D6FD757C04F0CDB10D9A9766EC58264D19D316DF79EAB97D6C24FF17E357254D45130B200B8'
 
      // namespace no transferable
      //  const dataHex = '00000000000000019384F0FBC75F957BE0A8F3003FB9298779667ABCB31C9FBDE800A7F8AA7E3F75CF231D202AB020FA30B200B8'
// 
      //  misaics transferable
      //  const dataHex = '0000000001C9C380C7BDEC3A6B27A04417F0C7F2F5A9D0F69C4143DD6ACE6A9C1A9F08275130EA917465737420737364'
 
      //    const dataFormat = this.proximaxProvider.unSerialize(dataHex)
      //    console.log('dataFormat0, ',dataFormat);
         
      //    if (dataFormat && dataFormat[0].amountGift && dataFormat[0].pkGift) {
      //   //    console.log('dataFormat', dataFormat);
           
      //      this.gotoGift('GiftCardsPage', dataFormat)
      //    } else {
      //      this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.TRANSFER.ERROR"));
      //    } 
 
      // FIN DATA DE PRUEBA BINARIO CERIALIZADO DE LA GIFT CARD

    } else {
      this.alertProvider.showMessage(this.translateService.instant("APP.POPUP.NO.ACCOUNTS"))
    }
  }


}
