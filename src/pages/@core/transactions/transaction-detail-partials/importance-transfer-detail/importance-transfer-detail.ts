//"type": 2049

import { Component, Input } from '@angular/core';

import { App } from '../../../../../providers/app/app';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { NavParams } from 'ionic-angular';
import { Convert, MosaicInfo } from 'tsjs-xpx-chain-sdk';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';

@Component({
  selector: 'importance-transfer-detail',
  templateUrl: 'importance-transfer-detail.html'
})
export class ImportanceTransferDetailComponent {
  @Input() tx: any;
  App = App;
  hashTansaction: any;
  dataFormat: void;
  detalDesc: { Code: string; Descrip: string; };
  dataTotal: any;
  mosacic: any;
  nameMosaic: string;
  mosaicsHex: any;
  amountFormatter: string = '0';
  timestamp: string;

  constructor(
    public utils: UtilitiesProvider,
    private navParams: NavParams,
    private proximaxProvider: ProximaxProvider
  ) {
    const payload = this.navParams.data;
    this.tx = payload.transactions;
    this.hashTansaction = this.tx.transactionInfo.hash
    this.getBolck()
    this.tx.innerTransactions
      .filter(item => item.mosaics.length > 0)
      .map(async x => {
        this.dataTotal = x
        const msg = JSON.parse(x.message.payload)
        this.detalDesc = this.unSerialize(msg.msg)
        this.mosaicsHex = this.dataTotal.mosaics[0].id.toHex()
        await this.proximaxProvider.getMosaicsName([this.dataTotal.mosaics[0].id]).subscribe(name => {
          if (name[0].names.length > 0) {
            this.nameMosaic = name[0].names[0].name
          }
        })
        const mosaicsFound: MosaicInfo[] = await this.proximaxProvider.getMosaics([this.dataTotal.mosaics[0].id]).toPromise();
        const divisibility = mosaicsFound[0].divisibility
        const mosaicsAmount = this.dataTotal.mosaics[0].amount.compact()
        this.amountFormatter = this.proximaxProvider.amountFormatter(mosaicsAmount, divisibility)
      })
  }

  getBolck() {
    this.proximaxProvider.getBlockInfo(this.tx.transactionInfo.height.compact()).subscribe((blockInfo) => {
      this.timestamp = this.proximaxProvider.dateFormatUTC(blockInfo.timestamp);
    });
  }

  unSerialize(hex) {
    const dataUin8 = Convert.hexToUint8(hex)
    const codeUin8 = new Uint8Array(3)
    const dniUin8 = new Uint8Array(10)
    ///
    codeUin8.set(new Uint8Array(dataUin8.subarray(0, 3)), 0)
    dniUin8.set(new Uint8Array(dataUin8.subarray(3, 13)), 0)
    ///
    const code = Convert.uint8ToHex(codeUin8)
    const dni = this.hexToString(Convert.uint8ToHex(dniUin8))
    const data = {
      Code: code,
      Descrip: dni
    }
    return data;
  }

  hexToString(hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  }
}
