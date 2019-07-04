import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { App } from '../../../../providers/app/app';

/**
 * Generated class for the ComingSoonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coming-soon',
  templateUrl: 'coming-soon.html',
})
export class ComingSoonPage {
  App = App;

  constructor(public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComingSoonPage');
  }

}
