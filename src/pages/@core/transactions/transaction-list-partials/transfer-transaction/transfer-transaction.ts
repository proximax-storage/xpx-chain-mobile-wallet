//"type": 257

import { Component, Input } from '@angular/core';
import { App } from '../../../../../providers/app/app';
import { TransferTransaction } from '../../../../../models/transfer-transaction';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';

@Component({
  selector: 'transfer-transaction',
  templateUrl: 'transfer-transaction.html'
})
export class TransferTransactionComponent {
  @Input() tx: TransferTransaction; // Type conversion for better code completion
  @Input() owner: string;
  
  App = App;
  LOGO: string = '';
  AMOUNT: number = 0;
  MOSAIC_INFO: any;


  constructor(
    private mosaicsProvider: MosaicsProvider,
    private utils: UtilitiesProvider,
    ){
  }

  ngOnInit() {
    // this.getMosaicInfo();
  }

  getMosaicInfo() {
    this.MOSAIC_INFO = this.mosaicsProvider.setMosaicInfo(this.tx.mosaics[0]);
    console.log("LOG: TransferTransactionComponent -> getMosaicInfo -> this.MOSAIC_INFO", this.MOSAIC_INFO);
    this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
    this.AMOUNT = this.MOSAIC_INFO;
  }
}
