import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../service/wallet.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.page.html',
  styleUrls: ['./transaction-info.page.scss'],
})
export class TransactionInfoPage implements OnInit {
  detail: any;
  wallet: any;
  mosaic: any;
  mosaicId: any;
  name: any;
  amount: any;
  showT: boolean;
  showN: boolean;
  showL: boolean;

  constructor(
    private walletService: WalletService,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.showT = false;
    this.showN = false;
    this.detail = this.walletService.detailTransaction;
    // this.wallet = this.walletService.current;
    this.distributed(this.detail);
    // console.log('in the component', this.wallet)
    // console.log('in the component', this.detail['data']['mosaics'][0].id.toHex())
    
  }


  distributed(detail) {
    if (detail['data'].type === 16718) {
      console.log('registra name space')
      this.showN = true;
      this.showT = false;
    } else if (detail['data'].type === 16724) {
      console.log('es transfer')
      this.showT = true;
      this.showN = false;
      this.getMosaicsStore();
    } else if (detail['data'].type === 16712) {
      // this.getMosaicsStore();
      this.showL = true;

    }else {
      console.log('es otra')
    }
    detail['data'].type 
  }

  getMosaicsStore() {
    // const mosaicsL = this.detail['data']['transaction'].mosaicId
    const mosaicsT = this.detail['data']['mosaics'][0].id.toHex()
    // console.log('........ mosaics', mosaicsT)
    // console.log('........ mosaics', mosaicsL)
  this.storage.get('mosaics').then(m => {
    // console.log(m)
    m.forEach(element => {
      if (element.mosaicId === mosaicsT) {
        this.mosaic = element
      }
      
    });
    this.name = this.mosaic['name'][0]
    this.mosaicId = this.mosaic.mosaicId
    this.amount = this.walletService.amountFormatterSimple(this.detail['data']['mosaics'][0].amount.compact());
    
  })
  }
}
