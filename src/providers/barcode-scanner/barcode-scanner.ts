import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
  BarcodeScanResult
} from '@ionic-native/barcode-scanner';

/*
  Generated class for the BarcodeScannerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BarcodeScannerProvider {
  private barcodeScannerOptions: BarcodeScannerOptions;

  constructor(
    private platform: Platform,
    private storage: Storage,
    private barcodeScanner: BarcodeScanner,
  ) {
    this.barcodeScannerOptions = {
      prompt: '',
      resultDisplayDuration: 0
    };
  }

  /**
   * Gets the data returned from QR scan unless if it is cancelled.
   * @param page Redirect to this page when QR scan is cancelled.
   * @param prompt Message when the QR scanner is showm.
   */
  getData(page: string, prompt: string = ''): Promise<any> {
    this.barcodeScannerOptions.prompt = prompt;
    return this.storage
      .set('isAppPaused', true)
      .then(_ => {
        return this.barcodeScanner.scan(this.barcodeScannerOptions);
      })
      .then((result: BarcodeScanResult) => {
        if (this.platform.is('android') && result.cancelled) {return {}};

        return JSON.parse(result.text);
      })
  }
}
