import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';

/**
 * Generated class for the WalletAddOptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export enum WalletAddOption {
  SIMPLE = 0,
  SHARED = 1
}

@IonicPage()
@Component({
  selector: 'page-wallet-add-option',
  templateUrl: 'wallet-add-option.html'
})
export class WalletAddOptionPage {
  options: Array<{
    name: string;
    value: number;
    icon: string;
    description: string;
  }>;
  selectedOption: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public utils: UtilitiesProvider
  ) {
    this.init();
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletAddOptionPage');
  }

  init() {
    this.options = [
      {
        name: 'Create simple wallet',
        value: WalletAddOption.SIMPLE,
        icon: 'ios-person-outline',
        description:
          'A simple wallet enables you to do a “single-signature transactions,” it requires only one signature of the owner before transaction is executed.'
      },
      // {
      //   name: 'Create multisig wallet',
      //   value: WalletAddOption.SHARED,
      //   icon: 'ios-people-outline',
      //   description:
      //     'A multisig wallet has an additional security measure for cryptocurrency transactions. Rather than a single wallet signature requirement for transactions, it requires the signature of multiple people before transaction is executed.'
      // }
    ];
  }

  onSelect(option) {
    this.selectedOption = option.value;

    this.onSubmit();
  }

  onSubmit() {
    if (this.selectedOption === WalletAddOption.SIMPLE) {
      this.navCtrl.push('WalletAddPage');
    } else if (this.selectedOption === WalletAddOption.SHARED) {
      this.utils.showInsetModal('ComingSoonPage', {}, 'small');
    }
  }
}
