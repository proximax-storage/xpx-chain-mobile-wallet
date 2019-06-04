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
  TransactionType,
  Deadline,
  PlainMessage,
  Transaction,
} from "tsjs-xpx-catapult-sdk";
import { crypto } from 'js-xpx-catapult-library';
import { environment } from '../../../../environments/environment'
import { NodeService } from '../../../../shared/service/node.service'
import { TransactionsInterface } from '../interfaces/transaction.interface'

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  publicAccount: PublicAccount;

  namespaceRentalFeeSink = environment.namespaceRentalFeeSink;
  mosaicRentalFeeSink = environment.mosaicRentalFeeSink;
  address: any;
  network: any = '';
  current: any;
  style: any;
  nameWallet: any;
  mosaics: any;
  iv: any;
  encrypted: any;
  amount: any;
  algo: string;
  import: any;
  detailTransaction: any;
  wallets: any = [];
  amountw: string;
  mosaicsW: any;
  show: any;

  arraTypeTransaction = {
    transfer: {
      id: TransactionType.TRANSFER,
      name: "Transfer"
    },
    registerNameSpace: {
      id: TransactionType.REGISTER_NAMESPACE,
      name: "Register namespace"
    },
    mosaicDefinition: {
      id: TransactionType.MOSAIC_DEFINITION,
      name: "Mosaic definition"
    },
    mosaicSupplyChange: {
      id: TransactionType.MOSAIC_SUPPLY_CHANGE,
      name: "Mosaic supply change"
    },
    modifyMultisigAccount: {
      id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
      name: "Modify multisig account"
    },
    aggregateComplete: {
      id: TransactionType.AGGREGATE_COMPLETE,
      name: "Aggregate complete"
    },
    aggregateBonded: {
      id: TransactionType.AGGREGATE_BONDED,
      name: "Aggregate bonded"
    },
    mosaicsAlias: {
      id:TransactionType.MOSAIC_ALIAS,
      name: "Mosaics Alias"
    },
    lock: {
      id: TransactionType.LOCK,
      name: "Lock"
    },
    secretLock: {
      id: TransactionType.SECRET_LOCK,
      name: "Secret lock"
    },
    // secretProof: {
    //   id: TransactionType.SECRET_PROOF,
    //   name: "Secret proof"
    // }
  };
  


  constructor(
    private proximaxProvider: ProximaxProvider,
    private nodeService: NodeService,
  ) { 
    this.mosaics = [];
  }

  use(wallet: any, variable: any) {
    console.log('wallet.mosaic', wallet.mosaics)
    if (!wallet) {
      console.log('Error', '¡you can not set anything like the current wallet!');
      return false;
    }
    this.import = variable;
    // Adress and newwork
    this.address = this.proximaxProvider.createFromRawAddress(wallet.address);

    // newwork
    this.network = wallet.network;
    // amount
    this.amount = wallet.amount;
    // encryptedKey
    this.encrypted = wallet.encrypted;
    // iv
    this.iv = wallet.iv;
    // mosaics
    this.mosaics = wallet.mosaics;
    // nameWallet
    this.nameWallet = wallet.name;
    // style
    this.style = wallet.style
    // algo
    this.algo = wallet.algo;
    // wallet data
    this.current = wallet;
    return true;
  }

  // mosaicsFormWallet(mosaics: any, show: any) {
  // // Mosaics of an address already with formats.
  // this.mosaicsW = mosaics;
  // this.show = show;
  // }

  transactionDetail(transaction: any) {
    this.detailTransaction = transaction;
  }

  getAccountInfo(address) {
    const addres = this.proximaxProvider.createFromRawAddress(address);
    return this.proximaxProvider.getAccountInfo(addres)
  }

  createAccountFromPrivateKey(img, name, password, privateKey, network) {
    const account = this.proximaxProvider.createAccountFromPrivateKey(name, password, privateKey, network);
    const ImportWallet = {
      name: account.name,
      schema: account.schema,
      style: img,
      address: account.address['address'],
      algo: 'pass:bip32',
      encrypted: account.encryptedPrivateKey['encryptedKey'],
      iv: account.encryptedPrivateKey['iv'],
      network: account.network
    };
    return ImportWallet;
  }

  createSimpleWallet(img, name, password, network) {
    const walletSimple = this.proximaxProvider.createSimpleWallet(name, password, network);
    const SimpleWallet = {
      name: walletSimple.name,
      schema: walletSimple.schema,
      style: img,
      address: walletSimple.address['address'],
      algo: 'pass:bip32',
      encrypted: walletSimple.encryptedPrivateKey['encryptedKey'],
      iv: walletSimple.encryptedPrivateKey['iv'],
      network: walletSimple.network
    };
    return SimpleWallet;
  }

  getPublicAccountFromPrivateKey(privatekey, network) {
    const AccountFromPrivateKey = this.proximaxProvider.getPublicAccountFromPrivateKey(privatekey, network)
    return AccountFromPrivateKey;
  }

  getAllTransactionsFromAccount(publicAccount): Observable<Transaction[]> {
    const transaction = this.proximaxProvider.getAllTransactionsFromAccount(publicAccount)
    return transaction;
  }
  formatterAmount(amount: number, divisibility: number) {
    const amountDivisibility = Number(amount / Math.pow(10, divisibility));
    return (amountDivisibility).toLocaleString('en-us', { minimumFractionDigits: divisibility });
  }

  amountFormatterSimple(amount: Number) {
    const amountDivisibility = Number(amount) / Math.pow(10, 6);
    return (amountDivisibility).toLocaleString('en-us', { minimumFractionDigits: 6 });
  }


  buidTansaction(transaction: Transaction): TransactionsInterface {
    const keyType = Object.keys(this.arraTypeTransaction).find(elm => this.arraTypeTransaction[elm].id === transaction.type);
    let recipientRentalFeeSink = '';
    if (transaction["mosaics"] !== undefined) {
    } else {
      if (transaction.type === this.arraTypeTransaction.registerNameSpace.id) {
        recipientRentalFeeSink = this.namespaceRentalFeeSink.address_public_test;
      } else if (
        transaction.type === this.arraTypeTransaction.mosaicDefinition.id ||
        transaction.type === this.arraTypeTransaction.mosaicSupplyChange.id
      ) {
        recipientRentalFeeSink = this.mosaicRentalFeeSink.address_public_test;
      } else {
        recipientRentalFeeSink = "XXXXX-XXXXX-XXXXXX";
      }
    }
    return {
      data: transaction,
      nameType: this.arraTypeTransaction[keyType].name,
      timestamp: this.dateFormat(transaction.deadline),
      fee: this.amountFormatterSimple(transaction.maxFee.compact()),
      sender: transaction.signer,
      recipientRentalFeeSink: recipientRentalFeeSink,
      recipient: (transaction['recipient'] !== undefined) ? transaction['recipient'] : null,
      isRemitent: (transaction['recipient'] !== undefined) ? this.address.pretty() === transaction["recipient"].pretty() : false
    }
  }

  dateFormat(deadline: Deadline) {
    return new Date(
      deadline.value.toString() + Deadline.timestampNemesisBlock * 1000
    ).toUTCString();
  }

  walletFormatList(arr) {
    this.wallets = [];
    arr.forEach(element => {
      const myAddress = element.address;
      this.getAccountInfo(myAddress).pipe(first()).subscribe(
        next => {
          const mosai = next['mosaics'];
          console.log('mosaibcos .....', mosai.length )
          if(mosai.length > 0) {
            this.amountw = ''
          }
          for (const m in mosai) {
            console.log('m .....1', mosai[m].id.toHex())
            
            if (mosai[m].id.toHex() === '0dc67fbe1cad29e3') {
              console.log('m ....2.', mosai[m].id.toHex())
              const valor = mosai[m].amount.compact()
              this.amountw = this.amountFormatterSimple(valor);
              console.log(`amount.`, this.amountw);
            }
          }
          
          const valores = {
            style: element.style,
            name: element.name,
            address: next['address']['address'],
            algo: element.algo,
            network: next['address']['networkType'],
            amount: this.amountw,
            mosaics: next['mosaics'],
            encrypted: element.encrypted,
            iv: element.iv
          };
          this.wallets.push(valores);
          console.log('this.wallets', this.wallets)
        }, error => {
          const valores = {
            style: element.style,
            name: element.name,
            schema: element.schema,
            address: element.address,
            algo: element.algo,
            encrypted: element.encrypted,
            iv: element.iv,
            network: element.network
          };
          this.wallets.push(valores);
          console.log('te dio un error,  posibles causas !', this.wallets);
        }
      );
      return this.wallets;
    });
  }

  getMosaicNames(mosaicId) {
    const mosaicIds = this.proximaxProvider.getMosaicNames(mosaicId);
    return mosaicIds;

  }
  decrypt(common: any, account: any = '', algo: any = '', network: any = '') {
    const acct = account || this.current;
    const net = network || this.network;
    const alg = algo || this.algo;
    // Try to generate or decrypt key

    if (!crypto.passwordToPrivatekey(common, acct, alg)) {
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

  formatNumberMilesThousands(numero: number) {
    return numero
      .toString()
      .replace(
        /((?!^)|(?:^|.*?[^\d.,])\d{1,3})(\d{3})(?=(?:\d{3})*(?!\d))/gy,
        "$1,$2"
      );
  }

  buildToSendTransfer(
    common: { password?: any; privateKey?: any },
    recipient: string,
    message: string,
    amount: any,
    network: NetworkType,
    mosaic: string | number[]
  ) {
    const recipientAddress = this.proximaxProvider.createFromRawAddress(recipient);
    const transferTransaction = TransferTransaction.create(Deadline.create(5), recipientAddress,
      [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(Number(amount)))], PlainMessage.create(message), network
    );
    const account = Account.createFromPrivateKey(common.privateKey, network);
    const signedTransaction = account.sign(transferTransaction)
    const transactionHttp = new TransactionHttp(
      environment.protocol + "://" + `${this.nodeService.getNodeSelected()}`
    );
    return {
      signedTransaction: signedTransaction,
      transactionHttp: this.proximaxProvider.transactionHttp
    };
  }
}
