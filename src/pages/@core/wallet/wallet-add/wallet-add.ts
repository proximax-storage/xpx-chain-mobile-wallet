import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { App } from '../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { SharedService, ConfigurationForm } from '../../../../providers/shared-service/shared-service';
import { AlertProvider } from '../../../../providers/alert/alert';
import { AuthProvider } from '../../../../providers/auth/auth';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { Password } from 'tsjs-xpx-chain-sdk';

/**
 * Generated class for the WalletAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-add',
  templateUrl: 'wallet-add.html'
})
export class WalletAddPage {
  App = App;
  formGroup: FormGroup;
  PASSWORD: string;

  walletColor: string = "wallet-4";
  walletName: string = "Primary";

  tablet: boolean = false;
  configurationForm: ConfigurationForm = {};
  catapultWallet: any;
  passwordType: string = "password";
  passwordIcon: string = "ios-eye-outline";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private utils: UtilitiesProvider,
    private translateService: TranslateService,
    private sharedService: SharedService,
    private alertProvider: AlertProvider,
    private authProvider: AuthProvider,
    private walletProvider: WalletProvider,
  ) {

    this.configurationForm = this.sharedService.configurationForm;
    this.walletColor = "wallet-1";
    this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    this.init();
  }

  changeWalletColor(color) {
    this.walletColor = color;
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);

    // Hide Tabs
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        // tabs[ key ].style.transform = 'translateY(56px)';
        tabs[key].style.display = 'none';
      });
    } // end if
  }

  ionViewDidLeave() {
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.display = 'flex';
      });
    } // end if
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad WalletAddPage');
  }

  init() {

    if (window.screen.width >= 768) { // 768px portrait
      this.tablet = true;
    }

    this.formGroup = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(this.configurationForm.nameWallet.minLength),
          Validators.maxLength(this.configurationForm.nameWallet.maxLength)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(this.configurationForm.passwordWallet.minLength),
          Validators.minLength(this.configurationForm.passwordWallet.minLength)
        ]
      ]
    });

    // this.authProvider.getPassword().then(password => {
    //   this.PASSWORD = password;
    // });
  }

  goToBackup(wallet) {
    return this.navCtrl.push('WalletBackupPage', wallet);
  }

  goHome() {
    this.navCtrl.setRoot(
      'TabsPage',
      {
        animate: true
      }
    );
  }

  async onSubmit(form: { name: any; password: any;}) {
    try {
      const decrypted = await this.authProvider.decryptAccountUser(form.password);
      if (decrypted) {
        this.alertProvider.showMessage('decrip');
        this.catapultWallet = this.walletProvider.createSimpleWallet(form.name, form.password);
        this.walletProvider.checkIfWalletNameExists(this.catapultWallet.name, this.catapultWallet.address.plain()).then(async value => {
          if (value) {
            this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.NAME_EXISTS"));
          } else {
            this.walletProvider.storeWalletCatapult(this.catapultWallet, null, this.walletColor, new Password(form.password)).then(_ => {
              this.goToBackup(this.catapultWallet);
            });
          }
        })
      } else {
        this.alertProvider.showMessage(this.translateService.instant("APP.INVALID.PASSWORD"));
      }
    } catch (error) {
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.PRIVATE_KEY_INVALID"));
    }
  }

    /**
   *
   *
   * @param {Event} e
   * @memberof WalletAddPrivateKeyPage
   */
  showHidePassword(e: Event) {
    e.preventDefault();
    this.passwordType = this.passwordType === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
  }

  
  updateName() {
    let name = this.formGroup.value.name
    // console.log("LOG: WalletAddPage -> updateName -> name", name);
    if (name) {
      this.walletName = name;
    } else {
      this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    }
  }
}
