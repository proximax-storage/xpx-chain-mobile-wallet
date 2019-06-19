import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AlertProvider {
    delete = false;
    deleteSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.delete);
    delete$: Observable<boolean> = this.deleteSubject.asObservable();

  constructor(private alertCtrl: AlertController) {
    console.log('Hello AlertProvider Provider');
  }

  /**
   * Shows an alert.
   * @param title Any title to an alert.
   * @param message Any text to show.
   */

  async show(title: string, message: string) {
    const alert = await this.alertCtrl.create({
        header: title,
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
            }
          }, {
            text: 'Confirm',
            handler: () => {
                this.setDelete(true);
            }
          }
        ]
      });
      await alert.present();
  }

  /**
   * Shows an alert.
   * @param message Any text to show.
   */
  async showMessage(message: string) {
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: [ 'Ok' ]
    })
    await alert.present();
  }

  setDelete(params: any) {
    this.delete = params;
    this.deleteSubject.next(this.delete);
  }

  getDelete() {
    return this.delete$;
  }

}
