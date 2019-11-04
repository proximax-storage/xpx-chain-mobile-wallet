import { DefaultMosaic } from './../../../../../models/default-mosaic';
//"type": 257

import { Component, Input } from '@angular/core';
import { App } from '../../../../../providers/app/app';
import { TransferTransaction } from '../../../../../models/transfer-transaction';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';
import { MosaicId, TransactionType } from 'tsjs-xpx-chain-sdk';
import { AppConfig } from '../../../../../app/app.config';

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

  transactionDetails: TransferTransaction;
  
  App = App;
  LOGO: string = App.LOGO.DEFAULT;
  AMOUNT: number = 0;
  MOSAIC_INFO: DefaultMosaic = new DefaultMosaic({namespaceId: 'prx', mosaicId:'xpx', hex:AppConfig.xpxHexId, amount:0, divisibility:0});
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
    const _tx = this.tx.type === TransactionType.TRANSFER ? this.tx : this.tx['innerTransactions'][0];    
    this.tx = _tx;

    this.MOSAIC_INFO = this.mosaics.find(mosaic => {
      return mosaic.hex == _tx.mosaics[0].id.toHex()
    });

    this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
    this.STATUS = this.status;
    this.AMOUNT = this.mosaicsProvider.getRelativeAmount(_tx.mosaics[0].amount.compact(), this.MOSAIC_INFO.divisibility)
  }
}
