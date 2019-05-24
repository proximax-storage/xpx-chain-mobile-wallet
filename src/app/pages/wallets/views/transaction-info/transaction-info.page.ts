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

    // console.log('in the component', this.wallet)
    // console.log('in the component', this.detail)
  }

}
