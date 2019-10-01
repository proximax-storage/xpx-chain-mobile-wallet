import { SimpleWallet } from 'nem-library';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, AlertController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';
import { NemProvider } from '../../../../../providers/nem/nem';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { AuthProvider } from '../../../../../providers/auth/auth';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ImportWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-import-wallet',
  templateUrl: 'import-wallet.html',
})
export class ImportWalletPage {

  App = App;
  formGroup: FormGroup;

  PASSWORD: string;

  walletColor: string = "wallet-1";
  walletName: string = "Primary";

  tablet: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private alertProvider: AlertProvider,
    private nem: NemProvider,
    private walletProvider: WalletProvider,
    private authProvider: AuthProvider,
    private utils: UtilitiesProvider,
    private storage: Storage,
    private translateService: TranslateService,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private barcodeScanner:BarcodeScanner
  ) {
    console.log('LOG: ImportWalletPage -> init -> this.navParams.data', this.navParams.data.data);

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
    console.log('ionViewDidLoad ImportWalletPage');
    this.storage.set('isQrActive', true);
  }

  ionViewDidLeave() {
    this.storage.set('isQrActive', false);
  }

  init() {
    if (window.screen.width >= 768) { // 768px portrait
      this.tablet = true;
    }
    
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.minLength(3), Validators.required]],
      privateKey: ['', [Validators.minLength(3), Validators.required]]
    });

    if (this.navParams.data.data) {
      this.formGroup.setValue(this.navParams.data.data);
    }

    this.authProvider.getPassword().then(password => {
      this.PASSWORD = password;
    });
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
        min:'6',
        placeholder: 'Enter your password'
      });

      alertCtrl.addButton('Cancel');
  
      alertCtrl.addButton({
        text: 'Verify',
        handler: data => {
          if(data) {
            console.log(data);
            password = data[0];
            try {
              try {
                let privKey = this.nem.decryptPrivateKeyViaQrCode(password, payload);
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
      const nemWallet = this.nem.createPrivateKeyWallet(form.name, this.PASSWORD, form.privateKey);
      
      this.walletProvider.checkIfWalletNameExists(catapultWallet.name, catapultWallet.address.plain()).then(value => {
        if (value) {
          this.alertProvider.showMessage(this.translateService.instant("WALLETS.IMPORT.NAME_EXISTS"));
        } else {

          this.walletProvider
          .storeWallet(catapultWallet, this.walletColor)
          .then(_ => {
            return this.walletProvider.setSelectedWallet(catapultWallet);
          });
  
        
        this.nem.getOwnedMosaics(nemWallet.address)
        .subscribe(mosacis => {
          for (let index = 0; index < mosacis.length; index++) {
            const element = mosacis[index];
  
            if (element.assetId.name === 'xpx') {
              this.walletProvider
                .storeWalletNis1(catapultWallet, nemWallet, this.walletColor)
                .then(_ => {
                this.showWalletInfoPage(nemWallet, catapultWallet);
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

  showWalletInfoPage(wallet: SimpleWallet, walletC: any) {
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

  updateName() {
    let name = this.formGroup.value.name
    if (name) {
      this.walletName = name;
    } else {
      this.walletName = `<${this.translateService.instant("WALLETS.COMMON.LABEL.WALLET_NAME")}>`;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

