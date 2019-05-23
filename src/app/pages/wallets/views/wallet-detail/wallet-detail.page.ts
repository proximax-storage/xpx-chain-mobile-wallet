import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { WalletService } from '../../service/wallet.service'
import { ProximaxProvider } from 'src/app/providers/proximax.provider';
import { environment } from '../../../../../environments/environment'

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
  transactions: any[];
  constructor(
    private nav: NavController,
    private storage: Storage,
    private activatedRoute: ActivatedRoute,
    private walletService: WalletService,
    private proximaxProvider: ProximaxProvider,
  ) { }

  ngOnInit() {
    this.mosaics = true;
    // this.data = this.activatedRoute.snapshot.paramMap.get('data');
    // this.wallet = JSON.parse(this.data)
    this.wallet = this.walletService.current;
    console.log('data recibida ....',  this.wallet);
    this.selectAllTransaction(this.wallet);
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

  selectAllTransaction(data) {
    this.storage.get('pin').then(async (val) => {
    const password = this.proximaxProvider.createPassword(val);
    const PrivateKey = this.proximaxProvider.decryptPrivateKey(password, data.encrypted, data.iv);
    const publicAccount = this.walletService.getPublicAccountFromPrivateKey(PrivateKey, environment.network)
    console.log('adress', publicAccount)
    this.walletService.getAllTransactionsFromAccount(publicAccount).subscribe(
      response =>{
        const data = [];
        response.forEach(element => {
          data.push(this.walletService.buidTansaction(element));
        });
        this.transactions = data
        console.log('data', this.transactions)
        

      }
    );
    // console.log('transaction from address', transaction)
  });
  }

  sendwallets() {
    console.log('Send changed');
    this.nav.navigateRoot(['/wallet-send']);
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
