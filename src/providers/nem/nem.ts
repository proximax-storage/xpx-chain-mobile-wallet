import { Injectable } from '@angular/core';
import { Block } from 'nem-library';
import { Observable } from 'rxjs';
import {
  Account,
  AccountHttp,
  Address,
  Mosaic,
  MosaicHttp,
  MosaicId,
  NamespaceHttp,
  NetworkHttp,
  NetworkType,
  Password,
  SimpleWallet,
  Transaction,
  TransactionHttp,
  TransferTransaction,
  AccountInfo,
  MultisigAccountInfo,
} from 'tsjs-xpx-chain-sdk';
import { MetadataHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/MetadataHttp';

import { AppConfig } from '../../app/app.config';

/*
 Generated class for the NemProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class NemProvider{
  networkType: NetworkType;
  wsNodeUrl: string;
  httpUrl: string;
  accountHttp: AccountHttp;
  transactionHttp: TransactionHttp;
  namespaceHttp: NamespaceHttp;
  mosaicHttp: MosaicHttp;
  networkHttp: NetworkHttp;
  metadataHttp: MetadataHttp;

  constructor() {
    this.networkType = NetworkType[AppConfig.sirius.networkType];
    this.httpUrl = AppConfig.sirius.httpNodeUrl;
    this.wsNodeUrl = AppConfig.sirius.wsNodeUrl;
    this.networkHttp = new NetworkHttp(this.httpUrl);
    this.accountHttp = new AccountHttp(this.httpUrl, null);
    this.transactionHttp = new TransactionHttp(this.httpUrl);
    this.namespaceHttp = new NamespaceHttp(this.httpUrl, null);
    this.mosaicHttp = new MosaicHttp(this.httpUrl, null);
    this.metadataHttp = new MetadataHttp(this.httpUrl, null);
  }

  /**
   * Change the network either TESTNET or MAINNET
   * @param network The network type to set: NetworkTypes.TEST_NET || NetworkTypes.MAIN_NET
   */
  changeNetwork(network = NetworkType.MAIN_NET) { // Todo: Change to MAIN_NET for production
  console.log("LOG: NemProvider -> changeNetwork -> changeNetwork");
  }



  /**
   * Create Wallet from private key
   * @param walletName wallet idenitifier for app
   * @param password wallet's password
   * @param privateKey account privateKey
   * @param selected network
   * * @return Promise with wallet created
   */
  public createPrivateKeyWallet(
    walletName,
    password,
    privateKey
  ): SimpleWallet {
    return;
  }

  /**
   * Check if Address it is correct
   * @param privateKey privateKey
   * @param address address
   * @return checkAddress
   */

  public checkAddress(privateKey: string, address: Address): boolean {
    return;
  }

  /**
   * Get the account info of the NEM address
   * @param address The NEM address
   * @return {AccountInfoWithMetaData}
   */
  public getAccountInfo(address: Address): Observable<AccountInfo> {
    return this.accountHttp.getAccountInfo(address);
  }

  public getMultisigAccountInfo(address: Address): Observable<MultisigAccountInfo> {
    return this.accountHttp.getMultisigAccountInfo(address);
  }

  /**
   * Get the namespaces owned by the NEM address
   * @param address The NEM address
   * @return {Namespace[]}
   */
  public getNamespacesOwned(address: Address): Observable<any[]> {
    return;
  }

  /**
   * Get the mosaics owned by thee NEM address
   * @param address The NEM address
   * @return {MosaicDefinition[]}
   */
  public getMosaicsOwned(address: Address): Observable<any[]> {
    return;
  }

  /**
   * Gets private key from password and account
   * @param password
   * @param wallet
   * @return promise with selected wallet
   */
  public passwordToPrivateKey(password: string, wallet: SimpleWallet): Account {
    return wallet.open((new Password(password)));
  }

  /**
   * Decrypt private key
   * @param password password
   * @param encriptedData Object containing private_key encrypted and salt
   * @return Decrypted private key
   */

  public decryptPrivateKey(
    password: string,
    encriptedData: any
  ): string {
    return;
  }

  /**
   * Generate Address QR Text
   * @param address address
   * @return Address QR Text
   */
  public generateInvoiceQRText(
    address: Address,
    amount: number,
    message: string
  ): string {

   
    return;
  }

  /**
   * Get mosaics form an account
   * @param address address to check balance
   * @return Promise with mosaics information
   */
  public getBalance(address: Address): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // this.nodeHttp.getActiveNodes().subscribe(nodes => {
      //   resolve(nodes);
      // });
    })
  }

  /**
   * Get mosaics from a namespace
   * @param namespace namespace to get the mosaics
   * @return Promise with mosaics from a given namespace
   */
  public getMosaics(namespace: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // this.nodeHttp.getActiveNodes().subscribe(nodes => {
      //   resolve(nodes);
      // });
    })
  }

  /**
   * Formats levy given mosaic object
   * @param mosaic mosaic object
   * @return Promise with levy fee formated
   */
  public formatLevy(mosaic: any): Promise<any> {
    return new Promise((resolve, reject) => {
    })
  }

  /**
   * Check if acount belongs it is valid, has 40 characters and belongs to network
   * @param address address to check
   * @return Return prepared transaction
   */
  public isValidAddress(address: Address): boolean {
    return false;
  }

  /**
   * Prepares xem transaction
   * @param recipientAddress recipientAddress
   * @param amount amount
   * @param message message
   * @return Return transfer transaction
   */
  public prepareTransaction(
    recipientAddress: Address,
    amount: number,
    message: string
  ): TransferTransaction {
    return;
  }

  /**
   * Prepares mosaic transaction
   * @param recipientAddress recipientAddress
   * @param mosaicsTransferable mosaicsTransferable
   * @param message message
   * @return Promise containing prepared transaction
   */
  public prepareMosaicTransaction(
    recipientAddress: Address,
    mosaicsTransferable: any[],
    message: string
  ): TransferTransaction {
    return 
    // TransferTransaction.createWithMosaics(
    //   TimeWindow.createWithDeadline(),
    //   recipientAddress,
    //   mosaicsTransferable,
    //   PlainMessage.create(message)
    // );
  }

  /**
   * Prepares provision namespace transaction
   * @param recipientAddress recipientAddress
   * @param mosaicsTransferable mosaicsTransferable
   * @param message message
   * @return Promise containing prepared transaction
   */
  public prepareNamespaceTransaction(
    namespace: string
  ): any {
    return;
    // ProvisionNamespaceTransaction.create(
    //   TimeWindow.createWithDeadline(),
    //   namespace
    // );
  }

  /**
   * Prepares provision namespace transaction
   * @param recipientAddress recipientAddress
   * @param mosaicsTransferable mosaicsTransferable
   * @param message message
   * @return Promise containing prepared transaction
   */
  public prepareSubNamespaceTransaction(
    subNamespace: string,
    parentNamespace: string
  ): any {
    return;
    // ProvisionNamespaceTransaction.create(
    //   TimeWindow.createWithDeadline(),
    //   subNamespace,
    //   parentNamespace
    // );
  }

  /**
   * Prepares mosaic definition creation transaction
   * @param account { AccountInfoWithMetaData }
   * @param namespace { Namespace }
   * @param mosaic { string }
   * @param description { string }
   * @param divisibility { number }
   * @param supply { number }
   * @param transferrable { boolean }
   * @param supplyMutable { boolean }
   * @param hasLevy { boolean }
   * @param levyMosaic { MosaicId }
   * @param levyFee { number }
   */
  public prepareMosaicCreationTransaction(
    account: any,
    namespace: string,
    mosaic: string,
    description: string,
    divisibility: number,
    supply: number,
    transferrable: boolean,
    supplyMutable: boolean,
    hasLevy?: boolean,
    levyMosaic?: MosaicId,
    levyFee?: number
  ): any {
    // let tx: MosaicDefinitionCreationTransaction;

    // if (!hasLevy) {
    //   tx = MosaicDefinitionCreationTransaction.create(
    //     TimeWindow.createWithDeadline(),
    //     new MosaicDefinition(
    //       PublicAccount.createWithPublicKey(account.publicAccount.publicKey),
    //       new MosaicId(namespace, mosaic),
    //       description,
    //       new MosaicProperties(
    //         divisibility,
    //         supply,
    //         transferrable,
    //         supplyMutable
    //       ),
    //       null
    //     )
    //   );
    // } else {
    //   tx = MosaicDefinitionCreationTransaction.create(
    //     TimeWindow.createWithDeadline(),
    //     new MosaicDefinition(
    //       PublicAccount.createWithPublicKey(account.publicAccount.publicKey),
    //       new MosaicId(namespace, mosaic),
    //       description,
    //       new MosaicProperties(
    //         divisibility,
    //         supply,
    //         transferrable,
    //         supplyMutable
    //       ),
    //       new MosaicLevy(
    //         MosaicLevyType.Percentil,
    //         account.publicAccount.address,
    //         levyMosaic,
    //         levyFee
    //       )
    //     )
    //   );
    // }

    return;
  }

  /**
   * Send transaction into the blockchain
   * @param transferTransaction transferTransaction
   * @param wallet wallet
   * @param password password
   * @return Promise containing sent transaction
   */
  public confirmTransaction(
    transaction: any,
    wallet: SimpleWallet,
    password: string
  ): Observable<any> {
    // let account = wallet.open(new Password(password));
    // let signedTransaction = account.signTransaction(transaction);
    //  this.transactionHttp.announceTransaction(signedTransaction);
     return
  }

  /**
  * Send multisig transaction into the blockchain
  * @param transferTransaction transferTransaction
  * @param publickKey string
  * @param wallet wallet
  * @param password password
  * @return Promise containing sent transaction
  */
  public confirmMultisigTransaction(
    transaction: any,
    publickKey: string,
    wallet: SimpleWallet,
    password: string
  ): Observable<any> {
    // const multisigAccountPublicKey: string = publickKey;

    // const multisigTransaction: MultisigTransaction = MultisigTransaction.create(
    //   TimeWindow.createWithDeadline(),
    //   transaction,
    //   PublicAccount.createWithPublicKey(multisigAccountPublicKey)
    // );

    // let account = wallet.open(new Password(password));
    // let signedTransaction = account.signTransaction(multisigTransaction);
    //  this.transactionHttp.announceTransaction(signedTransaction);+
     return;
  }

  /**
 * Sign multisig transaction into the blockchain
 * @param address address
 * @param hash hash
 * @param wallet wallet
 * @param password password
 * @return Promise containing sent transaction
 */
  public signMultisigTransaction(
    address: Address,
    hash: any,
    wallet: SimpleWallet,
    password: string
  ): Observable<any> {
    return;
    // const multisigTransaction: MultisigSignatureTransaction = MultisigSignatureTransaction.create(
    //   TimeWindow.createWithDeadline(),
    //   address,
    //   hash
    // )

    // let account = wallet.open(new Password(password));
    // let signedTransaction = account.signTransaction(multisigTransaction);
    // return this.transactionHttp.announceTransaction(signedTransaction);
  }

  /**
   * Adds to a transaction data mosaic definitions
   * @param mosaics array of mosaics
   * @return Promise with altered transaction
   */
  public getMosaicsDefinition(
    mosaics: Mosaic[]
  ): Observable<any> {
    return;
    // Observable.from(mosaics)
    //   .flatMap((mosaic: Mosaic) => {
    //     if (XEM.MOSAICID.equals(mosaic.mosaicId))
    //       return Observable.of(
    //         new XEM(mosaic.quantity / Math.pow(10, XEM.DIVISIBILITY))
    //       );
    //     else {
    //       return this.mosaicHttp
    //         .getMosaicDefinition(mosaic.mosaicId)
    //         .map(mosaicDefinition => {
    //           return MosaicTransferable.createWithMosaicDefinition(
    //             mosaicDefinition,
    //             mosaic.quantity /
    //             Math.pow(10, mosaicDefinition.properties.divisibility)
    //           );
    //         });
    //     }
    //   })
    //   .toArray();
  }

  
  /**
   * Get all confirmed transactions of an account
   * @param address account Address
   * @return Promise with account transactions
   */
  public getAllTransactions(address: Address): Observable<Transaction[]> {
    return;
    //  this.accountHttp.allTransactions(address, {
    //   pageSize: 100
    // });
  }
  
  public getMosaicTransactions(address: Address) : Observable<any[]> {
    return
    /*  new Observable(observer => {
        this.accountHttp.allTransactions(address, {
          pageSize: 100
        }).subscribe(transactions=> {
            let mosaicTransactions =  transactions.filter(tx=> (tx as any)._mosaics !== undefined &&  (tx as any)._mosaics[0].mosaicId.name != 'xem');
            observer.next(mosaicTransactions);
            //call complete if you want to close this stream (like a promise)
            observer.complete();
        })
    }); */
  }

  public getXEMTransactions(address: Address) : Observable<Transaction[]> {
    return
    //  new Observable(observer => {
    //     this.accountHttp.allTransactions(address, {
    //       pageSize: 100
    //     }).subscribe(transactions=> {
		// 				console.log("LOG: NemProvider -> transactions", transactions);
    //         let mosaicTransactions =  transactions.filter(tx=> (tx as any)._mosaics === undefined || (tx as any)._mosaics[0].mosaicId.name == 'xem');
    //         observer.next(mosaicTransactions);
    //         //call complete if you want to close this stream (like a promise)
    //         observer.complete();
    //     })
    // });
  }

  // TODO: Page size
  /**
   * Get all confirmed transactions of an account paginated
   * @param address account Address
   * @return Promise with account transactions
   */
  public getAllTransactionsPaginated(
    address: Address
  ): any {
    return;
    // this.accountHttp.allTransactionsPaginated(address, {
    //   pageSize: 100
    // });
  }

  /**
   * Get all unconfirmed transactions of an account
   * @param address account Address
   * @return Promise with account transactions
   */
  public getUnconfirmedTransactions(
    address: Address
  ): Observable<Transaction[]> {
    // return this.accountHttp.unconfirmedTransactions(address);
    return;
  }

  public getBlockHeight(): Promise<Block> {
    return new Promise((resolve, reject) => {
      // this.chainHttp.getBlockchainLastBlock().subscribe(block => {
      //   resolve(block);
      // });
    })
  }

  public getActiveNodes(): Promise<Array<Node>> {
    return new Promise((resolve, reject) => {
      // this.nodeHttp.getActiveNodes().subscribe(nodes => {
      //   resolve(nodes);
      // });
    })


  }

  public getActiveNode(): Promise<Node> {
    return new Promise((resolve, reject) => {
      // this.nodeHttp.getNodeInfo().subscribe(node => {
      //   resolve(node);
      // });

    })
  }


}
