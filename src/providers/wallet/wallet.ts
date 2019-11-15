import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AuthProvider, AccountInterface } from '../auth/auth';
import {
  SimpleWallet, Password, Address, EncryptedPrivateKey,
  AccountInfo, MosaicAmountView, NetworkType, PublicAccount, TransferTransaction,
  Deadline, PlainMessage, Mosaic, MosaicId, UInt64, Account, NetworkCurrencyMosaic
} from 'tsjs-xpx-chain-sdk';
import { ProximaxProvider } from '../proximax/proximax';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app/app.config';

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
    private proximaxProvider: ProximaxProvider
  ) {
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
   * getWallets()
   */
  getWallets(): Promise<any> {
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      let _wallets = dataAccountSelected || {};
      const WALLETS = _wallets['catapultAccounts'] || [];
      if (WALLETS) {
        const walletsMap = WALLETS.map(walletFile => {
          let wallet = walletFile as SimpleWallet;
          wallet.walletColor = walletFile['walletColor'];
          return wallet;
        });
        _wallets['catapultAccounts'] = walletsMap;
      } else {
        _wallets['catapultAccounts'] = [];
      }

      return _wallets['catapultAccounts'];
    });
  }

  /**
   * 
   * @param wallet 
   */
  setSelectedWallet(wallet: SimpleWallet) {
    return this.storage.set('selectedWallet', wallet);
  }

  /**
   *
   *
   * @param {SimpleWallet} wallet
   * @param {string} walletColor
   * @returns {Promise<dataAccount>}
   * @memberof WalletProvider
   */
  async storeWalletCatapult(wallet: SimpleWallet, walletColor: string, password: Password): Promise<AccountInterface> {
    const dataAccount = await this.authProvider.getDataAccountSelected();
    const catapultAccounts = (dataAccount.catapultAccounts) ? dataAccount.catapultAccounts : [];
    const publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(
      this.proximaxProvider.decryptPrivateKey(
        password,
        wallet.encryptedPrivateKey.encryptedKey,
        wallet.encryptedPrivateKey.iv
      ).toUpperCase(), wallet.network
    );
    const selectWallet = { account: wallet, walletColor: walletColor, publicAccount: publicAccount }
    catapultAccounts.push({ account: wallet, walletColor: walletColor, publicAccount: publicAccount });
    dataAccount['catapultAccounts'] = catapultAccounts;
    const data: AccountInterface[] = await this.storage.get('accounts');
    const otherAccounts: AccountInterface[] = data.filter(x => x.user !== dataAccount.user);
    otherAccounts.push(dataAccount);
    this.authProvider.setSelectedWallet(selectWallet);
    this.authProvider.setSelectedAccount(dataAccount);
    this.storage.set('accounts', otherAccounts);
    return dataAccount;
  }

  /**
   *
   *
   * @param {*} walletC
   * @param {*} walletN
   * @param {*} walletColor
   * @returns {Promise<SimpleWallet>}
   * @memberof WalletProvider
   */
  storeWalletNis1(walletC, walletN, walletColor): Promise<SimpleWallet> {
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
   *
   *
   * @param {SimpleWallet} account
   * @memberof WalletProvider
   */
  async validateExistAccount(account: SimpleWallet) {
    const data: AccountInterface[] = await this.storage.get('accounts');
    let exist = false;
    data.forEach((element: AccountInterface) => {
      element.catapultAccounts.forEach((el) => {
        const address = this.proximaxProvider.createFromRawAddress(el.account.address['address']).pretty();
        if (address === account.address.pretty()) {
          exist = true;
        } else if (account.name === el.account.name) {
          exist = true;
        }
      });
    });

    return exist;
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
   * Update the wallet name of the given wallet.
   * @param wallet The wallet to change the name.
   * @param newWalletName The new name for the wallet.
   */
  public updateWalletName(wallet: SimpleWallet, newWalletName: string, walletColor: string) {
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

        _wallets.map((res, index) => {
          if (res.wallet.name == wallet.name) {
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
    return this.storage.get('selectedWallet').then(wallets => {
      let _wallet = null;
      if (wallets) {
        const selectedWallet = wallets;
        this.selectedWallet = selectedWallet
        _wallet = <SimpleWallet>(selectedWallet);
      } else {
        _wallet = null;
      }

      return _wallet;
    });
  }

  /**
   * Get loaded wallets from localStorage
   */
  public getLocalWallets(): Promise<any> {
    return this.authProvider.getDataAccountSelected().then(dataAccountSelected => {
      return this.storage.get('wallets').then(wallets => {
        let _wallets = wallets ? wallets : {};
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


  isPrivateKeyValid(privateKey: any) {
    if (privateKey.length !== 64 && privateKey.length !== 66) {
      return false;
    } else if (!this.isHexadecimal(privateKey)) {
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
