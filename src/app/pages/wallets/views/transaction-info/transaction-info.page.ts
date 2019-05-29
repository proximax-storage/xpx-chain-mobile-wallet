import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../service/wallet.service';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.page.html',
  styleUrls: ['./transaction-info.page.scss'],
})
export class TransactionInfoPage implements OnInit {
  detail: any;
  wallet: any;

  constructor(
    private walletService: WalletService,
  ) { }

  ngOnInit() {
    this.detail = this.walletService.detailTransaction;
    this.wallet = this.walletService.current;
    this.distributed(this.detail);
    // console.log('in the component', this.wallet)
    // console.log('in the component', this.detail)
  }


  distributed(detail) {
    if (detail['data'].type === 16718) {
      console.log('registra name space')
    } else if (detail['data'].type === 16724) {
      console.log('es transfer')
    }else {
      console.log('es otra')
    }
    detail['data'].type 
  }
}
