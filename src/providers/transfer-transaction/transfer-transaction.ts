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
  signedTxn: SignedTransaction;

  httpNodeUrl: any;
  private _address: Address;
  private _message: string;
  private _mosaics: Mosaic[];

  constructor(
    private storage: Storage,
    private helper: HelperProvider
  ) {
    this.getinfo();
  }


  getinfo(){
    this.storage.get('node').then(node => {
      this.httpNodeUrl = node;
    });
  }

  getFee(): number {
    const tx = this.build();
    return this.helper.getRelativeAmount(tx.maxFee.compact());
  }


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

      if (mosaic.amount > 0){
        const mosaicId = new MosaicId(mosaic.hexId);
        const relativeAmount = mosaic.amount * Math.pow(10, 6);
        const uint64Amount = UInt64.fromUint(relativeAmount);
        return new Mosaic(mosaicId, uint64Amount);
      } else {
        return null;
      }

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

  send(privateKey, transferTransaction, networkType): Observable<TransactionAnnounceResponse> {

    console.log('#################### llega');
    return new Observable(observer => {
      // 1. account
      const account = Account.createFromPrivateKey(privateKey, networkType);


      console.log('#################### paso aqii');
      
      // const _account = account;
      // 2. Get transfer transaction
      // const transferTransaction = this.build();

      // 3. Sign and announce a transaction
      const signedTxn = account.sign(transferTransaction, AppConfig.sirius.networkGenerationHash);
      console.log('LOG: TransferTransactionProvider -> send -> signedTxn', signedTxn);
      this.signedTxn = signedTxn;

      // 4. Announce transaction
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

  checkTransaction(txn: SignedTransaction): Observable<any> {
    const transactionHttp = new TransactionHttp(this.httpNodeUrl);
    return new Observable((resolve) => {
      setTimeout(async () => {
        try {
          const status = await transactionHttp.getTransactionStatus(txn.hash).toPromise();
          resolve.next(status);
        } catch (error) {
          resolve.next(error);
          // console.log(JSON.stringify(error, null, 2));
        }
      }, 5000);
    });
  }

  buildTransactionHttp() {
    return  new TransactionHttp(this.httpNodeUrl);;
  }

  buildTransferTransaction(params) {
    const recipientAddress = Address.createFromRawAddress(params.recipient);
    const mosaics = params.mosaic;
    console.log('.mosaicsmosaicsmosaicsmosaics', mosaics);
    
    const allMosaics = [];
    if(mosaics != undefined || mosaics != null){
      mosaics.forEach(element => {
        console.log('element', Number(element.amount.replace(/,/g, '').replace(/./g, '')));
        const convert = new Mosaic(
          new MosaicId([element.id.id['lower'], element.id.id['higher']]),
          UInt64.fromUint(Number(element.amount.toString().replace(/,/g, '').split('.')))
        );
        allMosaics.push(convert)

        console.log('\n\n', convert);
      });
  

      console.log('allMosaics', allMosaics);
      
    }

    const transferTransaction = TransferTransaction.create(
      Deadline.create(), 
      recipientAddress,
      allMosaics,
      params.message,
      params.network
    );

    console.log('transferTransaction', transferTransaction);
    

    // console.log(this.generationHash);
    const account = Account.createFromPrivateKey(
      params.common,
      params.network
    );

    console.log('account',account);
    
    const signedTransaction = account.sign(
      transferTransaction,
      AppConfig.sirius.networkGenerationHash
    );

    console.log('signedTransaction', signedTransaction);
    
    const transactionHttp =  new TransactionHttp(this.httpNodeUrl);
    console.log('transactionHttp', transactionHttp);
    
    return {
      signedTransaction: signedTransaction,
      transactionHttp: transactionHttp,
      transferTransaction: transferTransaction
    };
  }


}
