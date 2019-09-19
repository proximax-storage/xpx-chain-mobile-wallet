import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HapticProvider } from '../haptic/haptic';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export enum WalletCreationType {
  NEW = 0,
  IMPORT = 1
}

@Injectable()
export class AlertProvider {

  constructor(
    private alertCtrl: AlertController, 
    private translateService: TranslateService, 
    private haptic: HapticProvider
    ) {
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

  showAddWalletPrompt(): Promise<any> {

    let option: string;

    return new Promise((resolve, reject ) => {
      this.haptic.selection();

    let alert = this.alertCtrl.create();
    const alertTitle = this.translateService.instant("WALLETS.CREATE");
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
          option = "create";
        } else if (data === WalletCreationType.IMPORT.toString()) {
          option = "import";
          
        }
        resolve(option)
      }
    });

    alert.present();
    })


  }


}
