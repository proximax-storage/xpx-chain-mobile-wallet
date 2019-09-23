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
import { Password } from 'tsjs-xpx-chain-sdk';
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

  catapultWallet: any;
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
      this.catapultWallet = this.walletProvider.createAccountFromPrivateKey({ walletName: form.name, password: this.PASSWORD, privateKey: form.privateKey });

      this.nemWallet = this.nem.createPrivateKeyWallet(form.name, this.PASSWORD, form.privateKey);

      this.walletProvider.checkIfWalletNameExists(this.catapultWallet.name, this.catapultWallet.address.plain()).then(value => {
        if (value) {
          this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.NAME_EXISTS"));
        } else {

          this.walletProvider
        .storeWallet(this.catapultWallet, this.walletColor)
        .then(_ => {
          return this.walletProvider.setSelectedWallet(this.catapultWallet);
        }).then(_ => {
          // this.goHome();
          this.gotoBackup(this.catapultWallet);
        });

          this.nem.getOwnedMosaics(this.nemWallet.address)
            .subscribe(mosacis => {
              console.log('mosacis', mosacis)
              for (let index = 0; index < mosacis.length; index++) {
                const element = mosacis[index];

                if (element.assetId.name === 'xpx' && element.assetId.namespaceId === 'prx') {
                  console.log('elemento de mosaico', element)
                  console.log('wallet nis1 ', this.nemWallet)
                  this.walletProvider
                    .storeWalletNis1(this.catapultWallet, this.nemWallet, this.walletColor)
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
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.PRIVATE_KEY_INVALID"));
    }
  }


  showSwap() {
    let alert = this.alertCtrl.create({
      title: this.translateService.instant("WALLETS.IMPORT.SWAP_TITLE"),
      message: this.translateService.instant("WALLETS.IMPORT.SWAP_MESSAGE"),
      buttons: [
        {
          text: this.translateService.instant("WALLETS.BUTTON.CANCEL"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translateService.instant("WALLETS.BUTTON.CONTINUE"),
          handler: () => {
            this.showWalletInfoPage(this.nemWallet, this.catapultWallet)
          }
        }
      ]
    });
    alert.present();
  }

  showWalletInfoPage(wallet: SimpleWallet, walletC) {
    const page = "WalletInfoPage"
    this.showModal(page, {
      wallet: wallet,
      walletC: walletC
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
      console.info('Barcode data', JSON.stringify(barcodeData, null, 4));
      let password: string;


      let alertCtrl = this.alertCtrl.create();
      alertCtrl.setTitle('Import wallet');
      alertCtrl.setSubTitle('');

      alertCtrl.addInput({
        type: 'password',
        label: 'Password',
        min: '6',
        placeholder: 'Enter your account\'s password'
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
                const payload = JSON.parse(barcodeData.text);
                console.log("TCL: scan -> payload", payload)
                let walletName:string = payload.walletName;
                let walletPassword: string = payload.password;
                let privateKey:string = payload.privateKey;

                // verify previous wallet password vs. entered password
                if(password === walletPassword) {
                  const account = this.proximaxProvider.createFromPrivateKey(walletName, this.PASSWORD, privateKey);
                  console.log("TCL: scan -> account", account)
                  this.formGroup.patchValue({ name: walletName })
                  this.formGroup.patchValue({ privateKey: account.privateKey })
                } else {
                  this.alertProvider.showMessage("Invalid password. Please try again.");
                }                
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


