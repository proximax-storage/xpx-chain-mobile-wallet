import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AuthProvider } from '../auth/auth';
import {
  SimpleWallet,
  Password,
  Address,
  EncryptedPrivateKey,
  AccountInfo,
  MosaicAmountView,
  NetworkType,
  PublicAccount,
  TransferTransaction,
  Deadline,
  PlainMessage,
  Mosaic,
  MosaicId,
  UInt64,
  Account,
  NetworkCurrencyMosaic
} from 'tsjs-xpx-chain-sdk';
import { SimpleWallet as SimpleWalletNIS1, PublicAccount as PublicAccountNIS1 } from 'nem-library';
import { ProximaxProvider } from '../proximax/proximax';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app/app.config';
import { NemProvider } from '../nem/nem';

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
    private nemProvider: NemProvider,
    private storage: Storage,
    private authProvider: AuthProvider,
    private proximaxProvider: ProximaxProvider
  ) {
    this.httpUrl = AppConfig.sirius.httpNodeUrl;
  }


  /**
   *
   *
   * @param {string} user
   * @param {string} password
   * @returns
   * @memberof WalletProvider
   */
  async createUser(user: string, password: string) {
    const data = await this.storage.get('wallets');
    const wallets: WalletInterface[] = data ? data : [];
    let foundWallet = wallets.filter((wallet: any) => {
      return wallet.user.includes(user);
    });

    if (foundWallet.length > 0) {
      return "duplicate";
    } else {
      var encrypted = this.authProvider.encryptAccount(password);
      const wallet = {
        user: user.toLowerCase(),
        encrypted: encrypted.toString(),
        catapultAccounts: null,
        nis1Accounts: null
      };

      this.setSelectedWallet(wallet);
      wallets.push(wallet);
      return this.storage.set('wallets', wallets);
    }
  }

  /**
   *
   *
   * @param {PublicAccount} publicAccountCatapult
   * @returns
   * @memberof WalletProvider
   */
  async filterCatapultAccountInWalletSelected(publicAccountCatapult: PublicAccount) {
    const myWalletSelected = await this.getWalletSelected();
    console.log('This my wallet selected --->', myWalletSelected);
    const myAccountFiltered = myWalletSelected.catapultAccounts.find(x => x.publicAccount.publicKey === publicAccountCatapult.publicKey);
    return (myAccountFiltered) ? myAccountFiltered : null;
  }

  /**
   *
   *
   * @memberof WalletProvider
   */
  async getAccountsNis1() {
    const selectedWallet: WalletInterface = await this.storage.get('selectedWallet');
    console.log('selectedWallet', selectedWallet);
    return (selectedWallet && selectedWallet.nis1Accounts) ? selectedWallet.nis1Accounts : [];
  }

  /**
   *
   *
   * @returns {Promise<CatapultsAccountsInterface>}
   * @memberof WalletProvider
   */
  async getAccountSelected(): Promise<CatapultsAccountsInterface> {
    const data = await this.storage.get('selectedAccount');
    const result = data ? data : null;
    return result;
  }

  /**
   *
   *
   * @returns {Promise<any>}
   * @memberof WalletProvider
   */
  async getWallets(): Promise<any> {
    const dataAccountSelected = await this.getWalletSelected();
    let _wallets = dataAccountSelected || {};
    const WALLETS = _wallets['catapultAccounts'] || [];
    if (WALLETS) {
      const walletsMap = WALLETS.map(walletFile => {
        let wallet = (walletFile as SimpleWallet);
        wallet.walletColor = walletFile['walletColor'];
        return wallet;
      });
      _wallets['catapultAccounts'] = walletsMap;
    }
    else {
      _wallets['catapultAccounts'] = [];
    }
    return _wallets['catapultAccounts'];
  }

  /**
   *
   *
   * @returns {Promise<WalletInterface>}
   * @memberof WalletProvider
   */
  async getWalletSelected(): Promise<WalletInterface> {
    const data = await this.storage.get('selectedWallet');
    const result = data ? data : null;
    return result;
  }

  /**
   *
   *
   * @returns {Promise<CatapultsAccountsInterface[]>}
   * @memberof WalletProvider
   */
  async getAccountsCatapult(): Promise<CatapultsAccountsInterface[]> {
    const walletSelected = await this.getWalletSelected();
    return (walletSelected.catapultAccounts) ? walletSelected.catapultAccounts : [];
  }

  /**
   *
   *
   * @returns {Promise<SimpleWallet>}
   * @memberof WalletProvider
   */
  async getSelectedWallet(): Promise<SimpleWallet> {
    let wallets = await this.storage.get('selectedWallet');
    let _wallet = null;
    if (wallets) {
      const selectedWallet = wallets;
      this.selectedWallet = selectedWallet;
      _wallet = (<SimpleWallet>(selectedWallet));
    }
    else {
      _wallet = null;
    }
    return _wallet;
  }

  /**
   *
   *
   * @param {SimpleWallet} wallet
   * @param {string} walletColor
   * @returns {Promise<dataAccount>}
   * @memberof WalletProvider
   */
  async storeWalletCatapult(catapultAccount: SimpleWallet, nis1Account: SimpleWalletNIS1, walletColor: string, password: Password): Promise<WalletInterface> {
    const walletSelected = await this.getWalletSelected();
    const catapultAccounts = (walletSelected.catapultAccounts) ? walletSelected.catapultAccounts : [];
    const nis1Accounts = (walletSelected.nis1Accounts) ? walletSelected.nis1Accounts : [];
    const publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(
      this.proximaxProvider.decryptPrivateKey(
        password,
        catapultAccount.encryptedPrivateKey.encryptedKey,
        catapultAccount.encryptedPrivateKey.iv
      ).toUpperCase(), catapultAccount.network
    );

    if (nis1Account) {
      const publicAccountNis1 = this.nemProvider.createAccountPrivateKey(
        this.proximaxProvider.decryptPrivateKey(
          password,
          catapultAccount.encryptedPrivateKey.encryptedKey,
          catapultAccount.encryptedPrivateKey.iv
        ).toUpperCase()
      );

      const accountnis1 = {
        account: nis1Account,
        walletColor: walletColor,
        publicAccount: publicAccountNis1,
        publicAccountCatapult: publicAccount
      };

      nis1Accounts.push(accountnis1);
      walletSelected['nis1Accounts'] = nis1Accounts;
    }

    const accountCatapult = { account: catapultAccount, walletColor: walletColor, publicAccount: publicAccount }
    catapultAccounts.push(accountCatapult);
    walletSelected['catapultAccounts'] = catapultAccounts;
    const wallet: WalletInterface[] = await this.storage.get('wallets');
    const otherWallets: WalletInterface[] = wallet.filter(x => x.user !== walletSelected.user);
    otherWallets.push(walletSelected);
    this.setSelectedAccount(accountCatapult);
    this.setSelectedWallet(walletSelected);
    this.storage.set('wallets', otherWallets);
    return walletSelected;
  }

  /**
   *
   *
   * @param {SimpleWallet} account
   * @memberof WalletProvider
   */
  async validateExistAccount(account: SimpleWallet) {
    const wallet: WalletInterface[] = await this.storage.get('wallets');
    let exist = false;
    wallet.forEach((element: WalletInterface) => {
      if (element.catapultAccounts) {
        element.catapultAccounts.forEach((el) => {
          const address = this.proximaxProvider.createFromRawAddress(el.account.address['address']).pretty();
          if (address === account.address.pretty()) {
            exist = true;
          } else if (account.name === el.account.name) {
            exist = true;
          }
        });
      }
    });

    return exist;
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
   * @param {string} walletName
   * @param {string} password
   * @returns {SimpleWallet}
   * @memberof WalletProvider
   */
  createSimpleWallet(walletName: string, password: string): SimpleWallet {
    return this.proximaxProvider.createSimpleWallet(walletName, new Password(password));
  }


  /**
   *
   *
   * @param {SimpleWallet} wallet
   * @returns
   * @memberof WalletProvider
   */
  setSelectedAccount(account: { account: SimpleWallet, walletColor: string, publicAccount: PublicAccount }) {
    return this.storage.set('selectedAccount', account);
  }


  /**
   *
   *
   * @param {WalletInterface} account
   * @returns {Promise<any>}
   * @memberof WalletProvider
   */
  setSelectedWallet(wallet: WalletInterface): Promise<any> {
    this.storage.set('isAccountCreated', true);
    this.storage.set('isLoggedIn', true);
    this.storage.set('selectedWallet', wallet);
    return;
  }



  // -----------------------------------------------------------------------

  public getAccount(wallet: SimpleWallet): Observable<Account> {
    return new Observable(observer => {
      // Get user's password and unlock the wallet to get the account
      this.authProvider.getPassword().then(password => {
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
   * 
   * @param wallet 
   * @param newWalletName 
   * @param walletColor 
   */
  public updateWalletName(wallet: SimpleWallet, newWalletName: string, walletColor: string) {
    return this.getLocalWallets().then(wallets => {
      let _catapultAccounts: any = wallets.catapultAccounts;
      let _nis1Accounts: any = wallets.nis1Accounts;
      let updateWallet: any;
      for (let i = 0; i < _catapultAccounts.length; i++) {

        if (_catapultAccounts[i].account.name == wallet.name) {
          _catapultAccounts[i].account.name = newWalletName;
          _catapultAccounts[i].walletColor = walletColor;
          updateWallet = _catapultAccounts[i];
        };
      }
      for (let i = 0; i < _nis1Accounts.length; i++) {

        if (_nis1Accounts[i].account.name == wallet.name) {
          _nis1Accounts[i].account.name = newWalletName;
          _nis1Accounts[i].walletColor = walletColor;
        };
      }

      let _wallets = {
        catapultAccounts: _catapultAccounts,
        encrypted: wallets.encrypted,
        nis1Accounts: _nis1Accounts,
        user: wallets.user
      }

      let WALLET = [];
      WALLET.push(_wallets);
      this.storage.set('selectedWallet', _wallets);
      this.storage.set('selectedWallet', _wallets);
      return this.storage.set('wallets', WALLET).then(_ => {
        return updateWallet;
      });
    });
  }

  deleteWallet(wallet: SimpleWallet) {
    console.log('....................', wallet);

    // LI

    // return this.getWalletSelected().then(wallets => {
    //   console.log('....................wallets', wallets);

    //   let _wallets: Array<any> = wallets.catapultAccounts;

    //   _wallets.map((res, index) => {
    //     if (res.account.name == wallet['account'].name) {
    //       _wallets.splice(index, 1);

    //       _wallets = _wallets.map(_ => {
    //         return {
    //           wallet: _.wallet,
    //           walletColor: _.walletColor
    //         }
    //       });
    //       // const WALLET = {};
    //       const  WALLET= _wallets;
    //       return this.storage.set('selectedAccount', WALLET);
    //     }
    //   })
    //   _wallets
    //   return;




    // });
  }

  /**
   * Check If Wallet Name Exists
   * @param walletName
   * @return Promise that resolves a boolean if exists
   */
  public checkIfWalletNameExists(walletName: string, walletAddress: string): Promise<boolean> {
    let exists = false;
    return this.getLocalWallets().then(wallets => {
      let _catapultAccounts: any = wallets.catapultAccounts;
      for (var i = 0; i < _catapultAccounts.length; i++) {
        if (_catapultAccounts[i].account.name === walletName || _catapultAccounts[i].account.address.address === walletAddress) {
          exists = true;
          break;
        }
      }
      return exists;
    });
  }



  /**
   * Get loaded wallets from localStorage
   */
  public getLocalWallets(): Promise<any> {
    return this.storage.get('wallets').then(wallets => {
      let complete = wallets[0]
      let _wallets = wallets[0].catapultAccounts ? wallets[0].catapultAccounts : {};
      const WALLETS = _wallets ? _wallets : [];
      if (wallets) {
        const walletsMap = WALLETS.map(walletFile => {
          return { account: <SimpleWallet>(walletFile.account), publicAccount: walletFile.publicAccount, walletColor: walletFile.walletColor };
        });
        _wallets = {
          catapultAccounts: walletsMap,
          encrypted: complete.encrypted,
          nis1Accounts: complete.nis1Accounts,
          user: complete.user
        }
      } else {
        _wallets = [];
      }
      return _wallets;
    });
  }

  /**
   * Get loaded wallets from localStorage
   */

  /**
   * Remove selected Wallet
   */
  public unsetSelectedWallet() {
    return this.getWalletSelected().then(dataAccountSelected => {
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


export interface WalletInterface {
  user: string;
  encrypted: string;
  catapultAccounts: CatapultsAccountsInterface[],
  nis1Accounts: NIS1AccountsInterface[]
}

export interface CatapultsAccountsInterface {
  account: SimpleWallet,
  publicAccount: PublicAccount,
  walletColor: string
}

export interface NIS1AccountsInterface {
  account: SimpleWalletNIS1,
  publicAccount: PublicAccountNIS1,
  publicAccountCatapult: PublicAccount,
  walletColor: string
}