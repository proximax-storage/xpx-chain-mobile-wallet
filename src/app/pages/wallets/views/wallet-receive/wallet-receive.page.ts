import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../service/wallet.service';

@Component({
  selector: 'app-wallet-receive',
  templateUrl: './wallet-receive.page.html',
  styleUrls: ['./wallet-receive.page.scss'],
})
export class WalletReceivePage implements OnInit {
  wallet: any;

  constructor(
    private walletService: WalletService,
  ) { }

  ngOnInit() {
    this.wallet = this.walletService.current;
  }

  copyAddress(address) {
    console.log('copiando address', address)
  }

  shareAddress(address) {
    console.log('compartiendo address', address)
  }

}
