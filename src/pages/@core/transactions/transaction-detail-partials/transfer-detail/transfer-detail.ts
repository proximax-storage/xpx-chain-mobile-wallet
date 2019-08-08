import { Component, Input } from '@angular/core';
import { Deadline, Address } from 'tsjs-xpx-chain-sdk';

import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';

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

  mosaics: any[]=[];

  private _getMosaics() {
      this.tx.mosaics.forEach(mosaic => {
         const mosaicInfo= this.mosaicsProvider.setMosaicInfo(mosaic);
        this.mosaics.push(mosaicInfo)
        console.log('this.mosaics', this.mosaics)
      });
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
  ) {
    // console.log(this.tx);
  }


  ngOnInit() {
    this._setOwner();
    this._getMosaics();
  }
}
