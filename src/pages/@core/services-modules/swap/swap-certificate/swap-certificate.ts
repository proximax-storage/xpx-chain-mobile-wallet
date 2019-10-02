import { File } from '@ionic-native/file';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, AlertController } from 'ionic-angular';
import { ToastProvider } from '../../../../../providers/toast/toast';
import { Clipboard } from '@ionic-native/clipboard';
import { Screenshot } from '@ionic-native/screenshot';
import { Address } from 'tsjs-xpx-chain-sdk';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Diagnostic } from '@ionic-native/diagnostic';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
// import * as qrcode from 'qrcode-generator';
// import { Address } from 'tsjs-xpx-chain-sdk';

/**
 * Generated class for the SwapCertificatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-swap-certificate',
  templateUrl: 'swap-certificate.html',
})
export class SwapCertificatePage {
  publicKey: any;
  transactionHash: any;
  address: any;
  timestamp: Date;
  screenshotDone: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private alertCtrl: AlertController,
    private screenshot: Screenshot,
    private photoLibrary: PhotoLibrary,
    private base64ToGallery: Base64ToGallery,
    private file:File,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private transfer: FileTransfer
    ) {

    const params = this.navParams.data;
    console.log("TCL: SwapCertificatePage -> this.navParams.data", JSON.stringify(this.navParams.data, null, 4))
    console.log('params this.params', JSON.stringify(params, null, 4));
    this.publicKey = params.publicKey.payload;
    this.transactionHash = params.transactionHash.data;
    let address = Address.createFromRawAddress(params.address.address);
    this.address = address.pretty();
    this.timestamp = new Date(params.timestamp);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwapCertificatePage');
  }

  qrCreate() {
    let qr = qrcode(10, 'H')
    let url = `http://bob.nem.ninja:8765/#/search/${this.transactionHash}`;
    qr.addData(url);
    qr.make()
    // console.log('urlurlurl', url)
    return qr.createDataURL()
  }

  copy(val, string) {
    this.clipboard.copy(val).then(_ => {
      this.toastProvider.show(`Your ${string} has been successfully copied to the clipboard`, 3, true);
    });
  }

  save() {
    this.screenshot.save('jpg', 80, `${this.address}.jpg`).then(base64Data=> {
    console.log("TCL: SwapCertificatePage -> save -> base64Data filepath", base64Data.filepath)
      // console.log("Screenshot saved.", JSON.stringify(base64Data,null, 3));
      // this.downloadImage('MyScreenshot', 'jpeg', base64Data.URI);
    }, ()=> {
      console.log("There's an error saving the screenshot.");
    });
    // this.screenshot.URI(80).then(base64Data=> {
    //   console.log('Image Uri ', JSON.stringify(base64Data,null, 3));

      // this.photoLibrary.saveImage(base64Data.URI, 'Screenshots').then(res=>{
      //   console.log(JSON.stringify(res, null, 4));
      // });

      // this.base64ToGallery.base64ToGallery(base64Data.URI, { prefix: '_img', mediaScanner:true }).then(
      //   res => console.log('Saved image to gallery ', JSON.stringify(res,null, 3)),
      //   err => console.log('Error saving image to gallery ', err)
      // );

      // remove photo Library
      // remove base64
      
      // this.downloadImage('MyScreenshot', 'jpeg', base64Data.URI);

    // })
  }

  downloadImage(fileName, ext, base64) {
    
    let storageDirectory: string = "";
    //Select Storage Location
    if (this.platform.is('ios')) {
        storageDirectory = this.file.documentsDirectory + 'ProximaX/';
    }
    else if (this.platform.is('android')) {
        storageDirectory = this.file.externalDataDirectory + 'ProximaX/';
    }
    else {
        return false;
    }
    //Request Access
    if (this.platform.is("android")) {
        this.diagnostic.requestRuntimePermission('READ_EXTERNAL_STORAGE').then(() => {
            console.log("Success");
        })
    }
    //Download Image
    var uri = encodeURI(base64);
    const file = `${fileName}.${ext}`;
    var fileURL = storageDirectory + "Image.jpg".replace(/ /g, '%20');
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(uri, fileURL).then((success) => {
        console.log("TCL: downloadImage -> success", success)
        // base64 = 'data:' + "image/jpeg" + ';base64,' + base64;
        const alertSuccess = this.alertCtrl.create({
            title: `Download Succeeded!`,
            subTitle: `Image was successfully downloaded`,
            buttons: ['Ok']
        });
        alertSuccess.present();
    }, error => {
        const alertFailure = this.alertCtrl.create({
            title: `Download Failed!`,
            subTitle: `Image was not successfully downloaded. Error code: ${error.code}`,
            buttons: ['Ok']
        });
        alertFailure.present();
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
