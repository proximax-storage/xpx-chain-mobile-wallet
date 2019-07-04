import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  Platform,
  AlertController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { SimpleWallet } from 'nem-library';

import { App } from '../../../../providers/app/app';
import { WalletProvider } from './../../../../providers/wallet/wallet';

import sortBy from 'lodash/sortBy';
import { AuthProvider } from '../../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';

/**
 * Generated class for the WalletListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export enum WalletCreationType {
  NEW = 0,
  IMPORT = 1
}

@IonicPage()
@Component({
  selector: 'page-wallet-list',
  templateUrl: 'wallet-list.html'
})
export class WalletListPage {
  App = App;

  wallets: SimpleWallet[];
  selectedWallet: SimpleWallet;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public authProvider: AuthProvider,
    public walletProvider: WalletProvider,
    public storage: Storage,
    public utils: UtilitiesProvider,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletListPage');
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack();

    this.walletProvider.getWallets().then(value => {
      this.wallets = sortBy(value, 'name');

      this.walletProvider.getSelectedWallet().then(selectedWallet => {
        this.selectedWallet = selectedWallet ? selectedWallet : this.wallets[0];
      }).catch(err => {
        this.selectedWallet = (!this.selectedWallet && this.wallets) ? this.wallets[0] : null;
      });
    });
  }

  logout() {
    this.authProvider.logout().then(_ => {
      this.navCtrl.setRoot('WelcomePage', {}, {
        animate: true,
        direction: 'backward'
      });
    });
  }

  trackByName(wallet) {
    return wallet.name;
  }

  onWalletSelect(wallet) {
    this.selectedWallet = wallet;

    this.walletProvider.setSelectedWallet(this.selectedWallet).then(() => {
      setTimeout(() => {
        this.navCtrl.setRoot(
          'TabsPage',
          {},
          { animate: true, direction: 'forward' }
        );
      }, 100);
    });
  }

  onWalletPress(wallet) {
    this.selectedWallet = wallet;

    const actionSheet = this.actionSheetCtrl.create({
      title: `Modify ${wallet.name}`,
      cssClass: 'wallet-on-press',
      buttons: [
        {
          text: 'Change name',
          icon: this.platform.is('ios') ? null : 'create',
          handler: () => {
            this.navCtrl.push('WalletUpdatePage', { wallet: wallet });
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: this.platform.is('ios') ? null : 'trash',
          handler: () => {
            this.navCtrl.push('WalletDeletePage', { wallet: wallet });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: this.platform.is('ios') ? null : 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showAddWalletPrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Add wallet');
    alert.setSubTitle('Select wallet type below');

    alert.addInput({
      type: 'radio',
      label: 'New wallet',
      value: WalletCreationType.NEW.toString(),
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Import wallet',
      value: WalletCreationType.IMPORT.toString(),
      checked: false
    });

    alert.addButton('Cancel');

    alert.addButton({
      text: 'Proceed',
      handler: data => {
        if (data === WalletCreationType.NEW.toString()) {
          this.navCtrl.push('WalletAddPage');
        } else if (data === WalletCreationType.IMPORT.toString()) {
          this.navCtrl.push('WalletImportOptionPage');
        }
      }
    });

    alert.present();
  }

}
