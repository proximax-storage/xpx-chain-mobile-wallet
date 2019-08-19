import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { App } from '../../../../providers/app/app';
import { ContactsProvider } from '../../../../providers/contacts/contacts';

/**
 * Generated class for the ContactUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-update',
  templateUrl: 'contact-update.html'
})
export class ContactUpdatePage {
  App = App;

  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public contactsProvider: ContactsProvider,
    private viewCtrl: ViewController
  ) {
    this.init();
    console.log(this.navParams.data.data);
  }


  init() {
    this.formGroup = this.formBuilder.group({
      id: ['', [Validators.required]],
      name: [
        this.navParams.data.data.name,
        [Validators.minLength(3), Validators.required]
      ],
      address: [
        this.navParams.data.data.address,
        [Validators.minLength(40), Validators.required]
      ],
      telegram: [this.navParams.data.data!.telegram]
    });

    this.formGroup.setValue(this.navParams.data.data);
  }

  gotoHome() {
    this.contactsProvider
      .update(this.navParams.data.data.id, this.formGroup.value);
  }

  onSubmit() {
    this.gotoHome();
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
