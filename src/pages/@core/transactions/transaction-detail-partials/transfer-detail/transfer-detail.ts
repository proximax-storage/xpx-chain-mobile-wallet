import { Component, Input } from '@angular/core';
import { Deadline, Address } from 'tsjs-xpx-chain-sdk';

import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';

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
  mosaics: any[] = [];

  private async _getMosaics() {

    // let filter = this.tx.mosaics.filter(mosaics => mosaics)
    let filter = this.mosaicsProvider.mosacisAnt.filter(mosaics => mosaics)
    await this.mosaicsProvider.getArmedMosaic(filter).then(result => {
      filter.forEach(mosaicsI => {
        let filter2 = result.filter(mosaics => mosaics.hex === mosaicsI.id.toHex())
        this.mosaics.push(filter2[0])
      })
    })
  }

  private _setOwner() {
    this.wallet.getSelectedWallet().then(wallet => {
      this.owner = wallet.address;
    });
  }

  constructor(
    private wallet: WalletProvider,
    public utils: UtilitiesProvider,
    public mosaicsProvider: MosaicsProvider,
    private proximaxProvider: ProximaxProvider,
  ) {
    // console.log(this.tx);
  }

  ngOnInit() {
    this._setOwner();
    this._getMosaics();
  }
}
