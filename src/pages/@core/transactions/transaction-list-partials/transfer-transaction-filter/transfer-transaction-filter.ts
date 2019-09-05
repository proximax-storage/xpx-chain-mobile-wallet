
import { Component, Input } from '@angular/core';

import { Address, MosaicId, Transaction } from 'tsjs-xpx-chain-sdk';

import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { text } from '@angular/core/src/render3/instructions';
/**
 * Generated class for the TransferTransactionFilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'transfer-transaction-filter',
  templateUrl: 'transfer-transaction-filter.html'
})
export class TransferTransactionFilterComponent {

  @Input() tx: Transaction;
  @Input() mosaicId: string;
  @Input() owner: string;

  App = App;

  // owner: Address;
  amount: number;
  hasLevy: boolean;
  mosaicInfo: { mosaicId: string; divisibility: number; }[];


  private _getAmount() {
    try {
      this.amount = (this.tx as any).xem().amount;
    } catch (e) {
      this.amount = 0;
    }
  }

  private _getMosaics() {
    // console.log("LOG: TransferTransactionFilterComponent -> private_getMosaics -> _getMosaics", this.mosaicId);
    // console.log("LOG: TransferTransactionFilterComponent -> private_getMosaics -> this.tx", this.tx);
    // try {
      // this.nemProvider.getMosaicsDefinition(this.tx.mosaics()).subscribe(mosaics => {
      //   this.mosaics = mosaics;
      //   console.log(mosaics);
      //   this.hasLevy = this.mosaics.filter(mosaic => mosaic.levy).length
      //     ? true
      //     : false;
      // });

      // this.mosaics = this.tx.filter(tx=> tx._mosaics[0].mosaicId.name == this.mosaicId);

      // tx.mosaics()
      // console.log("LOG: TransferTransactionFilterComponent -> private_getMosaics -> tx.mosaics()", this.tx.mosaics());
      
      // this.mosaics = this.tx.mosaics().filter(mosaic=> mosaic.mosaicId == this.mosaicId);
			// console.log("LOG: TransferTransactionFilterComponent -> private_getMosaics -> this.mosaics", this.mosaics);


    // } catch (e) {
    //   this.mosaics = [];
    // }
  }

  private _setOwner() {
    // this.wallet.getSelectedWallet().then(wallet => {
    //   this.owner = wallet.address;
    // });
  }

  constructor(
    private wallet: WalletProvider,
    public utils: UtilitiesProvider
  ) {
    this.hasLevy = false;
    this.amount = 0;
    // this.mosaics = [];

    this.mosaicInfo = [
      { mosaicId: 'xpx', divisibility: 6 },
      { mosaicId: 'xem', divisibility: 6 },
      { mosaicId: 'npxs', divisibility: 6 },
      { mosaicId: 'sft', divisibility: 6 },
      { mosaicId: 'xar', divisibility: 4 },
    ]

  }

  getDivisibility(): number {
    let currentMosaic = this.mosaicInfo.find(mosaic => mosaic.mosaicId == this.mosaicId);

    if (currentMosaic != undefined) {

      if (currentMosaic.divisibility == 6) {
        return 1e6;
      }
      else if (currentMosaic.divisibility == 4) {
        return 1e4;
      }

    } else {
      return 1e6;
    }
  }

  ngOnInit() {
    // this._getMosaics();
    this._getAmount();
    // this._setOwner();
  }
}
