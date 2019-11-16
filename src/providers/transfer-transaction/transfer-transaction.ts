import { HelperProvider } from './../helper/helper';
import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { Address, Mosaic, MosaicId, UInt64, PlainMessage, TransferTransaction, Deadline, Account, SignedTransaction, TransactionHttp, TransactionAnnounceResponse } from 'tsjs-xpx-chain-sdk';
import { MosaicModel } from './mosaic.model';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

/*
  Generated class for the TransferTransactionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransferTransactionProvider {
  getFee(): number {
    const tx = this.build();
    console.log("TCL: TransferTransactionProvider -> getFee -> tx", tx);
    return this.helper.getRelativeAmount(tx.maxFee.compact());
  }
  httpNodeUrl: any;

  constructor(
    private storage: Storage,
    private helper: HelperProvider
  ) {
    this.storage.get("node").then(nodeStorage => {
      this.httpNodeUrl = nodeStorage;
    });
  }

  private _address: Address;
  private _message: string;
  private _mosaics: Mosaic[];

  // Recipient
  setRecipient(address: string) {
    this._address = Address.createFromRawAddress(address);
    return this;
  }
  get recipient(): Address {
    return this._address;
  }

  // Message
  setMessage(msg: string) {
    this._message = msg;
    return this;
  }
  get message(): string {
    return this._message;
  }

  // Mosaics
  setMosaics(mosaicHexIds: MosaicModel[]) {
    const mosaics = mosaicHexIds.map(mosaic => {
      const mosaicId = new MosaicId(mosaic.hexId);
      const relativeAmount = mosaic.amount * Math.pow(10, 6);
      const uint64Amount = UInt64.fromUint(relativeAmount);
      return new Mosaic(mosaicId, uint64Amount);
    });
    this._mosaics = mosaics;
    return this;
  }
  get mosaics(): Mosaic[] {
    return this._mosaics || [];
  }

  private buildPlainMessage(): PlainMessage {
    return PlainMessage.create(this._message.toString());
  }

  build(): TransferTransaction {
    const message = this.buildPlainMessage();
    return TransferTransaction.create(Deadline.create(), this.recipient, this.mosaics, message, AppConfig.sirius.networkType);
  }

  send(pk, net): Observable<TransactionAnnounceResponse> {

    return new Observable(observer => {
      // 1. account
      const account = Account.createFromPrivateKey(pk, net);

      // const _account = account;
      // 2. Get transfer transaction
      const transferTransaction = this.build();

      // 3. Sign and announce a transaction
      const signedTxn = account.sign(transferTransaction, AppConfig.sirius.networkGenerationHash);
      console.log('LOG: TransferTransactionProvider -> send -> signedTxn', signedTxn);

      // 4. Monitor transaction status
      this.checkTransaction(signedTxn);

      // 5. Announce transaction
      const transactionHttp = new TransactionHttp(this.httpNodeUrl);
      transactionHttp.announce(signedTxn).subscribe(response => {
        observer.next(response);
      }, (err) => {
        observer.error(err);
      }, () => {
        observer.complete();
      });
    });
  }

  private checkTransaction(txn: SignedTransaction): Promise<boolean> {
    const transactionHttp = new TransactionHttp(this.httpNodeUrl);

    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const status = await transactionHttp.getTransactionStatus(txn.hash).toPromise();
          console.log('TCL: SimpleTransfer -> status, ' + JSON.stringify(status, null, 3));
          if (status.group === 'confirmed') {
            // TODO: notification
            resolve(true);
          } else if (status.group === 'unconfirmed') {
            // TODO: notification
          } else {
            this.checkTransaction(txn);
          }
        } catch (error) {
          console.log(JSON.stringify(error, null, 2));
          this.checkTransaction(txn);
        }
      }, 1000);
    });
  }
}
