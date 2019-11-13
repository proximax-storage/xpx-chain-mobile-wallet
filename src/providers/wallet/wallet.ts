import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AuthProvider, AccountInterface } from '../auth/auth';
import {
  SimpleWallet, Password, Address, EncryptedPrivateKey,
  AccountInfo, MosaicAmountView, NetworkType, PublicAccount, TransferTransaction,
  Deadline, PlainMessage, Mosaic, MosaicId, UInt64, Account, TransactionHttp, NetworkCurrencyMosaic
} from 'tsjs-xpx-chain-sdk';
import { ProximaxProvider } from '../proximax/proximax';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app/app.config';
import { HttpClient } from '@angular/common/http';

/*
 Generated class for the NemProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class WalletProvider {
  generationHash: any;
  httpUrl: string;
  AppConfig: any;
  wallet: any;
  publicAccount: PublicAccount;
  wallets: SimpleWallet[];
  selectedWallet: any;

  constructor(
    private storage: Storage,
    private authProvider: AuthProvider,
    private proximaxProvider: ProximaxProvider,
    private http: HttpClient, ) {
    this.httpUrl = AppConfig.sirius.httpNodeUrl;
  }


  /**
   *
   *
   * @param {string} walletName
   * @param {string} password
   * @param {string} privateKey
   * @returns {SimpleWallet}
   * @memberof WalletProvider
   */
  createAccountFromPrivateKey(walletName: string, password: string, privateKey: string): SimpleWallet {
    return this.proximaxProvider.createAccountFromPrivateKey(walletName, new Password(password), privateKey);
  }


  /**
   *
   *
   * @param {SimpleWallet} wallet
   * @param {string} walletColor
   * @returns {Promise<dataAccount>}
   * @memberof WalletProvider
   */
  async storeWallet(wallet: SimpleWallet, walletColor: string, password: Password): Promise<dataAccount> {
    const dataAccount = await this.authProvider.getDataAccountSelected();
    const catapultAccounts = (dataAccount.catapultAccounts) ? dataAccount.catapultAccounts : [];
    const publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(
      this.proximaxProvider.decryptPrivateKey(
        password,
        wallet.encryptedPrivateKey.encryptedKey,
        wallet.encryptedPrivateKey.iv
      ).toUpperCase(), wallet.network
    );

    catapultAccounts.push({ account: wallet, walletColor: walletColor, publicAccount: publicAccount });
    dataAccount['catapultAccounts'] = catapultAccounts;
    const data: AccountInterface[] = await this.storage.get('accounts');
    const otherAccounts: AccountInterface[] = data.filter(x => x.user !== dataAccount.user);
    otherAccounts.push(dataAccount);
    this.authProvider.setSelectedAccount(dataAccount);
    this.storage.set('accounts', otherAccounts);
    return dataAccount;
  }




  // -----------------------------------------------------------------------

  /**
 * Create Simple Wallet
 * @param walletName wallet idenitifier for app
 * @param password wallet's password
 * @param selected network
 * @return Promise with wallet created
 */
  public createSimpleWallet(
    { walletName, password }:
      { walletName: string; password: string; }):
    SimpleWallet {
    return this.proximaxProvider.createSimpleWallet(walletName, new Password(password));
  }



  public getAccount(wallet: SimpleWallet): Observable<Account> {
    return new Observable(observer => {
      // Get user's password and unlock the wallet to get the account
      this.authProvider
        .getPassword()
        .then(password => {
          // Get user's password
          const myPassword = new Password(password);

          // Convert current wallet to SimpleWallet
          const myWallet = this.convertToSimpleWallet(wallet)

          // Unlock wallet to get an account using user's password 
          const account = myWallet.open(myPassword);

          observer.next(account);

        });
    });
  }

  public getAccountInfo(account: Account): Observable<AccountInfo> {
    return this.proximaxProvider.getAccountInfo(Address.createFromRawAddress(account.address.plain()));
  }

  public getBalance(address: string): Observable<MosaicAmountView[]> {
    return this.proximaxProvider.getBalance(Address.createFromRawAddress(address));
  }

  convertToSimpleWallet(wallet: SimpleWallet) {
    Object.setPrototypeOf(wallet, SimpleWallet.prototype)
    Object.setPrototypeOf(wallet.address, Address.prototype);
    Object.setPrototypeOf(wallet.encryptedPrivateKey, EncryptedPrivateKey.prototype);
    return wallet;
  };

  convertToSimpleWallets(wallets: SimpleWallet[]) {
    return wallets.map(wallet => {
      Object.setPrototypeOf(wallet, SimpleWallet.prototype)
      Object.setPrototypeOf(wallet.address, Address.prototype);
      Object.setPrototypeOf(wallet.encryptedPrivateKey, EncryptedPrivateKey.prototype);

      return wallet;
    });
  };



  /**
* Store wallet
* @param walletC
* @param walletN
* @return Promise with stored wallet
*/

  public storeWalletNis1(walletC, walletN, walletColor): Promise<SimpleWallet> {
    let result = [];
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      return this.getLocalWalletsNis().then(value => {
        let wallets = value;
        result = wallets[dataAccountSelected.user];

        result.push({ wallet: walletC, walletNis1: walletN, walletColor: walletColor });

        wallets[dataAccountSelected.user] = result;

        this.storage.set('walletsNis1', wallets);
        return walletN;
      });
    });
  }
  /**
   * Update the wallet name of the given wallet.
   * @param wallet The wallet to change the name.
   * @param newWalletName The new name for the wallet.
   */
  public updateWalletName(wallet: SimpleWallet, newWalletName: string, walletColor: string) {
    // return;
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      return this.getLocalWallets().then(wallets => {
        let _wallets: any = wallets[dataAccountSelected.user];
        let updateWallet: any;
        for (let i = 0; i < _wallets.length; i++) {
          if (_wallets[i].wallet.name == wallet.name) {
            _wallets[i].wallet.name = newWalletName;
            _wallets[i].walletColor = walletColor;
            updateWallet = _wallets[i];
          };

        }



        _wallets = _wallets.map(_ => {
          return {
            wallet: _.wallet,
            walletColor: _.walletColor
          }
        });

        const WALLET = {};
        WALLET[dataAccountSelected.user] = _wallets;

        return this.storage.set('wallets', WALLET).then(_ => {
          return updateWallet;
        });
      });
    });
  }

  deleteWallet(wallet: SimpleWallet) {

    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      return this.getLocalWallets().then(wallets => {
        let _wallets: Array<any> = wallets[dataAccountSelected.user];

        console.log(_wallets, wallet);
        _wallets.map((res, index) => {
          if (res.wallet.name == wallet.name) {
            console.log("Deleting your wallet: ", wallet.name)
            _wallets.splice(index, 1);

            _wallets = _wallets.map(_ => {
              return {
                wallet: _.wallet,
                walletColor: _.walletColor
              }
            });

            const WALLET = {};
            WALLET[dataAccountSelected.user] = _wallets;

            return this.storage.set('wallets', WALLET);
          }
        })
        _wallets
        return;




      });
    });
  }

  /**
   * Check If Wallet Name Exists
   * @param walletName
   * @return Promise that resolves a boolean if exists
   */
  public checkIfWalletNameExists(walletName: string, walletAddress: string): Promise<boolean> {
    let exists = false;
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      return this.getLocalWallets().then(wallets => {
        const _wallets = wallets[dataAccountSelected.user];
        for (var i = 0; i < _wallets.length; i++) {
          console.log('wallet storage', _wallets[i])
          if (_wallets[i].wallet.name === walletName || _wallets[i].wallet.address.address === walletAddress) {
            exists = true;
            break;
          }
        }
        return exists;
      });
    });
  }

  /**
   * Retrieves selected wallet
   * @return promise with selected wallet
   */
  public getSelectedWallet(): Promise<SimpleWallet> {
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      return this.storage.get('selectedWallet').then(wallets => {
        let _wallet = null;
        if (wallets) {
          const selectedWallet = wallets[dataAccountSelected.user];
          this.selectedWallet = selectedWallet
          _wallet = <SimpleWallet>(selectedWallet);
        } else {
          _wallet = null;
        }

        return _wallet;
      });
    });
  }

  /**
   * Get loaded wallets from localStorage
   */
  public getLocalWallets(): Promise<any> {
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      return this.storage.get('wallets').then(wallets => {
        let _wallets = wallets ? wallets : {};
        console.log("LOG: WalletProvider -> constructor -> _wallets", _wallets)
        const WALLETS = _wallets[dataAccountSelected.user] ? _wallets[dataAccountSelected.user] : [];

        if (wallets) {
          const walletsMap = WALLETS.map(walletFile => {
            if (walletFile.name) {
              return
              // this.convertJSONWalletToFileWallet(walletFile, walletFile.walletColor);
            } else {
              return { wallet: <SimpleWallet>(walletFile.wallet), walletColor: walletFile.walletColor };
            }
          });

          _wallets[dataAccountSelected.user] = walletsMap;
        } else {
          _wallets[dataAccountSelected.user] = [];
        }

        return _wallets;
      });
    });
  }

  /**
 * Get loaded wallets from localStorage
 */
  public getLocalWalletsNis(): Promise<any> {
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      return this.storage.get('walletsNis1').then(wallets => {
        let _wallets = wallets ? wallets : {};
        console.log("LOG: WalletProvider -> constructor -> _wallets", _wallets)
        const WALLETS = _wallets[dataAccountSelected.user] ? _wallets[dataAccountSelected.user] : [];

        if (wallets) {
          const walletsMap = WALLETS.map(walletFile => {
            if (walletFile.name) {
              return
              // this.convertJSONWalletToFileWallet(walletFile, walletFile.walletColor);
            } else {
              return { wallet: <SimpleWallet>(walletFile.wallet), walletNis1: <SimpleWallet>(walletFile.walletNis1), walletColor: walletFile.walletColor };
            }
          });

          _wallets[dataAccountSelected.user] = walletsMap;
        } else {
          _wallets[dataAccountSelected.user] = [];
        }

        return _wallets;
      });
    });
  }

  /**
   * Get loaded wallets from localStorage
   */
  public getWallets(): Promise<any> {
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      console.log("SIRIUS CHAIN WALLET: WalletProvider -> username", dataAccountSelected.user)
      return this.storage.get('wallets').then(wallets => {
        console.log("LOG: WalletProvider -> constructor -> data", wallets)
        let _wallets = wallets || {};
        const WALLETS = _wallets[dataAccountSelected.user] || [];
        console.log("LOG: WalletProvider -> constructor -> ACCOUNT_WALLETS", WALLETS)

        if (WALLETS) {
          const walletsMap = WALLETS.map(walletFile => {
            console.log("SIRIUS CHAIN WALLET: WalletProvider -> walletFile", walletFile)

            if (walletFile.name) {
              return
              // this.convertJSONWalletToFileWallet(walletFile, walletFile.walletColor);
            } else {
              let wallet = walletFile.wallet as SimpleWallet;
              wallet.walletColor = walletFile['walletColor'];
              return wallet;
            }
          });

          _wallets[dataAccountSelected.user] = walletsMap;
        } else {
          _wallets[dataAccountSelected.user] = [];
        }

        return _wallets[dataAccountSelected.user];
      });
    });
  }

  // private convertJSONWalletToFileWallet(wallet, walletColor): SimpleWallet {
  //   let walletString = Base64.encode(
  //     JSON.stringify({
  //       address: wallet.accounts[0].address,
  //       creationDate: DateTime.local().toString(),
  //       encryptedPrivateKey: wallet.accounts[0].encrypted,
  //       iv: wallet.accounts[0].iv,
  //       network:
  //         wallet.accounts[0].network == -104
  //           ? NetworkTypes.TEST_NET
  //           : NetworkTypes.MAIN_NET,
  //       name: wallet.name,
  //       type: 'simple',
  //       schema: 1,
  //     })
  //   );
  //   let importedWallet = SimpleWallet.readFromWLT(walletString);
  //   importedWallet.walletColor = walletColor;
  //   return importedWallet;
  // }

  /**
   * Set a selected wallet
   */
  public setSelectedWallet(wallet: SimpleWallet) {
    return Promise.all([
      this.authProvider.getDataAccountSelected(),
      this.storage.get('selectedWallet')
    ]).then(results => {
      const user = results[0].user;
      const SELECTED_WALLET = results[1] ? results[1] : {};
      SELECTED_WALLET[user] = wallet;

      return this.storage.set('selectedWallet', SELECTED_WALLET);
    });
  }

  /**
   * Remove selected Wallet
   */
  public unsetSelectedWallet() {
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      this.storage.get('selectedWallet').then(selectedWallet => {
        delete selectedWallet[dataAccountSelected.user];

        this.storage.set('selectedWallet', null);
      });
    });
  }


  decrypt(common: any, current: any, account: any = '', algo: any = '', network: any = '') {
    // const acct = current;
    // const net = NetworkType.TEST_NET;
    // const alg = 2;
    // const walletAccount = {
    //   encrypted: current.encryptedPrivateKey.encryptedKey,
    //   iv: current.encryptedPrivateKey.iv
    // }
    // console.log('common', common)
    // console.log('walletAccount', walletAccount)
    // console.log('alg', alg)
    // // Try to generate or decrypt key
    // if (!Crypto.passwordToPrivateKey(common, walletAccount, alg)) {
    //   // console.log('passwordToPrivatekeyy ')
    //   setTimeout(() => {
    //     console.log('Error Invalid password')
    //     // this.sharedService.showError('Error', '¡Invalid password!');
    //   }, 500);
    //   return false;
    // }
    // if (common.isHW) {
    //   return true;
    // }
    // // console.log('pase common.common ', common.privateKey)
    // // console.log('pase common.net ', net)
    // // console.log('pase common.acct.address ', acct.address.address)
    // if (!this.isPrivateKeyValid(common.privateKey) || !this.proximaxProvider.checkAddress(common.privateKey, net, acct.address.address)) {
    //   setTimeout(() => {
    //     console.log('Error Invalid password')
    //     // this.sharedService.showError('Error', '¡Invalid password!');
    //   }, 500);
    //   return false;
    // }
    // // console.log('!this.isPrivateKeyValid......')
    // //Get public account from private key
    // this.publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(common.privateKey, net);
    // // console.log('this.publicAccount ', this.publicAccount )
    // return true;
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
    mosaic: string | number[]
  ) {
    const recipientAddress = this.proximaxProvider.createFromRawAddress(recipient);
    const transferTransaction = TransferTransaction.create(Deadline.create(10), recipientAddress,
      [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(Number(amount))), NetworkCurrencyMosaic.createRelative(10)], PlainMessage.create(message), network
    );
    const account = Account.createFromPrivateKey(common.privateKey, network);
    const signedTransaction = account.sign(transferTransaction, this.generationHash)

    return {
      signedTransaction: signedTransaction,
      transactionHttp: this.proximaxProvider.transactionHttp
    };
  }

}
