import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastProvider } from '../../../providers/toast/toast';
import { HapticProvider } from '../../../providers/haptic/haptic';
import { WalletProvider } from '../../../providers/wallet/wallet';
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
  address: string;
  smallScreen: boolean = false;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing,
    private toastProvider: ToastProvider,
    private haptic: HapticProvider,
    private platform: Platform,
    private walletProvider: WalletProvider
  ) {
    const wallet = this.navParams.data;
    console.log('account', wallet);
    
    
    this.address = this.walletProvider.selectesAccount.account.address.address;
    // this.address = (account as Account).address.plain()

    this.platform.ready().then((readySource) => {
      if (this.platform.width() <= 330) {
        // 330px portrait
        this.smallScreen = true;
      } else {
        this.smallScreen = false;
      }
    });
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
