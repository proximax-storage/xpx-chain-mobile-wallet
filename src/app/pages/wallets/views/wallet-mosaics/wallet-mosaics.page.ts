import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-mosaics',
  templateUrl: './wallet-mosaics.page.html',
  styleUrls: ['./wallet-mosaics.page.scss'],
})
export class WalletMosaicsPage implements OnInit {
  transaction: boolean;
  information: boolean;
  price: boolean;

  constructor(private nav: NavController) { }

  ngOnInit() {
    this.transaction = true;
  }

  segmentChanged(ev: any) {
    const segment = ev.detail.value;
    console.log('Segment changed', segment);
    if ( segment === 'transaction') {
      this.transaction = true;
      this.price = false;
      this.information = false;
    } else if (segment === 'price') {
      this.transaction = false;
      this.price = true;
      this.information = false;
    } else {
      this.transaction = false;
      this.price = false;
      this.information = true;
    }

  }

  infoTransaction() {
    console.log('information')
    this.nav.navigateRoot(`/transaction-info`);
  }
}
