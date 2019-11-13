import { Component, ViewChild } from '@angular/core';
import { IonicPage, Events, Tabs, ModalController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { UtilitiesProvider } from '../../providers/utilities/utilities';
import { PostsProvider } from '../../providers/posts/posts';

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

  selectedIndex: number;
  notificationCount: number = 0; // To do get read count from API

  @ViewChild(Tabs) public tabs: Tabs;

  constructor(
    public events: Events,
    private utils: UtilitiesProvider,
    private modalCtrl: ModalController,
    private articles: PostsProvider
  ) {
    this.articles.getUnreadCount().then(count => {
      // console.log("Unread count", count);
      this.notificationCount = count;
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
    // this.navCtrl.push('SendPage');
    let page = "SendPage";
    const modal = this.modalCtrl.create(page, {
      enableBackdropDismiss: false,
      showBackdrop: true
    });
    modal.present();
  }

  clearNotification() {
    console.log("Clearing notification count");

    this.notificationCount = 0;
    // this.navCtrl.setRoot("NotificationPage");
    // this.utils.setRoot("");
  }
}
