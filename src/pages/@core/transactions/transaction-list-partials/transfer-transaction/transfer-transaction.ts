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
    console.log("SIRIUS CHAIN WALLET: TransferTransactionComponent -> ngOnInit -> this.status", this.status)

  }

  async getMosaicInfo() {

    // console.log('LOG: TransferTransactionComponent -> getMosaicInfo -> this.mosaics', this.mosaics);

    // console.log('LOG: TransferTransactionComponent -> getMosaicInfo -> this.tx', this.tx);

    // console.log('LOG: TransferTransactionComponent -> getMosaicInfo -> this.tx', this.tx.mosaics[0].id.id.toHex());


    this.MOSAIC_INFO = this.mosaics.find(m => {
      return m.hex == this.tx.mosaics[0].id.id.toHex();
    });

    this.MOSAIC_INFO.amount = this.tx.mosaics[0].amount.compact();

    console.log('LOG: TransferTransactionComponent -> getMosaicInfo -> MOSAIC_INFO', this.MOSAIC_INFO);

    // this.MOSAIC_INFO = this.mosaicsProvider.getMosaicInfo(this.tx.mosaics[0]);


    this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
    this.STATUS = this.status;

    // this.AMOUNT = this.mosaicsProvider.getRelativeAmount1(this.tx.mosaics[0].amount.compact(), this.MOSAIC_INFO.divisibility)

    this.AMOUNT = this.mosaicsProvider.getRelativeAmount1(this.MOSAIC_INFO.amount, this.MOSAIC_INFO.divisibility)

    // this.array.push(this.tx.mosaics[0])
    // await this.mosaicsProvider.getOwnedMosaic(this.array).then(valores => {
    //   valores.forEach(element => {
    //     this.MOSAIC_INFO = element;
    //     this.AMOUNT = element.amount;
    //     if(this.AMOUNT){
    //       this.hiden = true;
    //     }
    //   });
    
    // });
  }
}
