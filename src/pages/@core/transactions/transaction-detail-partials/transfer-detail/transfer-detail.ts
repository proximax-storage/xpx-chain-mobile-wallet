import { Component, Input } from '@angular/core';
import { TransactionType, Mosaic } from 'tsjs-xpx-chain-sdk';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';
import { DefaultMosaic } from '../../../../../models/default-mosaic';

/**
 * Generated class for the TransferDetailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'transfer-detail',
  templateUrl: 'transfer-detail.html'
})
export class TransferDetailComponent {
  @Input() tx: any;
  @Input() mosaics: DefaultMosaic[] = [];
  @Input() owner: string;
  @Input() status: string;
  App = App;
  ownerAddress: any;
  data: any;
  messageShow = false;
  show: boolean;
  MESSAGE_: string;
  LOGO: string;
  effectiveFee: string = '0';
  timestamp: string;
  deadline: string;
  mosaicFound = [];

  constructor(
    public utils: UtilitiesProvider,
    public mosaicsProvider: MosaicsProvider,
    private proximaxProvider: ProximaxProvider
  ) {
  }

  ngOnInit() {
    this.tx = this.tx.type === TransactionType.TRANSFER ? this.tx : this.tx['innerTransactions'][0];
    if (this.status != 'partials') {
      this.getBolck();
    } else {
      this.deadline = this.proximaxProvider.dateFormat(this.tx.deadline);
    }
    this._getMosaicInfo();
  }

  getBolck() {
    this.proximaxProvider.getBlockInfo(this.tx.transactionInfo.height.compact()).subscribe((blockInfo) => {
      this.timestamp = this.proximaxProvider.dateFormatUTC(blockInfo.timestamp);
      this.effectiveFee = this.proximaxProvider.amountFormatterSimple(blockInfo.feeMultiplier * this.tx.size);
    });
  }

  getAbsoluteAmount(amount, divisibility) {
    return this.proximaxProvider.amountFormatter(amount, divisibility)
  }

  private async _getMosaicInfo() {
    try {
      // Get mosaic details
    console.log('\n\n this.tx.mosaics', this.tx.mosaics);
    if (this.tx.mosaics && this.tx.mosaics.length > 0) {
      this.show = true;
      this.tx.mosaics.forEach((element: Mosaic) => {
        const mosaic = (this.mosaics.length > 0) ? this.mosaics.find(next => next.hex === element.id.toHex()) : null;
        console.log('MOSAIC FOUND --->', mosaic);
        if (mosaic) {
          this.mosaicFound.push(new DefaultMosaic({
            namespaceId: mosaic.namespaceId,
            hex: mosaic.hex,
            mosaicId: mosaic.mosaicId,
            amount: element.amount.compact(),
            amountCompact: element.amount.compact(),
            divisibility: mosaic.divisibility
          }));
        } else {
          console.log('MOSAIC NOT FOUND ---->');
          this.mosaicFound.push(new DefaultMosaic({
            namespaceId: '',
            hex: element.id.toHex(),
            mosaicId: '',
            amount: element.amount.compact(),
            amountCompact: element.amount.compact(),
            divisibility: 6
          }));
        }
      });
    }

    const valid = this.IsJsonString(this.tx.message.payload);
    if (valid) {
      this.data = JSON.parse(this.tx.message.payload);
      if (this.data.message) {
        this.messageShow = true
        return this.data;
      } else if (this.data.nis1Hash) {
        this.messageShow = true
        return this.data;
      }
    } else {
      this.messageShow = false
    }
    } catch (error) {
      
    }
  }

  /**
   *
   *
   * @param {boolean} isSwap
   * @param {DefaultMosaic} mosaic
   * @memberof TransferDetailComponent
   */
  getLogo(isSwap: boolean, mosaic: DefaultMosaic) {
    return (isSwap) ? App.LOGO.XPX : this.utils.getLogo(mosaic);
  }

  IsJsonString(str) { try { JSON.parse(str); } catch (e) { return false; } return true; }
}