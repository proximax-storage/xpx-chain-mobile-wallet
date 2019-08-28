import { DefaultMosaic } from './../../../../../models/default-mosaic';
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
  hiden: boolean;
  @Input() tx: TransferTransaction; // Type conversion for better code completion
  @Input() mosaics: DefaultMosaic[] = [] ;
  @Input() owner: string;
  @Input() status: string;
  
  App = App;
  LOGO: string = '';
  AMOUNT: number = 0;
  MOSAIC_INFO: DefaultMosaic = null;
  STATUS:string = '';
  array: any[]=[];

  constructor(
    private mosaicsProvider: MosaicsProvider,
    private utils: UtilitiesProvider,
    ){

  }

  ngOnInit() {
    this.getMosaicInfo();
  }

  async getMosaicInfo() {
    this.MOSAIC_INFO = this.mosaics.find(m => {
      return m.hex == this.tx.mosaics[0].id.id.toHex();
    });

    this.MOSAIC_INFO.amount = this.tx.mosaics[0].amount.compact();
    this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
    this.STATUS = this.status;
    this.AMOUNT = this.mosaicsProvider.getRelativeAmount(this.MOSAIC_INFO.amount, this.MOSAIC_INFO.divisibility)
  }
}
