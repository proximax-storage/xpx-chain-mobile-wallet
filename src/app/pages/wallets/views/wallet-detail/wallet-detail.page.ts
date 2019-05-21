import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.page.html',
  styleUrls: ['./wallet-detail.page.scss'],
})
export class WalletDetailPage implements OnInit {
  information: boolean;
  transaction: boolean;
  mosaics: boolean;
  data: string;
  wallet: any;
  constructor(
    private nav: NavController,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.mosaics = true;
    this.data = this.activatedRoute.snapshot.paramMap.get('data');
    this.wallet = JSON.parse(this.data)
    
    console.log('data recibida ....', JSON.parse(this.data));
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
    this.nav.navigateRoot(['/wallet-send', this.data]);
  }

  recivedwallets() {
    console.log('Recived changed');
    this.nav.navigateRoot(`/wallet-receive`);
  }

  // mosaicswallets() {
  //   console.log('Recived changed');
  //   this.nav.navigateRoot(`/wallet-mosaics`);

  // }

  infoTransaction() {
    console.log('information')
    this.nav.navigateRoot(`/transaction-info`);
  }

}
