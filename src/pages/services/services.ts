import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { AlertProvider } from '../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private utils: UtilitiesProvider, 
    private modalCtrl: ModalController,
    private alertProvider: AlertProvider,
    private translateService: TranslateService,) {
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

  scanGiftCards(value) {

    console.log(value);
    
    
    if( value === true){
      this.goto('GiftCardsPage')
    } else {
      this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.TRANSFER.ERROR"));
    }
  }

}
