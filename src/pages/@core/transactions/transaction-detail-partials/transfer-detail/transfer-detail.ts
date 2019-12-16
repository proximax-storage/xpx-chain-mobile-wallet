import { Component, Input } from '@angular/core';
import { TransactionType, Mosaic, MosaicId, NamespaceId } from 'tsjs-xpx-chain-sdk';
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
  valid: boolean;

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
      // console.log('\n\n this.tx.mosaics', this.tx.mosaics);

      if (this.tx.mosaics && this.tx.mosaics.length > 0) {
        const mosaics: Mosaic[] = this.tx.mosaics;
        const names = await this.getNameMosacis(mosaics.map(x => x.id));
        this.show = true;
        for (const element of this.tx.mosaics) {
          const mosaic = (this.mosaics.length > 0) ? this.mosaics.find(next => next.hex === element.id.toHex()) : null;
          if (mosaic) {
            let name = '';
            if (names.length > 0) {
              const exist = names.find(name => name.mosaicId.toHex() === element.id.toHex());
              if (exist && exist.names.length > 0) {
                name = exist.names[0].name;
              } else {
                const namespaceIds = mosaics.map(x => new NamespaceId([x.id.id.lower, x.id.id.higher]))
                const namespaceNames = await this.getNamespacesName(namespaceIds);
                let name = '';
                if (namespaceNames.length > 0) {
                  const exist = namespaceNames.find(name => name.namespaceId.toHex() === new NamespaceId([element.id.id.lower, element.id.id.higher]).toHex());
                  if (exist && exist.name) {
                    name = exist.name;
                  }
                }
              }
            } else {
              const namespaceIds = mosaics.map(x => new NamespaceId([x.id.id.lower, x.id.id.higher]))
              const namespaceNames = await this.getNamespacesName(namespaceIds);
              let name = '';
              if (namespaceNames.length > 0) {
                const exist = namespaceNames.find(name => name.namespaceId.toHex() === new NamespaceId([element.id.id.lower, element.id.id.higher]).toHex());
                if (exist && exist.name) {
                  name = exist.name;
                }
              }
            }
            this.mosaicFound.push(new DefaultMosaic({
              namespaceId: mosaic.namespaceId,
              hex: mosaic.hex,
              mosaicId: mosaic.mosaicId,
              amount: element.amount.compact(),
              amountCompact: element.amount.compact(),
              divisibility: mosaic.divisibility,
              name: name
            }));
          } else {
            console.log('1.......... MOSAIC NOT FOUND ---->');
            const namespaceIds = mosaics.map(x => new NamespaceId([x.id.id.lower, x.id.id.higher]))
            const namespaceNames = await this.getNamespacesName(namespaceIds);
            let name = '';
            if (namespaceNames.length > 0) {
              const exist = namespaceNames.find(name => name.namespaceId.toHex() === new NamespaceId([element.id.id.lower, element.id.id.higher]).toHex());
              if (exist && exist.name) {
                name = exist.name;
              }
            }

            this.mosaicFound.push(new DefaultMosaic({
              namespaceId: '',
              hex: element.id.toHex(),
              mosaicId: '',
              amount: element.amount.compact(),
              amountCompact: element.amount.compact(),
              divisibility: 6,
              name: name
            }));
          }
        };
      }

      const valid = this.IsJsonString(this.tx.message.payload);
      this.valid = valid;
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
        this.data = this.tx.message.payload
        return this.data
        this.messageShow = false
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   *
   *
   * @param {MosaicId[]} idMosaics
   * @returns
   * @memberof TransferDetailComponent
   */
  async getNameMosacis(idMosaics: MosaicId[]) {
    return await this.proximaxProvider.getMosaicsName(idMosaics).toPromise();
  }

  /**
   *
   *
   * @param {NamespaceId[]} namespaceIds
   * @returns
   * @memberof TransferDetailComponent
   */
  async getNamespacesName(namespaceIds: NamespaceId[]) {
    try {
      //Gets array of NamespaceName for an account
      const namespaceName = await this.proximaxProvider.namespaceHttp.getNamespacesName(namespaceIds).toPromise();
      return namespaceName;
    } catch (error) {
      //Nothing!
      return [];
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