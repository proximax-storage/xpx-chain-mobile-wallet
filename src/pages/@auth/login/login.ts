import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform, Keyboard } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { AlertProvider } from '../../../providers/alert/alert';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { HapticProvider } from '../../../providers/haptic/haptic';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  formGroup: FormGroup;
  passwordType: string = "password";
  passwordIcon: string = "ios-eye-outline";


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public storage: Storage,
    public alertProvider: AlertProvider,
    public authProvider: AuthProvider,
    public utils: UtilitiesProvider,
    private haptic: HapticProvider,
    private platform: Platform,
    private statusBar: StatusBar,
    private keyboard: Keyboard,
    private translateService: TranslateService
  ) {
    this.createForm();
    this.passwordType = "password";
    this.passwordIcon = "ios-eye-outline";

  }

  async auth(form: { user: string; password: string; }) {
    if (this.formGroup.valid) {
      const decrypted = await this.authProvider.decryptAccountUser(form.password, form.user);
      if (decrypted) {
        this.haptic.notification({ type: 'success' });
        this.authProvider.setSelectedAccount(form.user, form.password);
        this.gotoHome();
      } else {
        this.utils.showInsetModal('TryAgainPage', {}, 'small');
        this.haptic.notification({ type: 'error' });
      }
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  gotoHome() {
    const confirmPinTitle = this.translateService.instant("APP.PIN.CONFIRM.TITLE");
    const confirmPinSubtitle = this.translateService.instant("APP.PIN.CONFIRM")
    this.storage.get('currentPin').then(pin => {
      this.utils.showModal('VerificationCodePage', {
        status: 'confirm',
        title: confirmPinTitle,
        subtitle: confirmPinSubtitle,
        invalidPinMessage: 'Incorrect pin. Please try again',
        pin: pin,
        destination: 'TabsPage'
      });
    });
  }

  // --------------------------------------------------------------------------



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  gotoForgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }





  showHidePassword(e: Event) {
    e.preventDefault();
    this.passwordType = this.passwordType === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.keyboard.hideFormAccessoryBar(false);
    });
  }
}
