import { Injectable } from '@angular/core';
import { ToastController, Toast } from 'ionic-angular';

/*
  Generated class for the ToastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToastProvider {
  toast: Toast = null;

  constructor(public toastCtrl: ToastController) {
    console.log('Hello ToastProvider Provider');
  }

  show(
    message: string,
    duration: number,
    showCloseButton: boolean = false,
    closeButtonText: string = 'Close'
  ) {
    const DURATION = duration * 1000;

    if (this.toast) {
      this.toast.dismiss().then(_ => {
        this.toast = null;

        this.showToast(message, DURATION, showCloseButton, closeButtonText);
      });
    }

    this.showToast(message, DURATION, showCloseButton, closeButtonText);
  }

  private showToast(message: string, duration: number, showCloseButton: boolean, closeButtonText: string) {
    if (!this.toast) {
      this.toast = this.toastCtrl.create({
        cssClass: 'toast-small',
        message: message,
        duration: duration,
        showCloseButton: showCloseButton,
        position: 'bottom',
        closeButtonText: showCloseButton ? closeButtonText : 'Ok'
      });

      this.toast.onDidDismiss(_ => this.toast = null);

      this.toast.present();
    }
  }
}
