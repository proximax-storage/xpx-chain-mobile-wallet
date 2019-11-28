
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Events, Tabs, ModalController, ActionSheetController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { PostsProvider } from '../../providers/posts/posts';
import { AlertProvider } from '../../providers/alert/alert';
import { WalletProvider } from '../../providers/wallet/wallet';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabIndex: number;
  tab1Root = HomePage;
  tab2Root = 'NotificationPage';
  tab3Root = 'ServicesPage';
  tab4Root = 'SettingListPage';
  tab5Root = '';

  selectedIndex: number;
  notificationCount: number = 0; // To do get read count from API

  @ViewChild(Tabs) public tabs: Tabs;
  account: any = [];
  constructor(
    public events: Events,
    private utils: UtilitiesProvider,
    private modalCtrl: ModalController,
    private articles: PostsProvider,
    public actionsheetCtrl: ActionSheetController,
    private alertProvider: AlertProvider,
    private walletProvider: WalletProvider
  ) {
    this.articles.getUnreadCount().then(count => {
      // console.log("Unread count", count);
      this.notificationCount = count;
      this.account = this.walletProvider.selectesAccount;
    })
  }

  ionViewWillEnter() {
    this.utils.setHardwareBack();

    this.events.subscribe('tab:back', (index) => {
      this.tabs.select(index);
    });
  }

  ionViewWillLeave() {
    this.events.unsubscribe('tab:back');
  }

  gotoSend() {
    let page = "SendPage";
    const modal = this.modalCtrl.create(page, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  gotoReceive() {
    let page = "ReceivePage";
    const modal = this.modalCtrl.create(page, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  clearNotification() {
    console.log("Clearing notification count");
    this.notificationCount = 0;
  }

  openMenu() {
    if (this.account != undefined || this.account != null){
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Options',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Send',
          icon: 'custom-send',
          handler: () => {
            console.log('Share clicked');
            this.gotoSend();
          }
        },
        {
          text: 'Receive',
          icon:  'custom-receive',
          handler: () => {
            console.log('Delete clicked');
            this.gotoReceive();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  } else {
    this.alertProvider.showMessage('No possee cuentas aun')
  }
  }
}
