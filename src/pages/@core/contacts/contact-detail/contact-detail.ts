import { BrowserTab } from '@ionic-native/browser-tab';
import { ToastProvider } from './../../../../providers/toast/toast';
import { Clipboard } from '@ionic-native/clipboard';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { App } from '../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { SafariViewController } from '@ionic-native/safari-view-controller';

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
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public utils: UtilitiesProvider, 
    private viewCtrl: ViewController,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private browserTab: BrowserTab,
    private safariViewController: SafariViewController
    ) {
    console.log(this.navParams.data);
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
            // open URL with InAppBrowser instead or SafariViewController

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

  dismiss(){
    this.viewCtrl.dismiss();
  }

  copyAddress() {
    this.clipboard.copy(this.selectedContact.address).then(_=> {
      this.toastProvider.show(`${this.selectedContact.name}'s address has been successfully copied to the clipboard.`, 3, true);
    })
  }
}
