import { Component, OnInit } from '@angular/core';
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
  wallet: any;
  transactions: any[];
  publicKey: string;
  constructor(
    private nav: NavController,
    private storage: Storage,
    private walletService: WalletService,
    private proximaxProvider: ProximaxProvider,
  ) { }

  ngOnInit() {
    this.mosaics = true;
    this.wallet = this.walletService.current;
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
    const publicAccount = this.walletService.getPublicAccountFromPrivateKey(PrivateKey, environment.network);
    this.publicKey = publicAccount.publicKey
    this.walletService.getAllTransactionsFromAccount(publicAccount).subscribe(
      response =>{
        const data = [];
        response.forEach(element => {
          data.push(this.walletService.buidTansaction(element));
        });
        this.transactions = data
        console.log('transaction from address', this.transactions)
      }
    );
   
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

  infoTransaction(info) {
    console.log('Recived changed');
    this.walletService.transactionDetail(info);
    this.nav.navigateRoot(`/transaction-info`);
  }

}
