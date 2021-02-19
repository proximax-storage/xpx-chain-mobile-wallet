import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { App } from '../../../../providers/app/app';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { AlertProvider } from '../../../../providers/alert/alert';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { TranslateService } from '@ngx-translate/core';
import { SharedService, ConfigurationForm } from '../../../../providers/shared-service/shared-service';
import { CustomSimpleWallet } from '../../../../providers/wallet/simple-wallet';

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
  selectedWallet: CustomSimpleWallet;

  PASSWORD: string;

  walletColor: string = "wallet-1";
  walletName: string = "MyWallet";
  walletAddress: string = "TDDG3UDZBGZUIOCDCOPT45NB7C7VJMPMMNWVO4MH";
  walletTotal: number = 0;
  previousWalletName: any;
  nameMin: boolean;
  nameMax: boolean;
  configurationForm: ConfigurationForm = {};
  amountXpx: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private walletProvider: WalletProvider,
    private alertProvider: AlertProvider,
    private utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    private haptic: HapticProvider,
    private translateService: TranslateService,
    private sharedService: SharedService,
  ) {
    this.configurationForm = this.sharedService.configurationForm;
    this.init();
  }

  changeWalletColor(color) {
    this.walletColor = color;
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  goBack() {
    return this.navCtrl.setRoot(
      'TabsPage',
      {},
      {
        animate: true,
      }
    );
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletUpdatePage');
  }

  init() {
    this.selectedWallet = this.navParams.get('wallet');
    this.walletColor = this.selectedWallet.walletColor;
    this.walletName = this.selectedWallet['account'].name;
    this.previousWalletName = this.selectedWallet['account'].name;
    this.walletAddress = this.selectedWallet['account'].address.address
    this.walletTotal = this.navParams.get('totalBalance');
    this.amountXpx = this.navParams.get('amountXpx');

    console.log('this.navParams', this.navParams);
    

    this.formGroup = this.formBuilder.group({
      name: [this.walletName, [
        Validators.required,
        Validators.minLength(this.configurationForm.nameWallet.minLength),
        Validators.maxLength(this.configurationForm.nameWallet.maxLength)
      ]]
    });
  }

  minName() {
    let name = this.formGroup.controls.name.value;
    if (name.length < this.configurationForm.nameWallet.minLength) {
      this.nameMin = true;
    } else if (name.length > this.configurationForm.nameWallet.maxLength) {
      this.nameMax = true;
    } else {
      this.nameMin = false
      this.nameMax = false;
    }
  }

  onSubmit(form) {
    this.walletProvider.checkIfWalletNameExists(form.name, this.walletAddress).then(isExist => {

      console.log('exit', isExist);
      
      if (isExist) {
        this.alertProvider.showMessage(this.translateService.instant("WALLETS.EDIT.WALLET.EXIST"));
      } else {
        this.walletProvider.updateWalletName(this.selectedWallet['account'], form.name, this.walletColor).then(_ => {
          this.haptic.notification({ type: 'success' });
          this.goBack();
        });
      }
    });
  }

  updateName() {
    let name = this.formGroup.value.name
    if (name) {
      this.walletName = name;
    } else {
      this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    }
  }
}
