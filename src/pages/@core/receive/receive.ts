import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastProvider } from '../../../providers/toast/toast';
import { WalletProvider } from '../../../providers/wallet/wallet';
import { Account } from 'tsjs-xpx-chain-sdk';
import { HapticProvider } from '../../../providers/haptic/haptic';
 /*
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receive',
  templateUrl: 'receive.html'
})
export class ReceivePage {
  address:string;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastProvider: ToastProvider,
    private haptic: HapticProvider
  ) {
    const account = this.navParams.data;
    this.address = (account as Account).address.plain()
  }
  ionViewWillEnter() {
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  copy() {
    this.clipboard.copy(this.address).then(_ => {
      this.haptic.notification({ type: 'success' });
      this.toastProvider.show('Your address has been successfully copied to the clipboard.', 3, true);
    });
  }

  share() {
    this.haptic.notification({ type: 'success' });
    this.socialSharing
      .share(
        this.address,
        null,
        null,
        null
      )
      .then(_ => { });
  }
}
