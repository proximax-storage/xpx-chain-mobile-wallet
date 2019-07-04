//"type": 16385

import { Component, Input } from '@angular/core';
import { Address } from 'nem-library';

import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { App } from '../../../../../providers/app/app';

@Component({
  selector: 'mosaic-definition-transaction',
  templateUrl: 'mosaic-definition-transaction.html'
})
export class MosaicDefinitionTransactionComponent {
  @Input() tx: any;
  App = App;

  owner: Address;

  private _setOwner() {
    this.wallet.getSelectedWallet().then(wallet => {
      this.owner = wallet.address;
    });
  }

  constructor(private wallet: WalletProvider) {}

  ngOnInit() {
    this._setOwner();
  }
}
