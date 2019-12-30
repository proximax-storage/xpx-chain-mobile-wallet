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
  PublicAccount,
  Account,
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
  selectesAccount: any;

  constructor(
    private authProvider: AuthProvider,
    private nemProvider: NemProvider,
    private proximaxProvider: ProximaxProvider,
    private storage: Storage,
  ) {
    this.httpUrl = AppConfig.sirius.httpNodeUrl;
  }


  /**
 * Check If Wallet Name Exists
 * @param walletName
 * @return Promise that resolves a boolean if exists
 */
  checkIfWalletNameExists(walletName: string, walletAddress: string): Promise<boolean> {
    let exists = false;
    return this.getLocalWallets().then(wallets => {
      if (wallets.length != 0) {
        let _catapultAccounts: any = wallets.catapultAccounts;
        for (var i = 0; i < _catapultAccounts.length; i++) {
          if (_catapultAccounts[i].account.name === walletName || _catapultAccounts[i].account.address.address === walletAddress) {
            exists = true;
            break;
          }
        }
      } else {
        exists = false;
      }
      return exists;
    });
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
    const data = await this.storage.get('myWallets');
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
      return this.storage.set('myWallets', wallets);
    }
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

  deleteWallet(wallet: SimpleWallet) {
    return this.getLocalWallets().then(wallets => {
      let _catapultAccounts: any = wallets.catapultAccounts;
      let _nis1Accounts: any = wallets.nis1Accounts;

      _catapultAccounts.map((res, index) => {
        if (res.account.name == wallet['account'].name) {
          _catapultAccounts.splice(index, 1);
        }
      });

      _nis1Accounts.map((res, index) => {
        if (res.account.name == wallet['account'].name) {
          _nis1Accounts.splice(index, 1);
        }
      });

      let _wallets = {
        catapultAccounts: _catapultAccounts,
        encrypted: wallets.encrypted,
        nis1Accounts: _nis1Accounts,
        user: wallets.user
      }

      let walletsDeleted = [];
      walletsDeleted.push(_wallets);
      this.storage.set('selectedAccount', _catapultAccounts[0]);
      this.storage.set('selectedWallet', _wallets);
      this.storage.set('myWallets', walletsDeleted)
      return;
    });
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
    this.selectesAccount = data;
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
    return (walletSelected && walletSelected.catapultAccounts) ? walletSelected.catapultAccounts : [];
  }

  /**
 * Get Wallet Local
 * @return Promise that returns wallets
 */
  public getLocalWallets(): Promise<any> {
    return this.storage.get('myWallets').then(wallets => {
      let complete = wallets[0]
      let _wallets = wallets[0].catapultAccounts ? wallets[0].catapultAccounts : {};
      const WALLETS = _wallets ? _wallets : [];
      if (wallets[0].catapultAccounts != null) {
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
      } else {
        _wallets = [];
      }
      return _wallets;
    });
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
   * @param {SimpleWallet} wallet
   * @param {string} walletColor
   * @returns {Promise<dataAccount>}
   * @memberof WalletProvider
   */
  async storeWalletCatapult(catapultAccount: SimpleWallet, nis1Account: SimpleWalletNIS1, walletColor: string, password: Password, prefix: string): Promise<WalletInterface> {
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

      console.log('publicAccountNis1', publicAccountNis1);
      

      const accountnis1 = {
        account: nis1Account,
        prefix: prefix,
        walletColor: walletColor,
        publicAccount: publicAccountNis1,
        publicAccountCatapult: publicAccount
      };

      nis1Accounts.push(accountnis1);
      walletSelected['nis1Accounts'] = nis1Accounts;
      const x= this.proximaxProvider.decryptPrivateKey(
        password,
        catapultAccount.encryptedPrivateKey.encryptedKey,
        catapultAccount.encryptedPrivateKey.iv
      )

      console.log('#####____________', x);
      
    }

    const accountCatapult = { account: catapultAccount, walletColor: walletColor, publicAccount: publicAccount }
    catapultAccounts.push(accountCatapult);
    walletSelected['catapultAccounts'] = catapultAccounts;
    const wallet: WalletInterface[] = await this.storage.get('myWallets');
    const otherWallets: WalletInterface[] = wallet.filter(x => x.user !== walletSelected.user);
    otherWallets.push(walletSelected);
    this.setSelectedAccount(accountCatapult);
    this.setSelectedWallet(walletSelected);
    this.storage.set('myWallets', otherWallets);
    return walletSelected;
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

  /**
  * 
  * @param wallet 
  * @param newWalletName 
  * @param walletColor 
  */
  updateWalletName(wallet: SimpleWallet, newWalletName: string, walletColor: string) {
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

      let walletsUpdate = [];
      walletsUpdate.push(_wallets);
      this.storage.set('selectedAccount', updateWallet);
      this.storage.set('selectedWallet', _wallets);
      this.storage.set('myWallets', walletsUpdate)
      return;
    });
  }


  /**
   *
   *
   * @param {SimpleWallet} account
   * @memberof WalletProvider
   */
  async validateExistAccount(account: SimpleWallet) {
    const wallet: WalletInterface[] = await this.storage.get('myWallets');
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