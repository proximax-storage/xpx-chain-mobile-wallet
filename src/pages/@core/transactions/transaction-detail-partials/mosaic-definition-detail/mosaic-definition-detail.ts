//"type": 16385

import { Component, Input } from '@angular/core';
import { Address } from 'tsjs-xpx-chain-sdk';

import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { App } from '../../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';

@Component({
  selector: 'mosaic-definition-detail',
  templateUrl: 'mosaic-definition-detail.html'
})
export class MosaicDefinitionDetailComponent {

  @Input() tx: any;
  App = App;

  owner: Address;

  private _setOwner() {
    this.wallet.getSelectedWallet().then(wallet => {
      this.owner = wallet.address;
    });
  }

  constructor(private wallet: WalletProvider, public utils: UtilitiesProvider) { }

  ngOnInit() {
    this._setOwner();
  }

}
