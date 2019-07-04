import { Injectable, OnInit } from "@angular/core";

import {
  NEMLibrary,
  NetworkTypes,
  SimpleWallet,
  Password,
  Address,
  Account,
  AccountHttp,
  MosaicHttp,
  AccountOwnedMosaicsService,
  MosaicTransferable,
  TransferTransaction,
  TimeWindow,
  XEM,
  PlainMessage,
  TransactionHttp,
  NemAnnounceResult,
  Transaction,
  Mosaic,
  MosaicService,
  QRService,
  QRWalletText,
  MosaicDefinition,
  ServerConfig,
  ProvisionNamespaceTransaction,
  Pageable,
  AccountInfoWithMetaData,
  Namespace,
  MosaicDefinitionCreationTransaction,
  PublicAccount,
  MosaicId,
  MosaicProperties,
  MosaicLevy,
  MosaicLevyType,
  MultisigTransaction,
  MultisigSignatureTransaction,
  HashData,
  ChainHttp,
  Block,
  NodeHttp,
  Node
} from "nem-library";

import { Observable } from "nem-library/node_modules/rxjs";
import { Storage } from "@ionic/storage";


// export const SERVER_CONFIG: ServerConfig[] = [
//   // { protocol: "http", domain: "35.229.200.77", port: 7890 },
//   // { protocol: "http", domain: "104.128.226.60", port: 7890 },
//   { protocol: "http", domain: "23.228.67.85", port: 7890 },
//   // { protocol: "http", domain: "192.3.61.243", port: 7890 },
//   // { protocol: "http", domain: "50.3.87.123", port: 7890 },


// ];

/*
 Generated class for the NemProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class NemProvider{
  wallets: SimpleWallet[];
  accountHttp: AccountHttp;
  mosaicHttp: MosaicHttp;
  transactionHttp: TransactionHttp;
  qrService: QRService;
  accountOwnedMosaicsService: AccountOwnedMosaicsService;
  chainHttp: ChainHttp;
  nodeHttp: NodeHttp;


  constructor(private storage: Storage) {
    this.storage.get("node").then(node => {
      console.log("LOG: NemProvider -> constructor -> node", node);

      let serverConfig: ServerConfig[];
      if (node) {
        serverConfig = [JSON.parse(node) as ServerConfig]
      } else {
        // serverConfig = { protocol: "http", domain: "23.228.67.85", port: 7890 } as ServerConfig; // Test net
        serverConfig = [
          {protocol: "http", domain:"104.238.161.61", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"199.217.118.114", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"62.75.171.41", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"62.75.251.134", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"62.75.163.236", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"209.126.98.204", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"108.61.182.27", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"108.61.168.86", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"176.9.20.180", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"88.99.192.82", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"167.86.96.227", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"167.86.95.115", port: 7890 } as ServerConfig,
          {protocol: "http", domain:"167.86.96.231", port: 7890 } as ServerConfig,
         ]; // Main net - Hi I am Huge Alice 3
      }

      console.log("LOG: NemProvider -> constructor -> serverConfig", serverConfig);

      const SERVER_CONFIG: ServerConfig[] = serverConfig
      console.log("LOG: NemProvider -> constructor -> SERVER_CONFIG", SERVER_CONFIG);


      NEMLibrary.bootstrap(NetworkTypes.MAIN_NET); // TEST_NET Note: Change to MAIN_NET for production

      if (NEMLibrary.getNetworkType() === NetworkTypes.MAIN_NET) {
        this.accountHttp = new AccountHttp(SERVER_CONFIG);
        this.mosaicHttp = new MosaicHttp(SERVER_CONFIG);
        this.transactionHttp = new TransactionHttp(SERVER_CONFIG);
        this.chainHttp = new ChainHttp(SERVER_CONFIG);
        this.nodeHttp = new NodeHttp(SERVER_CONFIG);
      } else {
        this.accountHttp = new AccountHttp(SERVER_CONFIG);
        this.mosaicHttp = new MosaicHttp(SERVER_CONFIG);
        this.transactionHttp = new TransactionHttp(SERVER_CONFIG);
        this.chainHttp = new ChainHttp(SERVER_CONFIG);
        this.nodeHttp = new NodeHttp(SERVER_CONFIG);
      }

      this.qrService = new QRService();
      this.accountOwnedMosaicsService = new AccountOwnedMosaicsService(
        this.accountHttp,
        this.mosaicHttp
      );
    })
  }

  /**
   * Change the network either TESTNET or MAINNET
   * @param network The network type to set: NetworkTypes.TEST_NET || NetworkTypes.MAIN_NET
   */
  changeNetwork(network = NetworkTypes.MAIN_NET) { // Todo: Change to MAIN_NET for production
    NEMLibrary.reset();
    NEMLibrary.bootstrap(network);
    console.log(NEMLibrary.getNetworkType());
  }

  /**
   * Create Simple Wallet
   * @param walletName wallet idenitifier for app
   * @param password wallet's password
   * @param selected network
   * @return Promise with wallet created
   */
  public createSimpleWallet(
    walletName: string,
    password: string
  ): SimpleWallet {
    return SimpleWallet.create(walletName, new Password(password));
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
    return SimpleWallet.createWithPrivateKey(
      walletName,
      new Password(password),
      privateKey
    );
  }

  /**
   * Check if Address it is correct
   * @param privateKey privateKey
   * @param address address
   * @return checkAddress
   */

  public checkAddress(privateKey: string, address: Address): boolean {
    return (
      Account.createWithPrivateKey(privateKey).address.plain() ==
      address.plain()
    );
  }

  /**
   * Get the account info of the NEM address
   * @param address The NEM address
   * @return {AccountInfoWithMetaData}
   */
  public getAccountInfo(address: Address): Observable<AccountInfoWithMetaData> {
    return this.accountHttp.getFromAddress(address);
  }

  /**
   * Get the namespaces owned by the NEM address
   * @param address The NEM address
   * @return {Namespace[]}
   */
  public getNamespacesOwned(address: Address): Observable<Namespace[]> {
    return this.accountHttp.getNamespaceOwnedByAddress(address);
  }

  /**
   * Get the mosaics owned by thee NEM address
   * @param address The NEM address
   * @return {MosaicDefinition[]}
   */
  public getMosaicsOwned(address: Address): Observable<MosaicDefinition[]> {
    return this.accountHttp.getMosaicCreatedByAddress(address);
  }

  /**
   * Gets private key from password and account
   * @param password
   * @param wallet
   * @return promise with selected wallet
   */
  public passwordToPrivateKey(password: string, wallet: SimpleWallet): string {
    return wallet.unlockPrivateKey(new Password(password));
  }

  /**
   * Decrypt private key
   * @param password password
   * @param encriptedData Object containing private_key encrypted and salt
   * @return Decrypted private key
   */

  public decryptPrivateKey(
    password: string,
    encriptedData: QRWalletText
  ): string {
    return this.qrService.decryptWalletQRText(
      new Password(password),
      encriptedData
    );
  }

  /**
   * Generate Address QR Text
   * @param address address
   * @return Address QR Text
   */
  public generateWalletQRText(password: string, wallet: SimpleWallet): string {
    const PASSWORD = new Password(password);
    return this.qrService.generateWalletQRText(PASSWORD, wallet);
  }

  /**
   * Generate Address QR Text
   * @param address address
   * @return Address QR Text
   */
  public generateAddressQRText(address: Address): string {
    return this.qrService.generateAddressQRText(address);
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
    return this.qrService.generateTransactionQRText(address, amount, message);
  }

  /**
   * Get mosaics form an account
   * @param address address to check balance
   * @return Promise with mosaics information
   */
  public getBalance(address: Address): Promise<MosaicTransferable[]> {
    return this.accountOwnedMosaicsService.fromAddress(address).toPromise();
  }

  /**
   * Get mosaics from a namespace
   * @param namespace namespace to get the mosaics
   * @return Promise with mosaics from a given namespace
   */
  public getMosaics(namespace: string): Promise<MosaicDefinition[]> {
    return this.mosaicHttp.getAllMosaicsGivenNamespace(namespace).toPromise();
  }

  /**
   * Formats levy given mosaic object
   * @param mosaic mosaic object
   * @return Promise with levy fee formated
   */
  public formatLevy(mosaic: MosaicTransferable): Promise<number> {
    let mosaicService = new MosaicService(new MosaicHttp());
    return mosaicService.calculateLevy(mosaic).toPromise();
  }

  /**
   * Check if acount belongs it is valid, has 40 characters and belongs to network
   * @param address address to check
   * @return Return prepared transaction
   */
  public isValidAddress(address: Address): boolean {
    // Reset recipient data
    let success = true;
    // From documentation: Addresses have always a length of 40 characters.
    if (!address || address.plain().length != 40) success = false;

    //if raw data, clean address and check if it is from network
    if (address.network() != NEMLibrary.getNetworkType()) success = false;
    return success;
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
    return TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      recipientAddress,
      new XEM(amount),
      PlainMessage.create(message)
    );
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
    mosaicsTransferable: MosaicTransferable[],
    message: string
  ): TransferTransaction {
    return TransferTransaction.createWithMosaics(
      TimeWindow.createWithDeadline(),
      recipientAddress,
      mosaicsTransferable,
      PlainMessage.create(message)
    );
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
  ): ProvisionNamespaceTransaction {
    return ProvisionNamespaceTransaction.create(
      TimeWindow.createWithDeadline(),
      namespace
    );
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
  ): ProvisionNamespaceTransaction {
    return ProvisionNamespaceTransaction.create(
      TimeWindow.createWithDeadline(),
      subNamespace,
      parentNamespace
    );
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
    account: AccountInfoWithMetaData,
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
  ): MosaicDefinitionCreationTransaction {
    let tx: MosaicDefinitionCreationTransaction;

    if (!hasLevy) {
      tx = MosaicDefinitionCreationTransaction.create(
        TimeWindow.createWithDeadline(),
        new MosaicDefinition(
          PublicAccount.createWithPublicKey(account.publicAccount.publicKey),
          new MosaicId(namespace, mosaic),
          description,
          new MosaicProperties(
            divisibility,
            supply,
            transferrable,
            supplyMutable
          ),
          null
        )
      );
    } else {
      tx = MosaicDefinitionCreationTransaction.create(
        TimeWindow.createWithDeadline(),
        new MosaicDefinition(
          PublicAccount.createWithPublicKey(account.publicAccount.publicKey),
          new MosaicId(namespace, mosaic),
          description,
          new MosaicProperties(
            divisibility,
            supply,
            transferrable,
            supplyMutable
          ),
          new MosaicLevy(
            MosaicLevyType.Percentil,
            account.publicAccount.address,
            levyMosaic,
            levyFee
          )
        )
      );
    }

    return tx;
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
  ): Observable<NemAnnounceResult> {
    let account = wallet.open(new Password(password));
    let signedTransaction = account.signTransaction(transaction);
    return this.transactionHttp.announceTransaction(signedTransaction);
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
  ): Observable<NemAnnounceResult> {
    const multisigAccountPublicKey: string = publickKey;

    const multisigTransaction: MultisigTransaction = MultisigTransaction.create(
      TimeWindow.createWithDeadline(),
      transaction,
      PublicAccount.createWithPublicKey(multisigAccountPublicKey)
    );

    let account = wallet.open(new Password(password));
    let signedTransaction = account.signTransaction(multisigTransaction);
    return this.transactionHttp.announceTransaction(signedTransaction);
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
    hash: HashData,
    wallet: SimpleWallet,
    password: string
  ): Observable<NemAnnounceResult> {

    const multisigTransaction: MultisigSignatureTransaction = MultisigSignatureTransaction.create(
      TimeWindow.createWithDeadline(),
      address,
      hash
    )

    let account = wallet.open(new Password(password));
    let signedTransaction = account.signTransaction(multisigTransaction);
    return this.transactionHttp.announceTransaction(signedTransaction);
  }

  /**
   * Adds to a transaction data mosaic definitions
   * @param mosaics array of mosaics
   * @return Promise with altered transaction
   */
  public getMosaicsDefinition(
    mosaics: Mosaic[]
  ): Observable<MosaicTransferable[]> {
    return Observable.from(mosaics)
      .flatMap((mosaic: Mosaic) => {
        if (XEM.MOSAICID.equals(mosaic.mosaicId))
          return Observable.of(
            new XEM(mosaic.quantity / Math.pow(10, XEM.DIVISIBILITY))
          );
        else {
          return this.mosaicHttp
            .getMosaicDefinition(mosaic.mosaicId)
            .map(mosaicDefinition => {
              return MosaicTransferable.createWithMosaicDefinition(
                mosaicDefinition,
                mosaic.quantity /
                Math.pow(10, mosaicDefinition.properties.divisibility)
              );
            });
        }
      })
      .toArray();
  }

  
  /**
   * Get all confirmed transactions of an account
   * @param address account Address
   * @return Promise with account transactions
   */
  public getAllTransactions(address: Address): Observable<Transaction[]> {
    return this.accountHttp.allTransactions(address, {
      pageSize: 100
    });
  }
  
  public getMosaicTransactions(address: Address) : Observable<any[]> {
    return new Observable(observer => {
        this.accountHttp.allTransactions(address, {
          pageSize: 100
        }).subscribe(transactions=> {
            let mosaicTransactions =  transactions.filter(tx=> (tx as any)._mosaics !== undefined &&  (tx as any)._mosaics[0].mosaicId.name != 'xem');
            observer.next(mosaicTransactions);
            //call complete if you want to close this stream (like a promise)
            observer.complete();
        })
    });
  }

  public getXEMTransactions(address: Address) : Observable<Transaction[]> {
    return new Observable(observer => {
        this.accountHttp.allTransactions(address, {
          pageSize: 100
        }).subscribe(transactions=> {
						console.log("LOG: NemProvider -> transactions", transactions);
            let mosaicTransactions =  transactions.filter(tx=> (tx as any)._mosaics === undefined || (tx as any)._mosaics[0].mosaicId.name == 'xem');
            observer.next(mosaicTransactions);
            //call complete if you want to close this stream (like a promise)
            observer.complete();
        })
    });
  }

  // TODO: Page size
  /**
   * Get all confirmed transactions of an account paginated
   * @param address account Address
   * @return Promise with account transactions
   */
  public getAllTransactionsPaginated(
    address: Address
  ): Pageable<Transaction[]> {
    return this.accountHttp.allTransactionsPaginated(address, {
      pageSize: 100
    });
  }

  /**
   * Get all unconfirmed transactions of an account
   * @param address account Address
   * @return Promise with account transactions
   */
  public getUnconfirmedTransactions(
    address: Address
  ): Observable<Transaction[]> {
    return this.accountHttp.unconfirmedTransactions(address);
  }

  public getBlockHeight(): Promise<Block> {
    return new Promise((resolve, reject) => {
      this.chainHttp.getBlockchainLastBlock().subscribe(block => {
        resolve(block);
      });
    })
  }

  public getActiveNodes(): Promise<Array<Node>> {
    return new Promise((resolve, reject) => {
      this.nodeHttp.getActiveNodes().subscribe(nodes => {
        resolve(nodes);
      });
    })


  }

  public getActiveNode(): Promise<Node> {
    return new Promise((resolve, reject) => {
      this.nodeHttp.getNodeInfo().subscribe(node => {
        resolve(node);
      });

    })
  }


}
