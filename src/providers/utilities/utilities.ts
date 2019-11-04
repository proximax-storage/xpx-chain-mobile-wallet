import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { ModalController, Platform, ViewController, NavController, App, Events } from 'ionic-angular';
import { App as AppProvider } from './../app/app';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastProvider } from '../toast/toast';
import { DefaultMosaic } from '../../models/default-mosaic';

/*
  Generated class for the UtilitiesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilitiesProvider {
  AppProvider = AppProvider;

  constructor(
    private app: App,
    private modalCtrl: ModalController,
    private platform: Platform,
    private storage: Storage,
    private events: Events,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
  ) {
    console.log('Hello UtilitiesProvider Provider');
  }

  setTabIndex(index) {
    return this.platform.registerBackButtonAction(() => {
      this.events.publish('tab:back', index);
    }, 0);
  }

  setHardwareBack(nav?: NavController) {
    return this.platform.registerBackButtonAction(() => {
      if (nav) nav.pop();
    }, 0);
  }

  disableHardwareBack() {
      this.platform.registerBackButtonAction((event)=>{
          console.log('Prevent Back Button Page Change');
      }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
  }   

  setHardwareBackToPage(page: string) {
    return this.platform.registerBackButtonAction(() => {
      this.setRoot(page);
    }, 0);
  }

  setHardwareBackModal(viewCtrl: ViewController) {
    return this.platform.registerBackButtonAction(() => {
      viewCtrl.dismiss();
    }, 0);
  }

  setRoot(page: string, data = {}) {
    console.log(this.app.getActiveNavs());
    this.app.getRootNavs()[0].setRoot(page, data, {
      animate: true,
      // direction: 'backward'
    }).then(() =>{
      this.app.navPop();
      //....
  });;
  }

  copy(text: string, type: string) {
    let message: string = '';

    if (type === 'sender') {
      message = 'Sender\'s address copied successfully';
    } else if (type === 'receiver') {
      message = 'Receiver\'s address copied successfully';
    } else if (type === 'hash') {
      message = 'Hash copied successfully';
    } else if (type === 'message') {
      message = 'Message copied successfully';
    } else if (type === 'cosigner') {
      message = 'Cosigner\'s address copied successfully';
    }

    this.clipboard.copy(text).then(_ => {
      this.toastProvider.show(message, 3, true);
    });
  }

  /**
   * Get the logo of the mosaics
   * @param mosaic The mosaic object for querying the logo
   */
  getLogo(mosaic: DefaultMosaic) {
    if(!mosaic) {
      return AppProvider.LOGO.DEFAULT;
    } else if (
      mosaic.namespaceId.toLowerCase() === 'prx' &&
      mosaic.mosaicId.toLowerCase() === 'xpx' || mosaic.hex.toLowerCase() ===  AppConfig.xpxHexId
    ) {
      return AppProvider.LOGO.XPX;
    } else if (
      mosaic.namespaceId.toLowerCase() === 'pundix' &&
      mosaic.mosaicId.toLowerCase() === 'npxs' || mosaic.hex.toLowerCase() === '1e29b3356f3e24e5'
    ) {
      return AppProvider.LOGO.NPXS;
    } else if (
      mosaic.namespaceId.toLowerCase() === 'sportsfix' &&
      mosaic.mosaicId.toLowerCase() === 'sft' || mosaic.hex.toLowerCase() === '33b0efbf4a600cc9'
    ) {
      return AppProvider.LOGO.SFT;
    } else if (
      mosaic.namespaceId.toLowerCase() === 'xarcade' &&
      mosaic.mosaicId.toLowerCase() === 'xar' || mosaic.hex.toLowerCase() === '59096674da68a7e5'
    ) {
      return AppProvider.LOGO.XAR;
    } else {
      return AppProvider.LOGO.DEFAULT;
    }
  }

    /**
   * Get the logo of the specified language
   * @param lange The language object for getting the logo
   */
  getFlag(lang) {
    if (lang.value == "cn") {
      return AppProvider.FLAGS.CN;
    } else if (lang.value == "en") {
      return AppProvider.FLAGS.EN;
    }  else if (lang.value == "es") {
      return AppProvider.FLAGS.ES;
    } else if (lang.value == "fr") {
      return AppProvider.FLAGS.FR;
    } else if (lang.value == "jp") {
      return AppProvider.FLAGS.JP;
    } else if (lang.value == "kr") {
      return AppProvider.FLAGS.KR;
    }
     else if (lang.value == "nl") {
      return AppProvider.FLAGS.NL;
    } else if (lang.value == "ru") {
      return AppProvider.FLAGS.RU;
    } else if (lang.value == "vt") {
      return AppProvider.FLAGS.VT;
    } 
  }

  /**
   * Show inset modal
   * @param page { Component || string } The page to set as modal.
   * @param data { Object } Any data to pass when modal is shown
   */
  showModal(page, data = {}): Observable<any> {
    const modal = this.modalCtrl.create(page, data, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });

    this.storage.set('isModalShown', true).then(() => {
      modal.present();
    });

    return new Observable(observer => {
      modal.onDidDismiss(data => {
        observer.next(data);
      });
    });
  }

  /**
   * Show inset modal
   * @param page { Component || string } The page to set as modal.
   * @param data { Object } Any data to pass when modal is shown
   */
  showInsetModal(page, data = {}, size = ''): Observable<any> {
    const modal = this.modalCtrl.create(page, data, {
      cssClass: `inset-modal ${size}`,
      enableBackdropDismiss: true,
      showBackdrop: true
    });
    modal.present();

    return new Observable(observer => {
      modal.onDidDismiss(data => {
        observer.next(data);
      });
    });
  }
}
