//"type": 257

import { Component, Input } from '@angular/core';

import { Address, MosaicTransferable } from 'nem-library';

import { NemProvider } from '../../../../../providers/nem/nem';
import { WalletProvider } from '../../../../../providers/wallet/wallet';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { App } from '../../../../../providers/app/app';
import { TransferTransaction } from '../../../../../models/transfer-transaction';
import { HelperProvider } from '../../../../../providers/helper/helper';

@Component({
  selector: 'transfer-transaction',
  templateUrl: 'transfer-transaction.html'
})
export class TransferTransactionComponent {
  @Input() tx: TransferTransaction;
  @Input() owner: string;
  
  App = App;

  utils: UtilitiesProvider;
  helper: HelperProvider

  ngOnInit() {
    console.log("LOG: TransferTransactionComponent -> tx", this.tx);
    console.log("LOG: TransferTransactionComponent -> owner", this.owner);
  }

  getLogo() {
    console.log("LOG: TransferTransactionComponent -> getLogo -> this.tx.mosaics[0].id.toHex()", this.tx.mosaics[0].id.toHex());
    return this.utils.getLogo(this.tx.mosaics[0].id.toHex());
  }

  getAmount() {
    return this.helper.getRelativeAmount(this.tx.maxFee.compact());
  }
}
