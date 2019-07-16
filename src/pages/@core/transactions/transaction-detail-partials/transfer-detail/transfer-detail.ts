//"type": 257

import { Component, Input } from '@angular/core';

import { Address, MosaicTransferable } from 'nem-library';

import { NemProvider } from '../../../../../providers/nem/nem';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';

/**
 * Generated class for the TransferDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'transfer-detail',
  templateUrl: 'transfer-detail.html'
})
export class TransferDetailComponent {
  @Input() tx: any;
  App = App;

  constructor(
    public utils: UtilitiesProvider
  ) {
    console.log(this.tx);
  }

  ngOnInit() {
    // this._setOwner();
    // this._getAmount();
    // this._getMosaics();

    console.log(this.tx);

  }
}
