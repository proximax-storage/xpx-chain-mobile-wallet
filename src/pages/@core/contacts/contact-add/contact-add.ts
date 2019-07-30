import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Address } from 'tsjs-xpx-chain-sdk';
import { AlertProvider } from '../../../../providers/alert/alert';
import { App } from '../../../../providers/app/app';
import { ContactsProvider } from '../../../../providers/contacts/contacts';
// import { NemProvider } from '../../../../providers/nem/nem';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';

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
  alfaNumberPattern = '^[a-zA-Z0-9\-\]+$';
  userTelegram = '^[a-zA-Z0-9@]+$';
  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    // public nemProvider: NemProvider,
    public alertProvider: AlertProvider,
    public contactsProvider: ContactsProvider,
    private viewCtrl: ViewController,
    private proximaxProvider: ProximaxProvider
  ) {
    this.init();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactAddPage');
  }

  init() {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.minLength(3), Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      address: ['', [Validators.minLength(40), Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      telegram: ['', [Validators.pattern(this.alfaNumberPattern)]]
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
    const CONTACT_ADDRESS = this.formGroup.get('address').value.toUpperCase().replace('-', '');
   
    const DATA = form;
    if (!this.proximaxProvider.isValidAddress(CONTACT_ADDRESS)) {
      this.alertProvider.showMessage(
        'Sorry, it looks like this NEM address does not belong to this network. Please try again.'
      );
    } else {
      DATA.address = CONTACT_ADDRESS;
      this.contactsProvider.push(DATA).then(_ => {
        this.gotoHome();
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
