import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.page.html',
  styleUrls: ['./wallet-detail.page.scss'],
})
export class WalletDetailPage implements OnInit {
  id: any;
  information: boolean;
  transaction: boolean;
  mosaics: boolean;
  constructor(
    private nav: NavController
  ) { }

  ngOnInit() {
    this.mosaics = true;
    // this.id = this.activatedRoute.snapshot.paramMap.get('Myid');
    // console.log('data recibida ....', Object.values(this.id));
  }

  segmentChanged(ev: any) {
    const segment = ev.detail.value;
    console.log('Segment changed', segment);
    if ( segment === 'mosaics') {
      this.mosaics = true;
      this.transaction = false;
      this.information = false;
    } else if (segment === 'transaction') {
      this.transaction = true;
      this.mosaics = false;
      this.information = false;
    } else {
      this.information = true;
      this.transaction = false;
      this.mosaics = false;
    }

  }

  sendwallets() {
    console.log('Send changed');
    this.nav.navigateRoot(`/wallet-send`);
  }

  recivedwallets() {
    console.log('Recived changed');
    this.nav.navigateRoot(`/wallet-receive`);
  }

  mosaicswallets() {
    console.log('Recived changed');
    this.nav.navigateRoot(`/wallet-mosaics`);

  }

  infoTransaction() {
    console.log('information')
    this.nav.navigateRoot(`/transaction-info`);
  }

}
