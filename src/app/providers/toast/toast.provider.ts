import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastProvider {
  toast = null;

  constructor(public toastCtrl: ToastController) {}

   async showToast (message: string) {
 
    const toast = await this.toastCtrl.create({
        message: message,
        duration: 3000,
        showCloseButton: false,
        position: 'bottom',
        closeButtonText: 'Ok'
      });
      toast.present();
    }
}
