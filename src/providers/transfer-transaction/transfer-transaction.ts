import { WalletProvider } from './../wallet/wallet';
import { AppConfig } from './../../app/app.config';
import { Injectable } from '@angular/core';
import { Address, Mosaic, MosaicId, UInt64, PlainMessage, TransferTransaction, Deadline, SimpleWallet, Password, Account, SignedTransaction, TransactionHttp, Message, EmptyMessage, TransactionAnnounceResponse } from 'tsjs-xpx-chain-sdk';
import { MosaicModel } from './mosaic.model';
import { Observable } from 'rxjs';
import { AuthProvider } from '../auth/auth';
import { Storage } from '@ionic/storage';
import { ConfirmedTransactionListener } from 'nem-library';

/*
  Generated class for the TransferTransactionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TransferTransactionProvider {
  httpNodeUrl: any;

  constructor(
    private walletProvider: WalletProvider,
    private authProvider: AuthProvider,
    private storage: Storage,
    ){

      this.storage.get("node").then( nodeStorage=>{
        
          this.httpNodeUrl = nodeStorage ;
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

  send(): Observable<TransactionAnnounceResponse> {

    return new Observable(observer => {
      
    // 1. Get account
    this.getAccount().subscribe(account => {
      const _account = account;
      console.log('LOG: TransferTransactionProvider -> send -> _account', _account);

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
      
    })


    });

    
  }

  private checkTransaction(txn: SignedTransaction): Promise<boolean> {
    const transactionHttp = new TransactionHttp(this.httpNodeUrl);

    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const status = await transactionHttp.getTransactionStatus(txn.hash).toPromise();
          console.log('TCL: SimpleTransfer -> status, ' + status);
          if (status.group === 'confirmed') {
            resolve(true);
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

  private getAccount(): Observable<Account> {
    return new Observable(observer => {

      // Get selected Wallet
      this.walletProvider.getSelectedWallet().then(selectedWallet => {
      console.log('LOG: TransferTransactionProvider -> selectedWallet', selectedWallet);

        const _selectedWallet = selectedWallet;
      
      // Get user's password and unlock the wallet to get the account
      this.authProvider
        .getPassword()
        .then(password => {
        console.log('LOG: TransferTransactionProvider -> password', password);
          // Get user's password
          const myPassword = new Password(password);

          // Convert current wallet to SimpleWallet
          const myWallet = this.walletProvider.convertToSimpleWallet(_selectedWallet);

          // Unlock wallet to get an account using user's password 
          const account = myWallet.open(myPassword);

          observer.next(account);

        });

      })
    });
  }

}
