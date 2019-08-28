import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../providers/utilities/utilities';

/**
 * Generated class for the AccountDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetailsPage {
  formGroup: FormGroup;
  editMode:boolean=false;
  oldUsername:string = "jonpecson";
  oldPassword:string = "password";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController
  ) {
    this.init();
  }

  switchToEditMode() {
    this.editMode = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  init() {
    this.formGroup = this.formBuilder.group({
      newUsername: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }


  onSubmit(form) {
    // this.authProvider
    //   .register(form.email, form.password)
    //   .then(_ => {
    //     // this.utils.showModal('VerificationCodePage', { status: 'confirm', destination: 'TabsPage' });
    //   })
    //   .then(_ => {
    //     this.authProvider.setSelectedAccount(form.email, form.password);
    //   });

      this.authProvider.edit(this.oldUsername, form.newUsername, form.newPassword).then(_=>{
        this.dismiss()
      })

      .then(_ => {
        this.authProvider.setSelectedAccount(form.email, form.password);
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
