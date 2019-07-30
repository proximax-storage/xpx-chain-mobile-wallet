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
  formGroup: FormGroup;
  passwordType: string = "password";
  passwordIcon: string = "ios-eye-outline";

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
    this.init();
    this.passwordType = "password";
    this.passwordIcon = "ios-eye-outline";

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.passDisabled = true;
    
  }

  init() {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.formGroup.valueChanges.subscribe(form => {
      console.log('values', form)
      if(this.formGroup.controls.password.value === '' && this.formGroup.controls.confirmPassword.value !== ''){
        this.passDisabled = true; 
        this.formGroup.patchValue({
          confirmPassword: ''
        })
      } else {
        this.passDisabled = false;
      }
    });
  }

  validate(){
    this.checkPasswords(this.formGroup.controls.confirmPassword.value) 
  }
  
    checkPasswords(value) {
      let pass = this.formGroup.controls.password.value;
      let confirmPass = value;

    return pass === confirmPass
      ? null
      : this.formGroup.setErrors([{ passwordMismatch: true }]);
  }

  onSubmit(form) {
    if(this.formGroup.status == "VALID") {
      if(form.password === form.confirmPassword) {
        this.authProvider
          .register(form.email, form.password)
          .then(status => {
						console.log("LOG: RegisterPage -> onSubmit -> status", status);
            if(status === "duplicate") {
              this.alertProvider.showMessage("Account already exist. Please try again.");
              this.haptic.notification({ type: 'error' });
            } else {
              this.haptic.notification({ type: 'success' });
              this.navCtrl.setRoot(
                'TabsPage',
                {},
                {
                  animate: true,
                  direction: 'forward'
                }
              );
              return this.utils.showModal('VerificationCodePage', { status: 'setup', destination: 'TabsPage' });
            }
          })
          .then(_ => {
            this.authProvider.setSelectedAccount(form.email, form.password);
          })
      } else {
        alert("Please make sure you confirm your password.");
      }
    }
   
  }

  showHidePassword(e: Event){
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
