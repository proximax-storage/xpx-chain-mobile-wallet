import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Address } from 'nem-library';

import { App } from '../../../../providers/app/app';
import { ContactsProvider } from '../../../../providers/contacts/contacts';
import { NemProvider } from '../../../../providers/nem/nem';
import { AlertProvider } from '../../../../providers/alert/alert';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';

/**
 * Generated class for the ContactAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-add',
  templateUrl: 'contact-add.html'
})
export class ContactAddPage {
  App = App;

  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public nemProvider: NemProvider,
    public alertProvider: AlertProvider,
    public contactsProvider: ContactsProvider,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController
  ) {
    this.init();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactAddPage');
  }

  init() {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.minLength(3), Validators.required]],
      address: ['', [Validators.minLength(40), Validators.required]],
      telegram: ['']
    });

    if (this.navParams.data) {
      console.log(this.navParams.get('data'));
      this.formGroup.setValue(this.navParams.get('data'));
    }
  }

  gotoHome() {
    this.navCtrl.pop();
  }

  onSubmit(form) {
    const CONTACT_ADDRESS = new Address(this.formGroup.get('address').value);
    const DATA = form;
    if (!this.nemProvider.isValidAddress(CONTACT_ADDRESS)) {
      this.alertProvider.showMessage(
        'Sorry, it looks like this NEM address does not belong to this network. Please try again.'
      );
    } else {
      DATA.address = CONTACT_ADDRESS.plain();
      this.contactsProvider.push(DATA).then(_ => {
        this.gotoHome();
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
