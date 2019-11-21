import { DefaultMosaic } from './../../../../../models/default-mosaic';
import { Component, Input } from '@angular/core';
import { App } from '../../../../../providers/app/app';
import { TransferTransaction } from '../../../../../models/transfer-transaction';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { TransactionType } from 'tsjs-xpx-chain-sdk';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';
import { AppConfig } from '../../../../../app/app.config';
import { TranslateService } from '@ngx-translate/core';

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
  MOSAIC_INFO: any = { namespaceId: '', mosaicId: '', hex: '', amount: 0, amountCompact: 0, divisibility: 0 };
  array: any[] = [];
  showTx = false;
  MESSAGE_ = '';

  constructor(
    private utils: UtilitiesProvider,
    private proximaxProvider: ProximaxProvider,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.validateTransaction();
  }

  async validateTransaction() {
    switch (this.tx.type) {
      case TransactionType.TRANSFER:
        console.log('-------- IS TYPE TRANSFER --------');
        if (this.tx.mosaics.length > 0) {
          if (this.tx.mosaics.length === 1) {
            if (this.tx.mosaics[0].id.toHex() === AppConfig.mosaicXpxInfo.id || this.tx.mosaics[0].id.toHex() === AppConfig.mosaicXpxInfo.namespaceId) {
              this.MOSAIC_INFO = {
                namespaceId: AppConfig.mosaicXpxInfo.namespaceId,
                mosaicId: AppConfig.mosaicXpxInfo.id,
                divisibility: AppConfig.mosaicXpxInfo.divisibility,
                hex: '',
                fullName: 'PRX.XPX'
              };
              this.AMOUNT = this.proximaxProvider.amountFormatter(this.tx.mosaics[0].amount.compact(), this.MOSAIC_INFO.divisibility)
              this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
              this.showTx = true;
            }
          } else {
            console.log('------- MAS DE UN MOSAICO ------');
            this.MESSAGE_ = this.translateService.instant("WALLETS.MOSAICS_MULTIPLE");
            this.MOSAIC_INFO = null;
            this.AMOUNT = null;
            this.LOGO = App.LOGO.DEFAULT;
            this.showTx = true;
          }
        } else {
          this.MESSAGE_ = this.translateService.instant("WALLETS.TRANSACTION.DETAIL.MESSAGE");
          this.MOSAIC_INFO = null;
          this.AMOUNT = null;
          this.LOGO = App.LOGO.DEFAULT;
          this.showTx = true;
        }
        break;
      default:
        break;
    }
    // this.tx = this.tx.type === TransactionType.TRANSFER ? this.tx : this.tx['innerTransactions'][0];
    /*if (this.tx.mosaics.length > 0) {
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
    this.STATUS = this.status;*/
    // console.log('this.MOSAIC_INFO', this.MOSAIC_INFO);
    // console.log('this.LOGO', this.LOGO);
  }
}
