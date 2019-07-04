import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DateTime } from 'luxon';
import { Base64 } from 'js-base64';
import { SimpleWallet, NetworkTypes } from 'nem-library';

import { findIndex } from 'lodash';

import { AuthProvider } from '../auth/auth';

/*
 Generated class for the NemProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class WalletProvider {
  wallets: SimpleWallet[];

  constructor(private storage: Storage, private authProvider: AuthProvider) {}

  /**
   * Store wallet
   * @param wallet
   * @return Promise with stored wallet
   */
  public storeWallet(wallet: SimpleWallet, walletColor): Promise<SimpleWallet> {
    let result = [];
    return this.authProvider.getEmail().then(email => {
      return this.getAccounts().then(value => {
        let accounts = value;
        result = accounts[email];
        result.push({wallet: wallet, walletColor: walletColor});
        result = result.map(_ => {
          return {
            wallet: _.wallet.writeWLTFile(),
            walletColor: _.walletColor
          }
        });

        accounts[email] = result;


        this.storage.set('wallets', accounts);
        return wallet;
      });
    });
  }

  // =======
  // Wallets
  // =======

  /**
   * Update the wallet name of the given wallet.
   * @param wallet The wallet to change the name.
   * @param newWalletName The new name for the wallet.
   */
  public updateWalletName(wallet: SimpleWallet, newWalletName: string, walletColor:string) {
    console.log(walletColor);
    // return;
    return this.authProvider.getEmail().then(email => {
      return this.getAccounts().then(accounts => {
        let wallets: any = accounts[email];
        let updateWallet :any;
        for(let i=0; i<wallets.length; i++) {
          if(wallets[i].wallet.name == wallet.name) {
            wallets[i].wallet.name = newWalletName;
            wallets[i].walletColor = walletColor;
            updateWallet= wallets[i];
          };

        }

        

        wallets = wallets.map(_ => {
          return {
            wallet: _.wallet.writeWLTFile(),
            walletColor: _.walletColor
          }
        });

        let ACCOUNT = {};
        ACCOUNT[email] = wallets;

        return this.storage.set('wallets', ACCOUNT).then(value => {
          return updateWallet;
        });
      });
    });
  }

  deleteWallet(wallet: SimpleWallet) {
    
    return this.authProvider.getEmail().then(email => {
      return this.getAccounts().then(value => {
        let result: Array<any> = value[email];

        console.log(result, wallet);
        result.map((res,index)=> {
          if (res.wallet.name == wallet.name) {
            console.log("Deleting your wallet: ", wallet.name)
            result.splice(index, 1);

            result = result.map(_ => {
              return {
                wallet: _.wallet.writeWLTFile(),
                walletColor: _.walletColor
              }
            });

            let ACCOUNT = {};
            ACCOUNT[email] = result;

            return this.storage.set('wallets', ACCOUNT);
          }
        })
        result
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

    return this.authProvider.getEmail().then(email => {
      return this.getAccounts().then(wallets => {
        const WALLETS = wallets[email];
        for (var i = 0; i < WALLETS.length; i++) {
          if (WALLETS[i].wallet.name === walletName) {
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
    return this.authProvider.getEmail().then(email => {
      return this.storage.get('selectedWallet').then(wallets => {
        let result = null;
        if (wallets) {
          const selectedWallet = wallets[email];
          result = SimpleWallet.readFromWLT(selectedWallet);
        } else {
          result = {};
        }

        return result;
      });
    });
  }

  /**
   * Get loaded wallets from localStorage
   */
  public getAccounts(): Promise<any> {
    return this.authProvider.getEmail().then(email => {
      return this.storage.get('wallets').then(wallets => {
        let _wallets = wallets ? wallets : {};
				console.log("LOG: WalletProvider -> constructor -> _wallets", _wallets)
        const ACCOUNT_WALLETS = _wallets[email] ? _wallets[email] : [];

        if (wallets) {
          const walletsMap = ACCOUNT_WALLETS.map(walletFile => {
            if (walletFile.name) {
              return this.convertJSONWalletToFileWallet(walletFile, walletFile.walletColor);
            } else {
              return { wallet:SimpleWallet.readFromWLT(walletFile.wallet), walletColor: walletFile.walletColor};
            }
          });

          _wallets[email] = walletsMap;
        } else {
          _wallets[email] = [];
        }

        return _wallets;
      });
    });
  }

  /**
   * Get loaded wallets from localStorage
   */
  public getWallets(): Promise<any> {
    return this.authProvider.getEmail().then(email => {
      return this.storage.get('wallets').then(wallets => {
				console.log("LOG: WalletProvider -> constructor -> data", wallets)
        let _wallets = wallets || {};
        const ACCOUNT_WALLETS = _wallets[email] ? _wallets[email] : [];
				console.log("LOG: WalletProvider -> constructor -> ACCOUNT_WALLETS", ACCOUNT_WALLETS)

        if (ACCOUNT_WALLETS) {
          const walletsMap = ACCOUNT_WALLETS.map(walletFile => {
            if (walletFile.name) {
              return this.convertJSONWalletToFileWallet(walletFile, walletFile.walletColor);
            } else {
              let wallet = SimpleWallet.readFromWLT(walletFile.wallet);
              wallet.walletColor = walletFile.walletColor;
              return wallet ;
            }
          });

          _wallets[email] = walletsMap;
        } else {
          _wallets[email] = [];
        }

        return _wallets[email];
      });
    });
  }

  private convertJSONWalletToFileWallet(wallet, walletColor): SimpleWallet {
    let walletString = Base64.encode(
      JSON.stringify({
        address: wallet.accounts[0].address,
        creationDate: DateTime.local().toString(),
        encryptedPrivateKey: wallet.accounts[0].encrypted,
        iv: wallet.accounts[0].iv,
        network:
          wallet.accounts[0].network == -104
            ? NetworkTypes.TEST_NET
            : NetworkTypes.MAIN_NET,
        name: wallet.name,
        type: 'simple',
        schema: 1,
      })
    );
    let importedWallet = SimpleWallet.readFromWLT(walletString);
    importedWallet.walletColor = walletColor;
    return importedWallet;
  }

  /**
   * Set a selected wallet
   */
  public setSelectedWallet(wallet: SimpleWallet) {
    return Promise.all([
      this.authProvider.getEmail(),
      this.storage.get('selectedWallet')
    ]).then(results => {
      const EMAIL = results[0];
      const SELECTED_WALLET = results[1] ? results[1] : {};
      SELECTED_WALLET[EMAIL] = wallet.writeWLTFile();

      return this.storage.set('selectedWallet', SELECTED_WALLET);
    });
  }

  /**
   * Remove selected Wallet
   */
  public unsetSelectedWallet() {
    return this.authProvider.getEmail().then(email => {
      this.storage.get('selectedWallet').then(selectedWallet => {
        delete selectedWallet[email];

        this.storage.set('selectedWallet', selectedWallet);
      });
    });
  }
}
