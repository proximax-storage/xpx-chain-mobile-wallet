import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Haptic, AlertController } from 'ionic-angular';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastProvider } from '../../../../providers/toast/toast';
import { AlertProvider } from '../../../../providers/alert/alert';


/**
 * Generated class for the WalletBackupQrcodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet-backup-qrcode',
  templateUrl: 'wallet-backup-qrcode.html',
})
export class WalletBackupQrcodePage {

  privateKey: string;
  QRData: string;
  walletName: string;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private haptic: HapticProvider,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private alertCtrl: AlertController,
    private alertProvider: AlertProvider
    ) {
      console.log("SIRIUS CHAIN WALLET: WalletBackupQrcodePage -> this.navParams.data", this.navParams.data)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletBackupQrcodePage');

    let alertCtrl = this.alertCtrl.create();
      alertCtrl.setTitle('Export wallet');
      alertCtrl.setSubTitle('');

      alertCtrl.addInput({
        type: 'password',
        label: 'Password',
        min: '6',
        placeholder: 'Enter your password'
      });

      alertCtrl.addButton('Cancel');

      alertCtrl.addButton({
        text: 'OK',
        handler: data => {
          if (data) {
            console.log(data);
            const password = data[0];
            this.privateKey = this.navParams.get("privateKey");
            this.walletName = this.navParams.get("walletName");
            this.QRData = JSON.stringify({walletName: this.walletName, password: password, privateKey: this.privateKey}); 
      
            try {
              try {
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
  }

  dismiss() {
     this.viewCtrl.dismiss(); 
  }

  copy() {
    this.clipboard.copy(this.privateKey).then(_ => {
      this.haptic.notification({ type: 'success' });
      this.toastProvider.show('Copied private key successfully', 3, true);
      this.dismiss();
    });
  }


  goHome() {
    this.navCtrl.setRoot(
      'TabsPage',
      {
        animate: true
      }
    );
  }

}
