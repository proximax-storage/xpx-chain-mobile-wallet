import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { App } from '../../../../providers/app/app';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../providers/auth/auth';
import { AlertProvider } from '../../../../providers/alert/alert';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { TranslateService } from '@ngx-translate/core';
import { SimpleWallet } from 'tsjs-xpx-chain-sdk';

/**
 * Generated class for the WalletUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-update',
  templateUrl: 'wallet-update.html'
})
export class WalletUpdatePage {
  App = App;
  formGroup: FormGroup;
  selectedWallet: SimpleWallet;

  PASSWORD: string;

  walletColor: string = "wallet-1";
  walletName: string = "MyWallet";
  walletAddress: string = "TDDG3UDZBGZUIOCDCOPT45NB7C7VJMPMMNWVO4MH";
  walletTotal: number = 0;
  previousWalletName: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private walletProvider: WalletProvider,
    private authProvider: AuthProvider,
    private alertProvider: AlertProvider,
    private utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    private haptic: HapticProvider,
    private translateService: TranslateService
  ) {
    // this.walletColor = "wallet-1"; // to be change with current wallet color
    this.init();
  }

  changeWalletColor(color) {
    this.walletColor = color;
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletUpdatePage');
  }

  init() {
    console.log(this.navParams.get('wallet'));
    this.selectedWallet = this.navParams.get('wallet');
    this.walletColor = this.selectedWallet.walletColor;
    this.walletName = this.selectedWallet['account'].name;
    this.previousWalletName = this.selectedWallet['account'].name;
    this.walletAddress = this.selectedWallet['account'].address.address
    this.walletTotal = this.navParams.get('totalBalance');

    console.log("Total", this.navParams.get('totalBalance'));

    this.formGroup = this.formBuilder.group({
      name: [
        this.selectedWallet.name || '',
        [Validators.minLength(3), Validators.required]
      ]
    });

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

  onSubmit(form) {
    if (this.previousWalletName == form.name) {
      this.walletProvider
        .updateWalletName(this.selectedWallet, form.name, this.walletColor)
        .then(selectedWallet => {
          console.log(selectedWallet);
          return this.walletProvider.setSelectedWallet(selectedWallet.wallet);
        })
        .then(selectedWallet => {
          this.haptic.notification({ type: 'success' });
          this.goBack();
        });
    } else {
      this.walletProvider.checkIfWalletNameExists(form.name, '').then(isExist => {
				console.log("LOG: WalletUpdatePage -> onSubmit -> isExist", isExist);
        if (isExist) {
        this.alertProvider.showMessage('Wallet name already exist. Please choose a new one.');
        } else {
          this.walletProvider
            .updateWalletName(this.selectedWallet, form.name, this.walletColor)
            .then(selectedWallet => {
              console.log(selectedWallet);
              return this.walletProvider.setSelectedWallet(selectedWallet.wallet);
            })
            .then(selectedWallet => {
              this.haptic.notification({ type: 'success' });
              this.goBack();
            });
        }
      });
    }
  }

  updateName() {
		let name = this.formGroup.value.name
		console.log("LOG: WalletAddPage -> updateName -> name", name);
    if(name) {
      this.walletName = name;
    } else {
      this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }
}
