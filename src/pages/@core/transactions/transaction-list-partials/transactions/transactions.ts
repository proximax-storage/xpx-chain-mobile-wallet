import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TransactionType } from 'tsjs-xpx-chain-sdk';
import { TranslateService } from '@ngx-translate/core';
import { App } from '../../../../../providers/app/app';
import { DefaultMosaic } from '../../../../../models/default-mosaic';
import { TransferTransaction } from '../../../../../models/transfer-transaction';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';
import { AppConfig } from '../../../../../app/app.config';
import { AlertProvider } from '../../../../../providers/alert/alert';
import { MosaicsProvider } from '../../../../../providers/mosaics/mosaics';

@Component({
  selector: 'transactions',
  templateUrl: 'transactions.html'
})
export class TransactionComponent {
  hiden: boolean;
  @Input() tx: TransferTransaction; // Type conversion for better code completion
  @Input() mosaics: DefaultMosaic[] = [];
  @Input() owner: string;
  @Input() status: string;
  @Output() viewTxDetail = new EventEmitter();

  transactionDetails: TransferTransaction;
  arraTypeTransaction = {
    transfer: {
      id: TransactionType.TRANSFER,
      name: "Transfer"
    },
    registerNameSpace: {
      id: TransactionType.REGISTER_NAMESPACE,
      name: "Register Namespace"
    },
    mosaicDefinition: {
      id: TransactionType.MOSAIC_DEFINITION,
      name: "Mosaic Definition"
    },
    mosaicSupplyChange: {
      id: TransactionType.MOSAIC_SUPPLY_CHANGE,
      name: "Mosaic Supply Change"
    },
    modifyMultisigAccount: {
      id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
      name: "Modify Multisig Account"
    },
    aggregateComplete: {
      id: TransactionType.AGGREGATE_COMPLETE,
      name: "Aggregate Complete"
    },
    aggregateBonded: {
      id: TransactionType.AGGREGATE_BONDED,
      name: "Aggregate Bonded"
    },
    mosaicAlias: {
      id: TransactionType.MOSAIC_ALIAS,
      name: "Mosaic Alias"
    },
    addressAlias: {
      id: TransactionType.ADDRESS_ALIAS,
      name: "Address Alias"
    },
    lock: {
      id: TransactionType.LOCK,
      name: "LockFund"
    },
    secretLock: {
      id: TransactionType.SECRET_LOCK,
      name: "Secret lock"
    },
    secretProof: {
      id: TransactionType.SECRET_PROOF,
      name: "Secret proof"
    }
  };
  App = App;
  LOGO: string = App.LOGO.DEFAULT;
  AMOUNT: any = 0.000000;
  MOSAIC_INFO: any = { namespaceId: '', mosaicId: '', hex: '', amount: 0, amountCompact: 0, divisibility: 0 };
  array: any[] = [];
  showTx = false;
  MESSAGE_ = '';
  statusViewDetail: boolean = false;
  type = '';

  constructor(
    private alertProvider: AlertProvider,
    private utils: UtilitiesProvider,
    private mosaicsProvider: MosaicsProvider,
    private proximaxProvider: ProximaxProvider,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.validateTransaction();
  }

  /**
   *
   *
   * @memberof TransactionComponent
   */
  async validateTransaction() {
    switch (this.tx.type) {
      case TransactionType.TRANSFER:
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

              this.AMOUNT = this.proximaxProvider.amountFormatter(this.tx.mosaics[0].amount.compact(), this.MOSAIC_INFO.divisibility);
              this.LOGO = this.utils.getLogo(this.MOSAIC_INFO);
              this.showTx = true;
              this.statusViewDetail = true;
              this.type = 'Transfer';
            } else {
              const mosaic = (this.mosaics.length > 0) ? this.mosaics.find(next => next.hex === this.tx.mosaics[0].id.toHex()) : null;
              if (mosaic) {
                this.MESSAGE_ = 'ProximaX Digital Asset';
                this.MOSAIC_INFO = null
                this.LOGO = App.LOGO.SIRIUS;
                this.showTx = true;
                this.type = this.tx.mosaics[0].id.toHex()
                this.statusViewDetail = true;
                this.AMOUNT = this.proximaxProvider.amountFormatter(this.tx.mosaics[0].amount.compact(), mosaic.divisibility);
              } else {
                this.MESSAGE_ = 'ProximaX Digital Assets';
                this.MOSAIC_INFO = null
                this.LOGO = App.LOGO.SIRIUS;
                this.showTx = true;
                this.type = this.tx.mosaics[0].id.toHex()
                this.statusViewDetail = true;
                this.mosaicsProvider.getMosaicsFromMosaics(this.tx.mosaics).subscribe(dataMosaic => {
                  if (dataMosaic) {
                    this.mosaics.push(dataMosaic[0]);
                    this.AMOUNT = this.proximaxProvider.amountFormatter(this.tx.mosaics[0].amount.compact(), dataMosaic[0].divisibility);
                  } else {
                    this.AMOUNT = this.proximaxProvider.amountFormatter(this.tx.mosaics[0].amount.compact(), 6);
                  }
                });
              }
            }
          } else {
            this.MESSAGE_ = 'ProximaX Digital Asset';
            this.MOSAIC_INFO = null;
            this.LOGO = App.LOGO.SIRIUS;
            this.showTx = true;
            this.type = `Digital Assets (${this.tx.mosaics.length})`;
            this.statusViewDetail = true;
            this.AMOUNT = null;
            const mosaics = [].slice(0);
            this.mosaicsProvider.getMosaicsFromMosaics(this.tx.mosaics).subscribe(dataMosaic => {
              if (dataMosaic) {
                dataMosaic.forEach(element => {
                  mosaics.push(element);
                });
              }
            });

            this.mosaics = mosaics.slice(0);
          }
        } else {
          this.MESSAGE_ = 'Other transactions';
          this.MOSAIC_INFO = null;
          this.AMOUNT = null;
          this.LOGO = App.LOGO.OTHER;
          this.showTx = true;
          this.type = 'Transfer';
          this.statusViewDetail = true;
        }
        break;
      case TransactionType.AGGREGATE_BONDED:
        if (this.tx['innerTransactions'].length === 1) {
          if (this.tx['innerTransactions'][0].type === TransactionType.TRANSFER && this.tx['innerTransactions'][0]["message"] && this.tx['innerTransactions'][0]["message"].payload !== "") {
            try {
              const msg = JSON.parse(this.tx['innerTransactions'][0]["message"].payload);
              const addressAccountMultisig = AppConfig.swap.addressAccountMultisig;
              const addressAccountSimple = AppConfig.swap.addressAccountSimple;
              const addressSender = this.tx['innerTransactions'][0].signer.address.plain();
              if ((addressSender === addressAccountMultisig) || (addressSender === addressAccountSimple)) {
                if (msg && msg["type"] && msg["type"] === "Swap") {
                  this.MESSAGE_ = "ProximaX Swap";
                  this.MOSAIC_INFO = null;
                  this.AMOUNT = null;
                  this.LOGO = App.LOGO.SWAP;
                  this.showTx = true;
                  this.type = 'PRX.XPX';
                  this.statusViewDetail = true;
                }
              }
            } catch (error) {
              this.MESSAGE_ = 'Aggregate Bonded';
              this.MOSAIC_INFO = null;
              this.AMOUNT = null;
              this.LOGO = App.LOGO.BONDED;
              this.showTx = true;
              if (this.tx['innerTransactions'][0].type === TransactionType.TRANSFER) {
                this.statusViewDetail = true;
                this.type = '';
              } else {
                this.statusViewDetail = false;
                const type = Object.keys(this.arraTypeTransaction).find(position => this.arraTypeTransaction[position].id === this.tx.type);
                this.type = (type && type !== '') ? this.arraTypeTransaction[type]['name'] : '';
              }
            }
          } else {
            this.MESSAGE_ = 'Aggregate Bonded';
            this.MOSAIC_INFO = null;
            this.AMOUNT = null;
            this.LOGO = App.LOGO.BONDED;
            this.showTx = true;
            if (this.tx['innerTransactions'][0].type === TransactionType.TRANSFER) {
              this.statusViewDetail = true;
              this.type = '';
            } else {
              this.statusViewDetail = false;
              const type = Object.keys(this.arraTypeTransaction).find(position => this.arraTypeTransaction[position].id === this.tx['innerTransactions'][0].type);
              this.type = (type && type !== '') ? this.arraTypeTransaction[type]['name'] : '';
            }
          }
        } else {
          this.MESSAGE_ = 'Aggregate Bonded';
          this.MOSAIC_INFO = null;
          this.AMOUNT = null;
          this.LOGO = App.LOGO.BONDED;
          this.statusViewDetail = false;
          this.showTx = true;
        }
        break;
      default:
        let type = Object.keys(this.arraTypeTransaction).find(position => this.arraTypeTransaction[position].id === this.tx.type);
        this.MESSAGE_ = 'Other Transactions';
        this.MOSAIC_INFO = null;
        this.AMOUNT = null;
        this.LOGO = App.LOGO.OTHER;
        this.type = (type && type !== '') ? this.arraTypeTransaction[type]['name'] : '';
        this.statusViewDetail = false;
        this.showTx = true;
        break;
    }
  }
  /**
   *
   *
   * @param {Transaction} tx
   * @memberof TransactionComponent
   */
  viewDetail(tx: any) {
    if (this.statusViewDetail) {
      this.viewTxDetail.emit(tx);
    } else {
      this.alertProvider.showMessage(this.translateService.instant('APP.MESSAGE.ERROR_TXN_NOT_SUPPORT'));
    }
  }
}
