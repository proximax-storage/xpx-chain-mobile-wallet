import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { App } from '../../../../providers/app/app';

/**
 * Generated class for the GiftCardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gift-cards',
  templateUrl: 'gift-cards.html',
})
export class GiftCardsPage {

  block: boolean;
  App = App;
  hexadecimal: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private viewCtrl: ViewController,
    public utils: UtilitiesProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftCardsPage');
  }

  init() {
    this.hexadecimal = '13bfc545e40568d7'
  }

  onSubmit() {
    this.block = true;

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
