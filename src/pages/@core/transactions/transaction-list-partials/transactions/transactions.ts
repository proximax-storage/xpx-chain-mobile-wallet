import { DefaultMosaic } from '../../../../../models/default-mosaic';
import { Component, Input } from '@angular/core';
import { App } from '../../../../../providers/app/app';
import { TransferTransaction } from '../../../../../models/transfer-transaction';
import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
import { TransactionType } from 'tsjs-xpx-chain-sdk';
import { ProximaxProvider } from '../../../../../providers/proximax/proximax';
import { AppConfig } from '../../../../../app/app.config';
import { TranslateService } from '@ngx-translate/core';

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
    console.log('this.tx', this.tx);
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
      case TransactionType.AGGREGATE_BONDED:
        console.log('ES AGREGADA BONDED', this.tx);
        if (this.tx['innerTransactions'].length === 1) {
          if (this.tx['innerTransactions'][0]["message"] && this.tx['innerTransactions'][0]["message"].payload !== "") {
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
                  /*newTransaction = Object.assign({}, this.tx['innerTransactions'][0]);
                  newTransaction['transactionInfo'] = transaction.transactionInfo;
                  newTransaction['nis1Hash'] = msg['nis1Hash'];
                  // newTransaction['transactionInfo'].hash = transaction.transactionInfo.hash;
                  newTransaction.size = transaction.size;
                  newTransaction.cosignatures = transaction['cosignatures'];
                  if (group && group === 'confirmed') {
                    let walletTransactionsNis = this.walletService.getWalletTransNisStorage().find(el => el.name === this.walletService.getCurrentWallet().name);
                    if (walletTransactionsNis !== undefined && walletTransactionsNis !== null) {
                      const transactions = walletTransactionsNis.transactions.filter(el => el.nis1TransactionHash !== msg["nis1Hash"]);
                      walletTransactionsNis.transactions = transactions;
                      this.walletService.setSwapTransactions$(walletTransactionsNis.transactions);
                      this.walletService.saveAccountWalletTransNisStorage(walletTransactionsNis);
                    }
                  }*/
                }
              }
            } catch (error) {
              console.log(error);
              this.MESSAGE_ = 'Agregada Bonded';
              this.MOSAIC_INFO = null;
              this.AMOUNT = null;
              this.LOGO = App.LOGO.DEFAULT;
              this.showTx = true;
            }
          } else {
            this.MESSAGE_ = 'Agregada Bonded';
            this.MOSAIC_INFO = null;
            this.AMOUNT = null;
            this.LOGO = App.LOGO.DEFAULT;
            this.showTx = true;
          }
        }
        /*if (transaction['innerTransactions'].length === 1) {
          if (transaction['innerTransactions'][0]["message"] && transaction['innerTransactions'][0]["message"].payload !== "") {
            let newTransaction: any = null;
            try {
              const msg = JSON.parse(transaction['innerTransactions'][0]["message"].payload);
              const addressAccountMultisig = environment.swapAccount.addressAccountMultisig;
              const addressAccountSimple = environment.swapAccount.addressAccountSimple;
              const addressSender = transaction['innerTransactions'][0].signer.address.plain();
              if ((addressSender === addressAccountMultisig) || (addressSender === addressAccountSimple)) {
                if (msg && msg["type"] && msg["type"] === "Swap") {
                  nameType = "ProximaX Swap";
                  newTransaction = Object.assign({}, transaction['innerTransactions'][0]);
                  newTransaction['transactionInfo'] = transaction.transactionInfo;
                  newTransaction['nis1Hash'] = msg['nis1Hash'];
                  // newTransaction['transactionInfo'].hash = transaction.transactionInfo.hash;
                  newTransaction.size = transaction.size;
                  newTransaction.cosignatures = transaction['cosignatures'];
                  if (group && group === 'confirmed') {
                    let walletTransactionsNis = this.walletService.getWalletTransNisStorage().find(el => el.name === this.walletService.getCurrentWallet().name);
                    if (walletTransactionsNis !== undefined && walletTransactionsNis !== null) {
                      const transactions = walletTransactionsNis.transactions.filter(el => el.nis1TransactionHash !== msg["nis1Hash"]);
                      walletTransactionsNis.transactions = transactions;
                      this.walletService.setSwapTransactions$(walletTransactionsNis.transactions);
                      this.walletService.saveAccountWalletTransNisStorage(walletTransactionsNis);
                    }
                  }
                }
              }
            } catch (error) { }

            if (newTransaction !== null) {
              isVerified = true;
              transaction = newTransaction;
            }
          };
        }*/

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
