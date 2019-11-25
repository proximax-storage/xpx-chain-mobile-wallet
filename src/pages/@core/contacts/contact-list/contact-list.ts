import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ActionSheetController,
  Platform,
  ViewController,
  ModalController
} from 'ionic-angular';

import { ContactsProvider } from '../../../../providers/contacts/contacts';
import { App } from './../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { TranslateService } from '@ngx-translate/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Storage } from "@ionic/storage";
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { AlertProvider } from '../../../../providers/alert/alert';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';

/**
 * Generated class for the ContactListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export enum ContactCreationType {
  MANUAL = 0,
  QR_SCAN = 1
}

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html'
})
export class ContactListPage {
  App = App;

  selectedContact: any;
  contacts: Array<{
    id: number;
    name: string;
    address: string;
    telegram: string;
  }> = [];
  address: any;

  constructor(
    private alertProvider: AlertProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private contactsProvider: ContactsProvider,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private proximaxProvider: ProximaxProvider,
    private barcodeScanner: BarcodeScanner,
    private utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private translateService: TranslateService,
    private walletProvider: WalletProvider,

  ) {
    this.storage.set("isQrActive", true);
    this.address = this.walletProvider.selectesAccount.account.address.address;
  }

  ionViewWillEnter() {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
  }

  init() {
    this.utils.setTabIndex(0);

    this.contactsProvider.getAll().then(contacts => {
      this.contacts = contacts;
      this.selectedContact = this.contacts[0];
    });
  }

  onSelect(contact) {
    this.selectedContact = contact;
    let page = "ContactDetailPage"
    this.showModal(page, contact);
  }

  onPress(contact) {
    const editButton = this.translateService.instant("WALLETS.BUTTON.EDIT");
    const deleteButton = this.translateService.instant("WALLETS.BUTTON.DELETE");
    const cancelButton = this.translateService.instant("WALLETS.BUTTON.CANCEL");

    const actionSheet = this.actionSheetCtrl.create({
      title: ``,
      cssClass: 'wallet-on-press',
      buttons: [
        {
          text: editButton,
          icon: this.platform.is('ios') ? null : 'create',
          handler: () => {
            let page = "ContactUpdatePage"
            this.showModal(page, contact);
          }
        },
        {
          text: deleteButton,
          role: 'destructive',
          icon: this.platform.is('ios') ? null : 'trash',
          handler: () => {
            // this.navCtrl.push('ContactDeletePage', { contact: contact });
            let page = "ContactDeletePage"
            this.showModal(page, contact);
          }
        },
        {
          text: cancelButton,
          role: 'cancel',
          icon: this.platform.is('ios') ? null : 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showAddContactPrompt() {
    let alert = this.alertCtrl.create();
    const alertTitle = this.translateService.instant("SERVICES.ADDRESS_BOOK.ADD_CONTACT");
    const manualInput = this.translateService.instant("WALLETS.SEND.ADDRESS.OPTION1");
    const qrScan = this.translateService.instant("WALLETS.CREATE.IMPORT.QR_SCAN");
    const continueButton = this.translateService.instant("WALLETS.BUTTON.CONTINUE");
    const cancelButton = this.translateService.instant("WALLETS.BUTTON.CANCEL");

    alert.setTitle(alertTitle);

    alert.addInput({
      type: 'radio',
      label: manualInput,
      value: ContactCreationType.MANUAL.toString(),
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: qrScan,
      value: ContactCreationType.QR_SCAN.toString(),
      checked: false
    });

    alert.addButton(cancelButton);
    alert.addButton({
      text: continueButton,
      handler: data => {
        if (data === ContactCreationType.MANUAL.toString()) {
          let page = "ContactAddPage";
          this.showModal(page, {
            name: '',
            address: '',
            telegram: ''
          });
        } else if (data === ContactCreationType.QR_SCAN.toString()) {
          this.barcodeScanner.scan().then(barcodeData => {
            barcodeData.format = "QR_CODE";
            let address = barcodeData.text.split("-").join("")
            if (address.length != 40) {
              this.alertProvider.showMessage(this.translateService.instant("WALLETS.SEND.ADDRESS.INVALID"))
            } else if (!this.proximaxProvider.verifyNetworkAddressEqualsNetwork(this.address, address)) {
              this.alertProvider.showMessage(this.translateService.instant("WALLETS.SEND.ADDRESS.UNSOPPORTED"))
            } else {
              let page = "ContactAddPage";
              this.showModal(page, {
                name: '',
                address: barcodeData.text,
                telegram: ''
              });
            }
          });
        }
      }
    });
    alert.present();
  }

  update(contact) {
    let page = "ContactUpdatePage"
    this.showModal(page, contact);
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }


  showModal(page, params) {
    const modal = this.modalCtrl.create(page, { data: params }, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }




}
