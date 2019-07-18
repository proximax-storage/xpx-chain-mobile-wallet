import { ViewController } from 'ionic-angular';
import { SimpleWallet } from 'tsjs-xpx-chain-sdk';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, Haptic } from 'ionic-angular';

import { App } from '../../../../providers/app/app';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { HapticProvider } from '../../../../providers/haptic/haptic';

/**
 * Generated class for the WalletDeletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-delete',
  templateUrl: 'wallet-delete.html'
})
export class WalletDeletePage {
  App = App;
  formGroup: FormGroup;

  PASSWORD: string;

  selectedWallet: SimpleWallet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private walletProvider: WalletProvider,
    private authProvider: AuthProvider,
    private utils: UtilitiesProvider,
    private haptic: HapticProvider,
    private viewCtrl: ViewController
  ) {
    this.selectedWallet = this.navParams.get('wallet');
    this.init();
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletDeletePage');
  }

  init() {
    this.formGroup = this.formBuilder.group({});

    this.authProvider.getPassword().then(password => {
      this.PASSWORD = password;
    });
  }

  goBack() {
    return this.navCtrl.setRoot(
      'TabsPage',
      {},
      {
        animate: true,
        // direction: 'forward'
      }
    );
  }

  async onSubmit() {
      this.haptic.notification({ type:'success'});
    await this.walletProvider
      .deleteWallet(this.selectedWallet)
    await this.walletProvider.unsetSelectedWallet();
    return this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss().then(_=> {
      this.goBack();
    })
  }
}
