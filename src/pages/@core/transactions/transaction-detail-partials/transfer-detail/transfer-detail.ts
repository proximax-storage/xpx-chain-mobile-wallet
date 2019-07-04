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

  owner: Address;
  amount: number;
  mosaics: MosaicTransferable[];
  hasLevy: boolean;

  private _getAmount() {
    try {
      this.amount = this.tx.xem().amount;
    } catch (e) {
      this.amount = 0;
    }
  }

  private _getMosaics() {
    try {
      this.nemProvider.getMosaicsDefinition(this.tx.mosaics()).subscribe(mosaics => {
        this.mosaics = mosaics;
        this.hasLevy = this.mosaics.filter(mosaic => mosaic.levy).length
          ? true
          : false;
      });
    } catch (e) {
      this.mosaics = [];
    }
  }

  private _setOwner() {
    this.wallet.getSelectedWallet().then(wallet => {
      this.owner = wallet.address;
    });
  }

  constructor(
    private nemProvider: NemProvider,
    private wallet: WalletProvider,
    public utils: UtilitiesProvider
  ) {
    this.hasLevy = false;
    this.amount = 0;
    this.mosaics = [];
  }

  ngOnInit() {
    this._setOwner();
    this._getAmount();
    this._getMosaics();

    console.log(this.tx);

  }
}
