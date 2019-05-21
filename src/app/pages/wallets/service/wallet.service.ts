import { Injectable } from '@angular/core';
import { ProximaxProvider } from '../../../providers/proximax.provider'
import { 
  NetworkType, 
  PublicAccount,
  UInt64,
  TransferTransaction,
  Mosaic,
  MosaicId,
  Account,
  TransactionHttp,
  Deadline,
  PlainMessage,
 } from "tsjs-xpx-catapult-sdk";
import { crypto } from 'js-xpx-catapult-library';
import { environment } from '../../../../environments/environment'
import { NodeService } from '../../../../shared/service/node.service'

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  publicAccount: PublicAccount;
  currentAccount: any;
  network: any = '';
  algo: string;


  constructor(
    private proximaxProvider: ProximaxProvider,
    private nodeService: NodeService,
  ) { }

  getAccountInfo(address) {
    
    const addres = this.proximaxProvider.createFromRawAddress(address);
    // console.log('llegando al service', addres);
    return this.proximaxProvider.getAccountInfo(addres)
  }


  formatterAmount(amount: number, divisibility: number) {
    const amountDivisibility = Number(amount / Math.pow(10, divisibility));
    return (amountDivisibility).toLocaleString('en-us', { minimumFractionDigits: divisibility });
  }

  amountFormatterSimple(amount: Number) {
    const amountDivisibility = Number(amount) / Math.pow(10, 6);
    return (amountDivisibility).toLocaleString('en-us', { minimumFractionDigits: 6 });
    }

decrypt(common: any, account: any = '', algo: any = '', network: any = '') {
  console.log('llega al descrip')
      const acct = account || this.currentAccount;
      const net = network || this.network;
      const alg = algo || this.algo;
      // Try to generate or decrypt key
  
      console.log('llega al descrip', common, acct, alg)
      if (!crypto.passwordToPrivatekey(common, acct, alg)) {
        console.log('paso cripto')
        setTimeout(() => {
          console.log('Error Invalid password')
          // this.sharedService.showError('Error', '¡Invalid password!');
        }, 500);
        return false;
      }
  
      if (common.isHW) {
        return true;
      }
  
      if (!this.isPrivateKeyValid(common.privateKey) || !this.proximaxProvider.checkAddress(common.privateKey, net, acct.address)) {
        setTimeout(() => {
          console.log('Error Invalid password')
          // this.sharedService.showError('Error', '¡Invalid password!');
        }, 500);
        return false;
      }
  
      //Get public account from private key
      this.publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(common.privateKey, net);
      return true;
    }

    isPrivateKeyValid(privateKey: any) {
      if (privateKey.length !== 64 && privateKey.length !== 66) {
        console.error('Private key length must be 64 or 66 characters !');
        return false;
      } else if (!this.isHexadecimal(privateKey)) {
        console.error('Private key must be hexadecimal only !');
        return false;
      } else {
        return true;
      }
    }

    isHexadecimal(str: { match: (arg0: string) => any; }) {
      return str.match('^(0x|0X)?[a-fA-F0-9]+$') !== null;
    }

    buildToSendTransfer(
      common: { password?: any; privateKey?: any },
      recipient: string,
      message: string,
      amount: any,
      network: NetworkType,
      node: string | number[]
    ) {
      const recipientAddress = this.proximaxProvider.createFromRawAddress(recipient);
      const transferTransaction = TransferTransaction.create(Deadline.create(5), recipientAddress,
        [new Mosaic(new MosaicId(node), UInt64.fromUint(Number(amount)))], PlainMessage.create(message), network
      );
      const account = Account.createFromPrivateKey(common.privateKey, network);
      const signedTransaction = account.sign(transferTransaction);
      const transactionHttp = new TransactionHttp(
        environment.protocol + "://" + `${this.nodeService.getNodeSelected()}`
      );
      return {
        signedTransaction: signedTransaction,
        transactionHttp: transactionHttp
      };
    }
}
