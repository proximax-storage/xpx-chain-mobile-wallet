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
  deadline: Deadline
  amount: number;
  mosaics: any;
//   mosaics: MosaicTransferable[];
  hasLevy: boolean;

//   private _getAmount() {
//     try {
//       this.amount = this.tx.xem().amount;
//     } catch (e) {
//       this.amount = 0;
//     }
//   }

  private _getMosaics() {
      this.tx.mosaics.forEach(mosaic => {
         const mosaicInfo= this.mosaicsProvider.setMosaicInfo(mosaic);
        this.mosaics = [mosaicInfo]
      });
    // try {
    //   this.nemProvider.getMosaicsDefinition(this.tx.mosaics()).subscribe(mosaics => {
    //     this.mosaics = mosaics;
    //     this.hasLevy = this.mosaics.filter(mosaic => mosaic.levy).length
    //       ? true
    //       : false;
    //   });
    // } catch (e) {
    //   this.mosaics = [];
    // }
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
    console.log(this.tx);
  }


  ngOnInit() {
    this._setOwner();
    // this._getAmount();
    this._getMosaics();
  }
}
