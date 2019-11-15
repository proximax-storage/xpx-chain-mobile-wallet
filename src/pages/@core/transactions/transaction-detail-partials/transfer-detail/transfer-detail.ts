import { Component, Input } from '@angular/core';
import { TransactionType } from 'tsjs-xpx-chain-sdk';

import { WalletProvider } from '../../../../../providers/wallet/wallet';
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
  public App = App;
  public ownerAddress: any;
  public message: any;
  public messageShow = false;
  show: boolean;

  constructor(
    private wallet: WalletProvider,
    public utils: UtilitiesProvider,
    public mosaicsProvider: MosaicsProvider,
    private proximaxProvider: ProximaxProvider
  ) {
  }
  
  ngOnInit() {
    this.tx = this.tx.type === TransactionType.TRANSFER ? this.tx : this.tx['innerTransactions'][0];    
    // this._setOwner();
    this._getMosaicInfo();
  }

  // private _setOwner() {
  //   this.wallet.getSelectedWallet().then(wallet => {
  //     console.log('wallet',wallet['account'].address.address);
      
  //     this.ownerAddress = wallet['account'].address.address;

  //     console.log('ownerAddress',this.ownerAddress);
  //   });
  // }

  getAbsoluteAmount(amount, divisibility){
    return  this.proximaxProvider.amountFormatter(amount, divisibility)
  }

  private async _getMosaicInfo() {
    console.log('this.this.tx', this.tx);
    
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
            }
            )
        })
      })[0]
    } else {
      this.show = false;
    }
   

     const valid = this.IsJsonString(this.tx.message.payload);

     if(valid){
      this.message = JSON.parse(this.tx.message.payload);
      if(this.message.message){
        this.messageShow = true
        return this.message;
      }
     } else {
      this.messageShow = false
     }
  }
  
  IsJsonString(str) { try { JSON.parse(str); } catch (e) { return false; } return true; } 
}
