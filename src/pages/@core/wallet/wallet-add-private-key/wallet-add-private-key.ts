import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';

import { App } from '../../../../providers/app/app';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../providers/auth/auth';
import { AlertProvider } from '../../../../providers/alert/alert';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { scan } from 'rxjs/operators';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { NemProvider } from '../../../../providers/nem/nem';
import { SimpleWallet } from 'nem-library';
/**
 * Generated class for the WalletAddPrivateKeyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-add-private-key',
  templateUrl: 'wallet-add-private-key.html'
})
export class WalletAddPrivateKeyPage {

  nemWallet: SimpleWallet;
  App = App;
  formGroup: FormGroup;

  PASSWORD: string;

  walletColor: string = "wallet-1";
  walletName: string = "Primary";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertProvider: AlertProvider,
    private proximaxProvider: ProximaxProvider,
    private nem: NemProvider,
    private walletProvider: WalletProvider,
    private authProvider: AuthProvider,
    private utils: UtilitiesProvider,
    private barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController,
    private storage: Storage,
    private translateService: TranslateService,
    private modalCtrl: ModalController
  ) {
    this.walletColor = 'wallet-1';
    this.init();
    this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
  }

  changeWalletColor(color) {
    this.walletColor = color;
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletAddPage');
    this.storage.set('isQrActive', true);
  }

  ionViewDidLeave() {
    this.storage.set('isQrActive', false);
  }

  init() {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.minLength(3), Validators.required]],
      privateKey: ['', [Validators.minLength(3), Validators.required]]
    });

    console.log('LOG: WalletAddPrivateKeyPage -> init -> this.navParams.data', this.navParams.data);

    if (this.navParams.data) {
      this.formGroup.setValue(this.navParams.data);
    }

    this.authProvider.getPassword().then(password => {
      this.PASSWORD = password;
    });
  }

  gotoBackup(wallet) {
    return this.navCtrl.push('WalletBackupPage', wallet);
  }

  goHome() {
    this.navCtrl.setRoot(
      'TabsPage',
      {
        animate: true
      }
    );
  }

  onSubmit(form) {
    try {
      const catapultWallet = this.walletProvider.createAccountFromPrivateKey({ walletName: form.name, password: this.PASSWORD, privateKey: form.privateKey });

      this.walletProvider
        .storeWallet(catapultWallet, this.walletColor)
        .then(_ => {
          return this.walletProvider.setSelectedWallet(catapultWallet);
        }).then(_ => {
          this.goHome();
        });

      this.nemWallet = this.nem.createPrivateKeyWallet(form.name, this.PASSWORD, form.privateKey);

      this.walletProvider.checkIfWalletNameExists(catapultWallet.name).then(value => {
        if (value) {
          this.alertProvider.showMessage('This wallet name already exists. Please try again.');
        } else {

          this.nem.getOwnedMosaics(this.nemWallet.address)
            .subscribe(mosacis => {
              console.log('mosacis', mosacis)
              for (let index = 0; index < mosacis.length; index++) {
                const element = mosacis[index];

                if (element.assetId.name === 'xpx') {
                  console.log('elemento de mosaico', element)
                  console.log('wallet nis1 ', this.nemWallet)
                  this.walletProvider
                    .storeWalletNis1(catapultWallet, this.nemWallet, this.walletColor)
                    .then(_ => {
                      this.showSwap();
                      // console.log('ALERT PARA EL SWAP NIS 1');
                    });
                } else {

                }
              }
            });
        }
      });
    }
    catch (error) {
      this.alertProvider.showMessage("Invalid private key. Please try again.");
    }
  }


  showSwap() {
    let alert = this.alertCtrl.create({
      title: 'Swap NIS 1',
      message: 'Se ha detectado que la llave privada importada posee una cuenta en NIS 1 con saldo XPX, desea realizar el Swap a sirius wallet?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.showWalletInfoPage(this.nemWallet)
          }
        }
      ]
    });
    alert.present();
  }

  showWalletInfoPage(wallet: SimpleWallet) {
    const page = "WalletInfoPage"
    this.showModal(page, {
      wallet: wallet
    });
  }
  
  showModal(page, params) {
    const modal = this.modalCtrl.create(page, { data: params }, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }


  scan() {
    this.storage.set("isQrActive", true);
    this.barcodeScanner.scan().then(barcodeData => {
      console.info('Barcode data', barcodeData);
      let password: string;
      let payload = JSON.parse(barcodeData.text);


      let alertCtrl = this.alertCtrl.create();
      alertCtrl.setTitle('Import wallet');
      alertCtrl.setSubTitle('');

      alertCtrl.addInput({
        type: 'password',
        label: 'Password',
        min: '6',
        placeholder: 'Enter your password'
      });

      alertCtrl.addButton('Cancel');

      alertCtrl.addButton({
        text: 'Verify',
        handler: data => {
          if (data) {
            console.log(data);
            password = data[0];
            try {
              try {
                let privKey = this.proximaxProvider.decryptPrivateKey1(password, payload);
                this.formGroup.patchValue({ name: payload.data.name })
                this.formGroup.patchValue({ privateKey: privKey })
              } catch (error) {
                console.log('Error', error);

                if (error.toString().indexOf('Password must be at least 6 characters') >= 0) {
                  this.alertProvider.showMessage("Password must be at least 6 characters");
                } else {
                  this.alertProvider.showMessage("Invalid password. Please try again.");
                }
              }

            } catch (error) {
              console.log(error);
              this.alertProvider.showMessage("Invalid private key. Please try again.");
            }
          }
        }
      });

      alertCtrl.present();
    }).catch(err => {
      console.log('Error', err);
      if (err.toString().indexOf('Access to the camera has been prohibited; please enable it in the Settings app to continue.') >= 0) {
        let message = "Camera access is disabled. Please enable it in the Settings app."
        this.alertProvider.showMessage(message);
      }
    });
  }

  updateName() {
    let name = this.formGroup.value.name
    console.log("LOG: WalletAddPage -> updateName -> name", name);
    if (name) {
      this.walletName = name;
    } else {
      this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    }
  }

}


