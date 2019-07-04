import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(private alertCtrl: AlertController) {
    console.log('Hello AlertProvider Provider');
  }

  /**
   * Shows an alert.
   * @param title Any title to an alert.
   * @param message Any text to show.
   */
  show(title: string, message: string) {
    this.alertCtrl.create({
      subTitle: title,
      message: message,
      buttons: [ 'Ok' ]
    }).present();
  }

  /**
   * Shows an alert.
   * @param title Any title to an alert.
   * @param message Any text to show.
   */
  showMessage(message: string) {
    this.alertCtrl.create({
      message: message,
      buttons: [ 'Ok' ]
    }).present();
  }
}
