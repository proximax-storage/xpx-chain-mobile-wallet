import { DefaultMosaic } from './../../../../../models/default-mosaic';
import { Component, Input } from '@angular/core';
import { App } from '../../../../../providers/app/app';
import { TransferTransaction } from '../../../../../models/transfer-transaction';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { TransactionType } from 'tsjs-xpx-chain-sdk';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';

@Component({
  selector: 'transfer-transaction',
  templateUrl: 'transfer-transaction.html'
})
export class TransferTransactionComponent {
  hiden: boolean;
  @Input() tx: TransferTransaction; // Type conversion for better code completion
  @Input() mosaics: DefaultMosaic[] = [];
  @Input() owner: string;
  @Input() status: string;

  transactionDetails: TransferTransaction;

  App = App;
  LOGO: string = App.LOGO.DEFAULT;
  AMOUNT: any = 0;
  MOSAIC_INFO: DefaultMosaic = new DefaultMosaic({ namespaceId: '', mosaicId: '', hex: '', amount: 0, amountCompact: 0, divisibility: 0 });
  STATUS: string = '';
  array: any[] = [];

  constructor(
    private utils: UtilitiesProvider,
    private proximaxProvider: ProximaxProvider
  ) {
  }

  ngOnInit() {
    this.getMosaicInfo();
  }

  async getMosaicInfo() {
    this.tx = this.tx.type === TransactionType.TRANSFER ? this.tx : this.tx['innerTransactions'][0];
    console.log('this.tx', this.tx);
    console.log('this.mosaics', this.mosaics);
    if (this.tx.mosaics.length > 0) {
      this.MOSAIC_INFO = this.mosaics.find(mosaic => {
        console.log(mosaic);
        return mosaic.hex == this.tx.mosaics[0].id.toHex()
      });

      console.log('this.MOSAIC_INFO', this.MOSAIC_INFO);
      
      this.AMOUNT = this.proximaxProvider.amountFormatter(this.tx.mosaics[0].amount.compact(), this.MOSAIC_INFO.divisibility)
    } else {
      this.AMOUNT = 0
    }

    this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
    this.STATUS = this.status;
    console.log('this.MOSAIC_INFO', this.MOSAIC_INFO);
    console.log('this.LOGO', this.LOGO);
  }
}
