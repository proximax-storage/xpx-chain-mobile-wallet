import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { AlertProvider } from '../../../../providers/alert/alert';
import { AuthProvider } from '../../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';

/**
 * Generated class for the PrivateKeyPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-private-key-password',
  templateUrl: 'private-key-password.html'
})
export class PrivateKeyPasswordPage {
  formGroup: FormGroup;

  credentials: { password: string; privateKey: string };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authProvider: AuthProvider,
    public alertProvider: AlertProvider,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController
  ) {
    this.init();
  }

  init() {
    // Initialize private data
    this.authProvider.getPassword().then(password => {
      this.credentials = {
        password: password,
        privateKey: ''
      };
    })

    // Initialize form
    this.formGroup = this.formBuilder.group({
      password: ['', [Validators.required]]
    });
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack(this.navCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivateKeyPasswordPage');
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
    if (form.password === this.credentials.password) {
      let page = "PrivateKeyPage";
      const modal = this.modalCtrl.create(page, {password: form.password}, {
        enableBackdropDismiss: false,
        showBackdrop: true
      });
      modal.present();
    } else {
      this.alertProvider.showMessage('Incorrect password. Please try again.');
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
