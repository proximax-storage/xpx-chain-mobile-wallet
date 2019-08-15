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
  @Input() status: string;
  
  App = App;
  LOGO: string = '';
  AMOUNT: number = 0;
  MOSAIC_INFO: any;
  STATUS:string = '';
  array: any[]=[];

  constructor(
    private mosaicsProvider: MosaicsProvider,
    private utils: UtilitiesProvider,
    ){

  }

  ngOnInit() {
    this.getMosaicInfo();
    console.log("SIRIUS CHAIN WALLET: TransferTransactionComponent -> ngOnInit -> this.status", this.status)

  }

  async getMosaicInfo() {
    // console.log('this.tx.mosaics[0]', this.tx.mosaics[0].id);
   
    // console.log('this.array', this.array);
    this.MOSAIC_INFO = this.mosaicsProvider.getMosaicInfo(this.tx.mosaics[0]);
    this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
    this.STATUS = this.status;
    this.array.push(this.tx.mosaics[0])
    await this.mosaicsProvider.getArmedMosaic(this.array).then(valores => {
      valores.forEach(element => {
        this.MOSAIC_INFO = element;
        this.AMOUNT = element.amount;
      });
      
    });
    // this.AMOUNT = this.MOSAIC_INFO.amount;
  }
}
