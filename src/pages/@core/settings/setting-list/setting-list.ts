import { AuthProvider } from './../../../../providers/auth/auth';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform } from "ionic-angular";
import { SimpleWallet, AccountInfoWithMetaData } from "nem-library";
import { UtilitiesProvider } from "../../../../providers/utilities/utilities";
import { AppVersion } from '@ionic-native/app-version';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { AlertProvider } from '../../../../providers/alert/alert';


/**
 * Generated class for the SettingListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-setting-list",
  templateUrl: "setting-list.html"
})
export class SettingListPage {
  currentWallet: SimpleWallet;
  accountInfo: AccountInfoWithMetaData;
  version: string = '0.1.0';
  buildNumber: any = '10';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private utils: UtilitiesProvider,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private authProvider: AuthProvider,
    private haptic: HapticProvider,
    private appVersion: AppVersion,
    private platform: Platform,
    private alertProvider: AlertProvider,
    private storage: Storage,
    private translateService: TranslateService
  ) {
    if (this.platform.is('cordova')) {
      this.appVersion.getVersionNumber().then(version => {
        this.version = version || '0.1.0';
      }).then(_ => {
        this.appVersion.getVersionCode().then(build => {
          this.buildNumber = build || '0';
        })
      })
    }
  }

  /**
   *
   *
   * @memberof SettingListPage
   */
  logOut() {
    this.authProvider.logout();
    this.haptic.selection();
    this.utils.setHardwareBackToPage("LoginPage");
    this.utils.setHardwareBack();
    this.utils.setRoot('LoginPage');
  }


  /**
   *
   *
   * @memberof SettingListPage
   */
  showLanguage() {
    this.storage.get("lang").then(lang => {
      this.storage.set("isQrActive", true);
      this.utils.showInsetModal('LanguagePage', {
        selectedLanguage: lang
      }).subscribe(lang => {
        if (lang) {
          console.log('Selected language', lang);
          const alertTitle = this.translateService.instant("SETTINGS.LANGUAGE.SWITCH", { 'lang': lang.name });
          this.alertProvider.showMessage(alertTitle)
          this.storage.set("lang", lang.value).then(_ => {
            setTimeout(() => {
              window.location.reload();
            }, 400)
          })
        }
      });
    })
  }

  // ------------------------------------------------------------

  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingListPage");
  }

  goto(page) {
    this.navCtrl.push(page);
  }

  gotoAccountDetails() {
    let page = 'AccountDetailsPage';
    const modal = this.modalCtrl.create(page, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  resetPIN() {
    // Reset pin first.
    this.showModal('VerificationCodePage', { status: 'setup', destination: 'TabsPage' });
  }

  showResetPINPrompt() {
    const continueButton = this.translateService.instant("WALLETS.BUTTON.CONTINUE");
    const cancelButton = this.translateService.instant("WALLETS.BUTTON.CANCEL");
    const resetPINTitle = this.translateService.instant("SETTINGS.RESET_PIN");
    const resetPINSubtitle = this.translateService.instant("SETTINGS.RESET_PIN.SUBTITLE");
    let alert = this.alertCtrl.create();
    alert.setTitle(resetPINTitle);
    alert.setSubTitle(resetPINSubtitle);
    alert.addButton(cancelButton);
    alert.addButton({
      text: continueButton,
      handler: data => {
        this.resetPIN();
      }
    });

    alert.present();
  }

  gotoGuide() {
    this.navCtrl.push('OnboardingPage', { preview: true });
  }


  gotoMultisignInfoPage() {
    this.showComingSoon();
    // this.navCtrl.push('MultisignAccountInfoPage'); // Todo : Implement gotoMultisignInfoPage
  }

  showComingSoon() {
    this.utils.showInsetModal("ComingSoonPage", {}, "small");
  }

  // backupWallet() {
  //   this.navCtrl.push('WalletBackupPage', this.currentWallet);
  // }

  showNodeList() {
    this.showModal("NodeListPage", {});
  }

  showReleaseNotes() {
    this.showModal("WhatsNewPage", {});
  }

  

  showModal(page, params) {
    const modal = this.modalCtrl.create(page, params, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }


}
