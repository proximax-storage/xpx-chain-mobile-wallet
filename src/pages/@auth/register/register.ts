import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';
import { HapticProvider } from '../../../providers/haptic/haptic';
import { AlertProvider } from '../../../providers/alert/alert';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

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
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public utils: UtilitiesProvider,
    private haptic: HapticProvider,
    private alertProvider: AlertProvider,
    private platform: Platform,
    private statusBar: StatusBar,
    private keyboard: Keyboard
  ) {
    this.createForm();
    this.passwordType = "password";
    this.passwordIcon = "ios-eye-outline";

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
      const user = this.formRegisterUser.get("user").value;
      const password = this.formRegisterUser.get("password").value;
      this.authProvider.createUser(user, password).then(status => {
        console.log("LOG -->", status);
        if (status === "duplicate") {
          this.alertProvider.showMessage("Account already exist.");
          this.haptic.notification({ type: 'error' });
        } else {
          this.haptic.notification({ type: 'success' });
          this.navCtrl.setRoot('TabsPage', {}, {
            animate: true,
            direction: 'forward'
          });

          return this.utils.showModal('VerificationCodePage', { status: 'setup', destination: 'TabsPage' });
        }
      });
    }
  }





  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.passDisabled = true;
  }



  validate() {
    this.checkPasswords(this.formRegisterUser.controls.confirmPassword.value);
  }

  checkPasswords(value) {
    let pass = this.formRegisterUser.controls.password.value;
    let confirmPass = value;

    return pass === confirmPass
      ? null
      : this.formRegisterUser.setErrors([{ passwordMismatch: true }]);
  }

  minPasswords() {
    let pass = this.formRegisterUser.controls.password.value;
    return pass.length < this.passwordMin
      ? this.formRegisterUser.setErrors([{ passwordMin: true }])
      : null;
  }
  

  showHidePassword(e: Event) {
    e.preventDefault();
    this.passwordType = this.passwordType === "password" ? "text" : "password";
    this.passwordIcon = this.passwordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
  }

  showHideConfirmPassword(e: Event) {
    e.preventDefault();
    this.confirmPasswordType = this.confirmPasswordType === "password" ? "text" : "password";
    this.confirmPasswordIcon = this.confirmPasswordIcon === "ios-eye-outline" ? "ios-eye-off-outline" : "ios-eye-outline";
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
