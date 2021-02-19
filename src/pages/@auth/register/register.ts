import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { HapticProvider } from '../../../providers/haptic/haptic';
import { AlertProvider } from '../../../providers/alert/alert';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { WalletProvider } from '../../../providers/wallet/wallet';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
  passDisabled: boolean;
  formRegisterUser: FormGroup;
  passwordType: string = "password";
  passwordIcon: string = "ios-eye-outline";
  passwordMin = 8;
  confirmPasswordType: string = "password";
  confirmPasswordIcon: string = "ios-eye-outline";

  constructor(
    private walletProvider: WalletProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public utils: UtilitiesProvider,
    private haptic: HapticProvider,
    private alertProvider: AlertProvider,
    private platform: Platform,
    private statusBar: StatusBar,
    private keyboard: Keyboard,
    private translateService: TranslateService
  ) {
    this.createForm();
    this.passwordType = "password";
    this.passwordIcon = "ios-eye-outline";

  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.keyboard.hideFormAccessoryBar(false);
    });
  }

  /**
   *
   *
   * @memberof RegisterPage
   */
  createForm() {
    this.formRegisterUser = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(this.passwordMin)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(this.passwordMin)]],
    });

    this.formRegisterUser.valueChanges.subscribe(form => {
      if (this.formRegisterUser.controls.password.value === '' && this.formRegisterUser.controls.confirmPassword.value !== '') {
        this.passDisabled = true;
        this.formRegisterUser.patchValue({
          confirmPassword: ''
        })
      } else {
        this.passDisabled = false;
      }
    });
  }

  /**
   *
   *
   * @memberof RegisterPage
   */
  createUser() {
    if (this.formRegisterUser.valid) {
      const user = this.formRegisterUser.get('user').value;
      const password = this.formRegisterUser.get('password').value;
      this.walletProvider.createUser(user, password).then(status => {
        if (status === 'duplicate') {
          this.alertProvider.showMessage(this.translateService.instant('APP.SIGNUP.ERROR.ACCOUNT_EXIST'));
          this.haptic.notification({ type: 'error' });
        } else {
          this.haptic.notification({ type: 'success' });
          this.navCtrl.setRoot('TabsPage', {}, {
            animate: true,
            direction: 'forward'
          });

          return this.utils.showModal('VerificationCodePage', { status: 'setup', destination: 'TabsPage', reload: true });
        }
      });
    }
  }

  /**
   *
   *
   * @param {*} value
   * @returns
   * @memberof RegisterPage
   */
  checkPasswords(value: any) {
    let pass = this.formRegisterUser.controls.password.value;
    let confirmPass = value;
    return pass === confirmPass ? null : this.formRegisterUser.setErrors([{ passwordMismatch: true }]);
  }

  /**
   *
   *
   * @memberof RegisterPage
   */
  ionViewDidLoad() {
    this.passDisabled = true;
  }

  /**
   *
   *
   * @returns
   * @memberof RegisterPage
   */
  minPasswords() {
    let pass = this.formRegisterUser.controls.password.value;
    return pass.length < this.passwordMin ? this.formRegisterUser.setErrors([{ passwordMin: true }]) : null;
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof RegisterPage
   */
  showHidePassword(e: Event) {
    e.preventDefault();
    this.passwordType = this.passwordType === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
  }

  /**
   *
   *
   * @param {Event} e
   * @memberof RegisterPage
   */
  showHideConfirmPassword(e: Event) {
    e.preventDefault();
    this.confirmPasswordType = this.confirmPasswordType === "password" ? "text" : "password";
    this.confirmPasswordIcon = this.confirmPasswordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
  }

  /**
   *
   *
   * @memberof RegisterPage
   */
  validatePassword() {
    this.checkPasswords(this.formRegisterUser.controls.confirmPassword.value);
  }
}
