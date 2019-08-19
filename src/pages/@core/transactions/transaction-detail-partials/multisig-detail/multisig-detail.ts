// //"type": 4100

// import { Component, Input } from '@angular/core';

// import {
//   Address,
//   CosignatoryModification,
//   MosaicTransferable,
//   TransferTransaction,
//   TransactionType,
//   MultisigTransaction,
//   Account,
//   AccountInfo,
//   SimpleWallet,
//   TransactionHttp
// } from 'tsjs-xpx-chain-sdk';

// import { NemProvider } from '../../../../../providers/nem/nem';
// import { WalletProvider } from '../../../../../providers/wallet/wallet';
// import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';
// import { App } from '../../../../../providers/app/app';
// import { AuthProvider } from '../../../../../providers/auth/auth';
// import { AlertProvider } from '../../../../../providers/alert/alert';
// import { NavController } from 'ionic-angular';
// import { HapticProvider } from '../../../../../providers/haptic/haptic';

// @Component({
//   selector: 'multisig-detail',
//   templateUrl: 'multisig-detail.html'
// })
// export class MultisigDetailComponent {
//   @Input() tx: any;
//   App = App;

//   owner: Address;
//   amount: number;
//   mosaics: MosaicTransferable[];
//   hasLevy: boolean;
//   modifications: CosignatoryModification[];
//   accountInfo: any;
//   multisigAccounts: any[];
//   showSignButton: boolean;

//   currentWallet: SimpleWallet;
//   credentials: { password: string; privateKey: string };

//   transactionHttp: TransactionHttp;

//   private _getAmount() {
//     try {
//       this.amount = (<TransferTransaction>(
//         this.tx.otherTransaction
//       )).xem().amount;
//     } catch (e) {
//       this.amount = 0;
//     }
//   }

//   private _getMosaics() {
//     try {
//       this.nem
//         .getMosaicsDefinition(
//           (<TransferTransaction>this.tx.otherTransaction).mosaics()
//         )
//         .subscribe(mosaics => {
//           this.mosaics = mosaics;
//           this.hasLevy = this.mosaics.filter(mosaic => mosaic.levy).length
//             ? true
//             : false;
//         });
//     } catch (e) {
//       this.mosaics = [];
//     }
//   }

//   private _getCosignatoryModification() {
//     try {
//       this.modifications = this.tx.otherTransaction.modifications;
//     } catch (e) {
//       this.modifications = [];
//     }
//   }

//   private _setOwner() {
//     this.wallet.getSelectedWallet().then(wallet => {
//       this.owner = wallet.address;
//       this.currentWallet = wallet;
//       this._checkStatus();

//       // Initialize private data
//       this.authProvider.getPassword().then(password => {
//         this.credentials = {
//           password: password,
//           privateKey: ''
//         };
//       })
//     });
//   }

//   constructor(
//     private nem: NemProvider,
//     private wallet: WalletProvider,
//     public utils: UtilitiesProvider,
//     private nemProvider: NemProvider,
//     private authProvider: AuthProvider,
//     private alertProvider: AlertProvider,
//     private navCtrl: NavController,
//     private haptic: HapticProvider
//     // private transactionHttp: TransactionHttp
//   ) {
//     this.amount = 0;
//     this.mosaics = [];
//     this.hasLevy = false;

//   }

//   ngOnInit() {
//     // this._getCurrentWallet();
//     this._getMosaics();
//     this._setOwner();
//     this._getAmount();
//     this._getCosignatoryModification();
//     console.log("Multisig transaction", this.tx)

//     let multisigTransaction = (this.tx as MultisigTransaction)

//     console.log("isPendingToSign?", multisigTransaction.isPendingToSign());
//     console.log("isConfirmed?", multisigTransaction.isConfirmed());
//   }

//   _getAccountInfo(address) {
//     console.info("Getting account information.", address)
//     this.nemProvider
//       .getAccountInfo(address)
//       .subscribe(accountInfo => {
//         if (accountInfo) {
//           const _accountInfo = accountInfo;
//           console.log("accountInfo", _accountInfo)

//           if (_accountInfo.cosignatoryOf) {
//             console.log("This is a multisig account");

//             let multisigAccounts: AccountInfo[] = [..._accountInfo.cosignatoryOf]; // get multisig accounts the user has
//             console.log("Multisig accounts", multisigAccounts[0])

//             let multisigTransaction = (this.tx as MultisigTransaction);

//             // compare if source account (multisigTransaction.otherTransaction.signer) is equal to one of the user multisig accounts
//             let result = multisigAccounts.find(multisigAccount => multisigAccount.publicAccount.address.plain() === multisigTransaction.otherTransaction.signer.address.plain())

//             console.log("Is this transaction belong to one of my multisig accounts?");

//             if (result) {
//               console.log("Yes, you need to sign.");
//               this.showSignButton = true;
//             }


//           }

//         }
//       });
//   }

//   _checkStatus() {
//     console.log("Checking status");
//     if (this.owner.equals(this.tx.signer.address)) {
//       // console.log("You already signed");
//       this.showSignButton = false;
//     } else {
//       if (this.owner.equals(this.tx.otherTransaction.recipient)) { // If you are not the receiver
//         // console.log("You are the receiver");
//         this.showSignButton = false;
//       } else {
//         // get user multisig accounts
//         if((this.tx as MultisigTransaction).isPendingToSign()) {
//           this._getAccountInfo(this.owner);
//         }

//       }

//     }
//   }

//   /**
//    * User checking if it can do the send transaction.
//    */
//   private _allowedToSendTx() {
//     if (this.credentials.password) {
//       try {
//         this.credentials.privateKey = this.nemProvider.passwordToPrivateKey(
//           this.credentials.password,
//           this.currentWallet
//         );
//         return true;
//       } catch (err) {
//         return false;
//       }
//     }
//     return false;
//   }

//   sign() {
//     let multisigTransaction = (this.tx as MultisigTransaction)

//     console.log("isPendingToSign?", multisigTransaction.isPendingToSign());
//     console.log("isConfirmed?", multisigTransaction.isConfirmed());

//     if (this._allowedToSendTx()) {
//       this.nemProvider
//         .signMultisigTransaction(multisigTransaction.otherTransaction.signer.address, multisigTransaction.hashData, this.currentWallet, this.credentials.password)
//         .subscribe(
//           value => {
//             this.showSuccessMessage()
//           },
//           error => {
//             this.showErrorMessage(error)
//           }
//         );
//     } else {
//       this.alertProvider.showMessage('Invalid password. Please try again.');
//     }

//     // console.log("Current wallet", this.owner);
//     // console.log("Cosigner signed", this.tx.signer.address);
//     // let multisigTransaction = (this.tx as MultisigTransaction);

//     // console.log("TransactionType?", multisigTransaction.otherTransaction.type);
//     // console.log("Transaction details", this.tx);

//     // let account = Account.createWithPrivateKey("df7d5750146b80850b0834471f242145490a992d6bff6feae4fc4f3122f60fef");
//     // if(this.tx.otherTransaction.type === TransactionTypes.TRANSFER) {
//     //   console.log("Signing", this.tx);

//     //   let multisigTransaction = (this.tx as MultisigTransaction);
//     //   let signedTransaction = account.signTransaction(multisigTransaction)
//     //   this.transactionHttp.announceTransaction(signedTransaction)
//     //   .subscribe(
//     //           value => {
//     //             this.showSuccessMessage()
//     //           },
//     //           error => {
//     //             this.showErrorMessage(error)
//     //           }
//     //         );

//     // }

//     // if(this.owner.equals(this.tx.signer.address) ) {
//     //   console.log("You already signed");
//     // } else {
//     //   if(this.owner.equals(this.tx.otherTransaction.recipient)) { // If you are not the receiver
//     //     console.log("You are the receiver");
//     //   } else {
//     //     console.log("You need to sign. Really!");

//     //     // get user multisig accounts
//     //     this.getAccountInfo(this.owner);


//     // }

//     // }


//   }

//   showErrorMessage(error) {
//     this.haptic.notification({ type: 'error' });
//     console.log(error);
//     if (error.toString().indexOf('FAILURE_INSUFFICIENT_BALANCE') >= 0) {
//       this.alertProvider.showMessage(
//         'Sorry, you don\'t have enough balance to continue the transaction.'
//       );
//     } else if (
//       error.toString().indexOf('FAILURE_MESSAGE_TOO_LARGE') >= 0
//     ) {
//       this.alertProvider.showMessage(
//         'The note you entered is too long. Please try again.'
//       );
//     } else if (error.statusCode == 404) {
//       this.alertProvider.showMessage(
//         'This address does not belong to this network'
//       );
//     } else {
//       this.alertProvider.showMessage(
//         'An error occured. Please try again.'
//       );
//     }
//   }
//   showSuccessMessage() {
//     this.haptic.notification({ type: 'success' });
//     this.alertProvider.showMessage(
//       "You have successfully signed the transaction"
//     );
//     this.utils.setTabIndex(2);
//     this.navCtrl.setRoot(
//       'TabsPage',
//       {},
//       {
//         animate: true,
//         direction: 'backward'
//       }
//     );
//   }


// }
