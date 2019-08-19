// //"type": 4100

// import { Component, Input } from '@angular/core';

// import {
//   Address,
//   CosignatoryModification,
//   MosaicTransferable,
//   TransferTransaction,
//   AccountInfo,
//   MultisigTransaction
// } from 'nem-library';

// import { NemProvider } from '../../../../../providers/nem/nem';
// import { WalletProvider } from '../../../../../providers/wallet/wallet';
// import { UtilitiesProvider } from '../../../../../providers/utilities/utilities';

// @Component({
//   selector: 'multisig-transaction',
//   templateUrl: 'multisig-transaction.html'
// })
// export class MultisigTransactionComponent {
//   @Input() tx: any;

//   owner: Address;
//   amount: number;
//   mosaics: MosaicTransferable[];
//   hasLevy: boolean;
//   modifications: CosignatoryModification[];
//   status: string;

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
//       this._checkStatus();
//     });
//   }

//   constructor(
//     private nem: NemProvider,
//     private wallet: WalletProvider,
//     public utils: UtilitiesProvider,
//     private nemProvider: NemProvider
//   ) {
//     this.amount = 0;
//     this.mosaics = [];
//     this.hasLevy = false;
//   }

//   ngOnInit() {
//     this._getMosaics();
//     this._setOwner();
//     this._getAmount();
//     this._getCosignatoryModification();
//   }

//   getStatus() {
//     return this.status;
//   }

//   _checkStatus(){
//     console.log("Checking status");
//     if(this.owner.equals(this.tx.signer.address) ) {
//       // console.log("You already signed");
//       this.status = "Unconfirmed (Signed)";
//     } else {
//       if(this.owner.equals(this.tx.otherTransaction.recipient)) { // If you are not the receiver
//         // console.log("You are the receiver");
//         this.status = "Unconfirmed";
//       } else {
//         // get user multisig accounts
//         this._getAccountInfo(this.owner);
//       }
      
//     }
//   }

//   _getAccountInfo(address) {
//     // console.info("Getting account information.", address)
//     this.nemProvider
//       .getAccountInfo(address)
//       .subscribe(accountInfo => {
//         if (accountInfo) {
//           const _accountInfo = accountInfo;
//           // console.log("accountInfo", _accountInfo)

//           if (_accountInfo.cosignatoryOf) {
//             // console.log("This is a multisig account");

//             let multisigAccounts: AccountInfo[]= [... _accountInfo.cosignatoryOf]; // get multisig accounts the user has
//             // console.log("Multisig accounts", multisigAccounts[0])

//             let multisigTransaction = (this.tx as MultisigTransaction);

//             // compare if source account (multisigTransaction.otherTransaction.signer) is equal to one of the user multisig accounts
//             let result = multisigAccounts.find(multisigAccount => multisigAccount.publicAccount.address.plain() === multisigTransaction.otherTransaction.signer.address.plain())

//             // console.log("Is this transaction belong to one of my multisig accounts?");

//             if(result) {
//               // console.log("Yes, you need to sign.");
//               this.status = "Unconfirmed (Needs your signature)";
//             }


//           }

//         }
//       });
//   }
// }
