import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { App } from '../../../providers/app/app';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  App = App;

  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder
  ) {
    this.init();
  }

  init() {
    this.formGroup = this.formBuilder.group({
      user: ['', [ Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  gotoHome() {
    this.navCtrl.setRoot(
      'TabsPage',
      {},
      {
        animate: true,
        direction: 'forward'
      }
    );
  }

  onSubmit(form) {
    console.log(form);
    this.gotoHome();
  }
}
