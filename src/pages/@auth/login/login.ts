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
    this.init();
    this.passwordType = "password";
    this.passwordIcon = "ios-eye-outline";

  }

  init() {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  gotoForgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

  gotoHome() {

    const confirmPinTitle = this.translateService.instant("APP.PIN.CONFIRM.TITLE");
    const confirmPinSubtitle = this.translateService.instant("APP.PIN.CONFIRM")

    this.storage.get('currentPin').then(pin => {
      this.utils.showModal('VerificationCodePage', {
        status: 'confirm',
        title: confirmPinTitle,
        subtitle:
        confirmPinSubtitle,
        invalidPinMessage: 'Incorrect pin. Please try again',
        pin: pin,
        destination: 'TabsPage'
      });
    });
  }

  onSubmit(form) {
    if(this.formGroup.status == "VALID") {

      this.authProvider
      .login(form.email, form.password)
      .then(res => {
        if (res.status === 'success') {
          this.haptic.notification({ type: 'success' });
          this.authProvider
            .setSelectedAccount(form.email, form.password)
            .then(_ => {
              setTimeout(() => {
                this.gotoHome();
              }, 1000);
            });
        } else {
          // this.utils.showInsetModal('TryAgainPage', {}, 'small');
          // this.haptic.notification({ type: 'error' });
        }
      })
      .catch(err => {
        this.utils.showInsetModal('TryAgainPage', {}, 'small');
        this.haptic.notification({ type: 'error' });
      });

    }
    
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
