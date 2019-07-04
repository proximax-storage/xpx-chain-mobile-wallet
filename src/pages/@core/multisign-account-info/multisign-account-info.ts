import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';

/**
 * Generated class for the MultisignAccountInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-multisign-account-info',
  templateUrl: 'multisign-account-info.html',
})
export class MultisignAccountInfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public utils: UtilitiesProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MultisignAccountInfoPage');
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

}
