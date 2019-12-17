import { BrowserTab } from '@ionic-native/browser-tab';
import { ToastProvider } from './../../../../providers/toast/toast';
import { Clipboard } from '@ionic-native/clipboard';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, Platform } from 'ionic-angular';
import { App } from '../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { ContactsProvider } from '../../../../providers/contacts/contacts';
import { TranslateService } from '@ngx-translate/core';


/**
 * Generated class for the ContactDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html'
})
export class ContactDetailPage {
  App = App;

  selectedContact: {
    id: number;
    name: string;
    address: string;
    telegram: string;
  };

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    private contactProvider: ContactsProvider,
    private clipboard: Clipboard,
    public platform: Platform,
    private toastProvider: ToastProvider,
    private translateService: TranslateService,
    private browserTab: BrowserTab,
    private safariViewController: SafariViewController

  ) {
    this.selectedContact = this.navParams.data.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactDetailPage');
  }


  gotoTelegram(username) {
    if (username) {
      let link = `https://t.me/${username}`;

      this.browserTab.isAvailable()
        .then(isAvailable => {
          if (isAvailable) {
            this.browserTab.openUrl(link);
          } else {

            this.safariViewController.isAvailable()
              .then((available: boolean) => {
                if (available) {

                  this.safariViewController.show({
                    url: link,
                    hidden: false,
                    animated: false,
                    transition: 'curl',
                    enterReaderModeIfAvailable: true,
                    tintColor: '#ff0000'
                  })
                    .subscribe((result: any) => {
                      if (result.event === 'opened') console.log('Opened');
                      else if (result.event === 'loaded') console.log('Loaded');
                      else if (result.event === 'closed') console.log('Closed');
                    },
                      (error: any) => console.error(error)
                    );

                } else {
                  // use fallback browser, example InAppBrowser
                }
              }
              );
          }
        });
    }
  }

  copyAddress() {
    this.clipboard.copy(this.selectedContact.address).then(_ => {
      this.toastProvider.show(`${this.selectedContact.name}'s address has been successfully copied to the clipboard.`, 3, true);
    })
  }

  confirm() {
    const actionSheet = this.actionSheetCtrl.create({
      title: this.translateService.instant("SERVICES.ADDRESS_BOOK.DELETE.WARNING"),
      cssClass: 'wallet-on-press',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: this.platform.is('ios') ? null : 'trash',
          handler: () => {
            this.deleteContacts();
          }
        },
        {
          text: 'Cancel',
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

  deleteContacts() {
    this.contactProvider
      .remove(this.selectedContact.id)
      .then(_ => {
        return this.dismiss();
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
