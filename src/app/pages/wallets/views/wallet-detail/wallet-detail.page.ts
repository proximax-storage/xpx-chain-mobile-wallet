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
  segmentInformation: boolean;
  segmentTransaction: boolean;
  segmentMosaic: boolean;
  wallet: any;
  transactions: any[];
  publicKey: string;
  mosaics: any;
  constructor(
    private nav: NavController,
    private storage: Storage,
    private walletService: WalletService,
    private proximaxProvider: ProximaxProvider
  ) { }

  ngOnInit() {
    this.segmentMosaic = true;
    this.wallet = this.walletService.current;
    this.selectAllTransaction(this.wallet);
    this.selectMosaics(this.wallet.mosaics);
  }

  segmentChanged(ev: any) {
    const segment = ev.detail.value;
    console.log('Segment changed', segment);
    if (segment === 'segmentMosaic') {
      this.segmentMosaic = true;
      this.segmentTransaction = false;
      this.segmentInformation = false;
    } else if (segment === 'segmentTransaction') {
      this.segmentTransaction = true;
      this.segmentMosaic = false;
      this.segmentInformation = false;
    } else {
      this.segmentMosaic = false;
      this.segmentTransaction = false;
      this.segmentInformation = true;
    }
  }

  selectAllTransaction(data) {
    this.storage.get('pin').then(async (val) => {
      const password = this.proximaxProvider.createPassword(val);
      const PrivateKey = this.proximaxProvider.decryptPrivateKey(password, data.encrypted, data.iv);
      const publicAccount = this.walletService.getPublicAccountFromPrivateKey(PrivateKey, environment.network);
      this.publicKey = publicAccount.publicKey
      this.walletService.getAllTransactionsFromAccount(publicAccount).subscribe(
        response => {
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

  selectMosaics(data) {
    const datos = data.map(element => {
      return element.id;
    })
    this.walletService.getMosaicNames(datos).subscribe(
      response => {
        this.mosaics = [];
        response.forEach(element => {
          data.forEach(element2 => {
            if (element.mosaicId.toHex() === element2.id.toHex()) {
              let valores = {
                mosaicId: element.mosaicId.id.toHex(),
                name: element.names,
                amount: this.walletService.amountFormatterSimple(element2.amount.compact())
              }
              this.mosaics.push(valores)
            }
          });
        });
        console.log('xxxxxxx', this.mosaics)
        this.walletService.mosaicsFormWallet(this.mosaics);
      }
    );
  }

  sendwallets() {
    console.log('Send changed');
    this.nav.navigateRoot(['/wallet-send']);
  }

  recivedwallets() {
    console.log('Recived changed');
    this.nav.navigateRoot(`/wallet-receive`);
  }

  infoTransaction(info) {
    console.log('Recived changed', info);
    this.walletService.transactionDetail(info);
    this.nav.navigateRoot(`/transaction-info`);
  }
}
