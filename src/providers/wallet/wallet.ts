import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AuthProvider } from '../auth/auth';
import { SimpleWallet, Password, Address, EncryptedPrivateKey, 
  AccountInfo, MosaicAmountView, NetworkType, PublicAccount, TransferTransaction,
  Deadline, PlainMessage, Mosaic, MosaicId, UInt64, Account, TransactionHttp, } from 'tsjs-xpx-chain-sdk';
import { ProximaxProvider } from '../proximax/proximax';
import { Observable } from 'rxjs';
import { crypto } from 'js-xpx-chain-library';
import { AppConfig } from '../../app/app.config';

/*
 Generated class for the NemProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class WalletProvider {
  wallet: any;
  publicAccount: PublicAccount;
  wallets: SimpleWallet[];

  constructor(private storage: Storage, private authProvider: AuthProvider, private proximaxProvider: ProximaxProvider) {;
  }

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

  public createAccountFromPrivateKey(
    { walletName, password, privateKey }: 
    { walletName: string; password: string; privateKey: string; }): 
    SimpleWallet {
    return this.proximaxProvider.createAccountFromPrivateKey(walletName, new Password(password), privateKey);
  }

  public getAccount(wallet: SimpleWallet) : Observable<Account> {
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

  public getAccountInfo(address: string) : Observable<AccountInfo> {
    return this.proximaxProvider.getAccountInfo(Address.createFromRawAddress(address));
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
   * @param wallet
   * @return Promise with stored wallet
   */
  public storeWallet(wallet: SimpleWallet, walletColor): Promise<SimpleWallet> {
    let result = [];
    return this.authProvider.getUsername().then(username => {
      return this.getLocalWallets().then(value => {
        let wallets = value;
        result = wallets[username];

        result.push({wallet: wallet, walletColor: walletColor});

        wallets[username] = result;


        this.storage.set('wallets', wallets);
        return wallet;
      });
    });
  }

  /**
   * Update the wallet name of the given wallet.
   * @param wallet The wallet to change the name.
   * @param newWalletName The new name for the wallet.
   */
  public updateWalletName(wallet: SimpleWallet, newWalletName: string, walletColor:string) {
    console.log(walletColor);
    // return;
    return this.authProvider.getUsername().then(username => {
      return this.getLocalWallets().then(wallets => {
        let _wallets: any = wallets[username];
        let updateWallet :any;
        for(let i=0; i<_wallets.length; i++) {
          if(_wallets[i].wallet.name == wallet.name) {
            _wallets[i].wallet.name = newWalletName;
            _wallets[i].walletColor = walletColor;
            updateWallet= _wallets[i];
          };

        }

        

        _wallets = _wallets.map(_ => {
          return {
            wallet: _.wallet,
            walletColor: _.walletColor
          }
        });

        const WALLET = {};
        WALLET[username] = _wallets;

        return this.storage.set('wallets', WALLET).then(_ => {
          return updateWallet;
        });
      });
    });
  }

  deleteWallet(wallet: SimpleWallet) {
    
    return this.authProvider.getUsername().then(username => {
      return this.getLocalWallets().then(wallets => {
        let _wallets: Array<any> = wallets[username];

        console.log(_wallets, wallet);
        _wallets.map((res,index)=> {
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
            WALLET[username] = _wallets;

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
  public checkIfWalletNameExists(walletName: string): Promise<boolean> {
    let exists = false;

    return this.authProvider.getUsername().then(username => {
      return this.getLocalWallets().then(wallets => {
        const _wallets = wallets[username];
        for (var i = 0; i < _wallets.length; i++) {
          if (_wallets[i].wallet.name === walletName) {
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
    return this.authProvider.getUsername().then(username => {
      return this.storage.get('selectedWallet').then(wallets => {
        let _wallet = null;
        if (wallets) {
          const selectedWallet = wallets[username];
          _wallet = <SimpleWallet>(selectedWallet);
        } else {
          _wallet = {};
        }

        return _wallet;
      });
    });
  }

  /**
   * Get loaded wallets from localStorage
   */
  public getLocalWallets(): Promise<any> {
    return this.authProvider.getUsername().then(username => {
      return this.storage.get('wallets').then(wallets => {
        let _wallets = wallets ? wallets : {};
				console.log("LOG: WalletProvider -> constructor -> _wallets", _wallets)
        const WALLETS = _wallets[username] ? _wallets[username] : [];

        if (wallets) {
          const walletsMap = WALLETS.map(walletFile => {
            if (walletFile.name) {
              return 
              // this.convertJSONWalletToFileWallet(walletFile, walletFile.walletColor);
            } else {
              return { wallet:<SimpleWallet>(walletFile.wallet), walletColor: walletFile.walletColor};
            }
          });

          _wallets[username] = walletsMap;
        } else {
          _wallets[username] = [];
        }

        return _wallets;
      });
    });
  }

  /**
   * Get loaded wallets from localStorage
   */
  public getWallets(): Promise<any> {
    return this.authProvider.getUsername().then(username => {
    console.log("SIRIUS CHAIN WALLET: WalletProvider -> username", username)
      return this.storage.get('wallets').then(wallets => {
        console.log("LOG: WalletProvider -> constructor -> data", wallets)
        let _wallets = wallets || {};
        const WALLETS = _wallets[username] || [];
        console.log("LOG: WalletProvider -> constructor -> ACCOUNT_WALLETS", WALLETS)
        this.wallet = WALLETS[0].wallet.address

        console.log("LOG: WalletProvider ->  -> this.wallet", this.wallet)

        if (WALLETS) {
          const walletsMap = WALLETS.map(walletFile => {
          console.log("SIRIUS CHAIN WALLET: WalletProvider -> walletFile", walletFile)
            
            if (walletFile.name) {
              return 
              // this.convertJSONWalletToFileWallet(walletFile, walletFile.walletColor);
            } else {
              let wallet = walletFile.wallet as SimpleWallet;
              wallet.walletColor = walletFile['walletColor'];
              return wallet ;
            }
          });

          _wallets[username] = walletsMap;
        } else {
          _wallets[username] = [];
        }

        return _wallets[username];
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
      this.authProvider.getUsername(),
      this.storage.get('selectedWallet')
    ]).then(results => {
      const EMAIL = results[0];
      const SELECTED_WALLET = results[1] ? results[1] : {};
      SELECTED_WALLET[EMAIL] = wallet;

      return this.storage.set('selectedWallet', SELECTED_WALLET);
    });
  }

  /**
   * Remove selected Wallet
   */
  public unsetSelectedWallet() {
    return this.authProvider.getUsername().then(email => {
      this.storage.get('selectedWallet').then(selectedWallet => {
        delete selectedWallet[email];

        this.storage.set('selectedWallet', selectedWallet);
      });
    });
  }


  decrypt(common: any, current: any, account: any = '', algo: any = '', network: any = '') {
    const acct = current;
    const net = NetworkType.TEST_NET;
    const alg = 'pass:bip32';
    const walletAccount = {
      encrypted: current.encryptedPrivateKey.encryptedKey,
      iv: current.encryptedPrivateKey.iv
    }
    // Try to generate or decrypt key
    if (!crypto.passwordToPrivatekey(common, walletAccount, alg)) {
      // console.log('passwordToPrivatekeyy ')
      setTimeout(() => {
        console.log('Error Invalid password')
        // this.sharedService.showError('Error', '¡Invalid password!');
      }, 500);
      return false;
    }
    if (common.isHW) {
      return true;
    }
    // console.log('pase common.common ', common.privateKey)
    // console.log('pase common.net ', net)
    // console.log('pase common.acct.address ', acct.address.address)
    if (!this.isPrivateKeyValid(common.privateKey) || !this.proximaxProvider.checkAddress(common.privateKey, net, acct.address.address)) {
      setTimeout(() => {
        console.log('Error Invalid password')
        // this.sharedService.showError('Error', '¡Invalid password!');
      }, 500);
      return false;
    }
    // console.log('!this.isPrivateKeyValid......')
    //Get public account from private key
    this.publicAccount = this.proximaxProvider.getPublicAccountFromPrivateKey(common.privateKey, net);
    // console.log('this.publicAccount ', this.publicAccount )
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
    mosaic: string | number[]
  ) {
    const recipientAddress = this.proximaxProvider.createFromRawAddress(recipient);
    const transferTransaction = TransferTransaction.create(Deadline.create(5), recipientAddress,
      [new Mosaic(new MosaicId(mosaic), UInt64.fromUint(Number(amount)))], PlainMessage.create(message), network
    );
    const account = Account.createFromPrivateKey(common.privateKey, network);
    const signedTransaction = account.sign(transferTransaction)
    // const transactionHttp = new TransactionHttp(
    //   AppConfig.sirius.httpNodeUrl
    // );
    return {
      signedTransaction: signedTransaction,
      transactionHttp: this.proximaxProvider.transactionHttp
    };
  }

}
