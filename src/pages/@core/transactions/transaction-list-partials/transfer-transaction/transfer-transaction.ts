import { DefaultMosaic } from './../../../../../models/default-mosaic';
//"type": 257

import { Component, Input } from '@angular/core';
import { App } from '../../../../../providers/app/app';
import { TransferTransaction } from '../../../../../models/transfer-transaction';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';
import { MosaicId } from 'tsjs-xpx-chain-sdk';

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
  LOGO: string = App.LOGO.DEFAULT;
  AMOUNT: number = 0;
  MOSAIC_INFO: DefaultMosaic = null;
  STATUS:string = '';
  array: any[]=[];

  constructor(
    private mosaicsProvider: MosaicsProvider,
    private utils: UtilitiesProvider
    ){

      
  }

  ngOnInit() {
    this.getMosaicInfo();
  }

  async getMosaicInfo() {
    const TX = this.tx;
    // console.log('tx', TX)
    const MOSAICS = [...this.mosaics]
    const arr= this.tx.mosaics.map(x => x.id);
    this.array.push(new MosaicId([arr[0].id.lower, arr[0].id.higher])) 
    await this.mosaicsProvider.searchInfoMosaics(this.array).then( valor => {
      
    this.MOSAIC_INFO = MOSAICS.find(m => {
      return m.hex == TX.mosaics[0].id.id.toHex() || valor[0].mosaicNames.names[0].namespaceId.toHex() == TX.mosaics[0].id.id.toHex();
    });

    this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
    console.log('this.LOGO', this.LOGO)
    this.STATUS = this.status;
    this.AMOUNT = this.mosaicsProvider.getRelativeAmount(TX.mosaics[0].amount.compact(), this.MOSAIC_INFO.divisibility)
    })
  }
}
