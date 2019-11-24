import { Component, Input } from '@angular/core';
import { TransactionType } from 'tsjs-xpx-chain-sdk';

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
  public App = App;
  public ownerAddress: any;
  public data: any;
  public messageShow = false;
  show: boolean;
  MESSAGE_: string;
  LOGO: string;

  constructor(
    public utils: UtilitiesProvider,
    public mosaicsProvider: MosaicsProvider,
    private proximaxProvider: ProximaxProvider
  ) {}
  
  ngOnInit() {
    this.tx = this.tx.type === TransactionType.TRANSFER ? this.tx : this.tx['innerTransactions'][0];   
    this._getMosaicInfo();
  }

  getAbsoluteAmount(amount, divisibility){
    return  this.proximaxProvider.amountFormatter(amount, divisibility)
  }

  private async _getMosaicInfo() {
    // Get mosaic details
    if (this.tx.mosaics.length > 0){
      this.show = true;
      this.mosaics = this.mosaics.filter(m1 => {
        return this.tx.mosaics.filter(m2 => {
          return m2.id.id.toHex() === m1.hex
        })
      }).map(m1=>{
        return this.tx.mosaics.map(m2 => {
          return new DefaultMosaic(
            {
              namespaceId: m1.namespaceId,
              hex: m1.hex,
              mosaicId: m1.mosaicId,
              amount: m2.amount.compact(),
              amountCompact: m2.amount.compact(),
              divisibility: m1.divisibility
            });
        });
      })[0]
    } else {
      this.show = false;
    }

     const valid = this.IsJsonString(this.tx.message.payload);
     if(valid){
      this.data = JSON.parse(this.tx.message.payload);
      if(this.data.message){
        this.messageShow = true
        return this.data;
      } else if(this.data.nis1Hash){
        this.messageShow = true
        return this.data;
      }
     } else {
      this.messageShow = false
     }
  }
  
  IsJsonString(str) { try { JSON.parse(str); } catch (e) { return false; } return true; } 
}
