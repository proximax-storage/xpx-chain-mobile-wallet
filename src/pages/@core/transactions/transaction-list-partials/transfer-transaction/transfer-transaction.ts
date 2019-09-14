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
  @Input() mosaics: any[] = [] ;
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
    const TX = this.tx;
    console.log('tx', TX)
    const MOSAICS = [...this.mosaics]
    

    this.array.push(TX.mosaics) 
    if (this.array && this.array.length > 0) {
      let valor = await this.mosaicsProvider.searchInfoMosaics(this.array);
      console.log('array --------------------------', this.array)
    }



    
    


    this.MOSAIC_INFO = MOSAICS.find(m => {
      return m.hex == TX.mosaics[0].id.id.toHex() || TX.mosaics[0].id.id.toHex() == TX.mosaics[0].id.id.toHex();
    });
    this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
    this.STATUS = this.status;
    this.AMOUNT = this.mosaicsProvider.getRelativeAmount(TX.mosaics[0].amount.compact(), this.MOSAIC_INFO.divisibility)
  }
}
