import { Injectable } from '@angular/core';
import { Password, SimpleWallet } from 'proximax-nem2-sdk';
import { commonInterface, walletInterface } from './interfaces/shared.interfaces';
import { crypto } from 'proximax-nem2-library';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() { }

/**
 * 
 * @param value this is password the usermane
 */
  static createPassword(value){
    const password = new Password(value)
    return password;
  }

    /**
   * Method to create a simple wallet
   *
   * @param {string} user this is the username of wallet
   * @param {Password} password this a password created with createPassword function
   * @param {number} network this is a network type to create simple account
   */
  static createSimpleWallet(name:string, password:Password, network:number) {
    return SimpleWallet.create(name, password, network);

  }

    /**
   * Create account from private key
   *
   * @param {string} nameWallet
   * @param {Password} password
   * @param {string} privateKey
   * @param {number} network
   * @returns {SimpleWallet}
   * @memberof NemProvider
   */
  static createAccountFromPrivateKey(nameWallet: string, password: Password, privateKey: string, network: number): SimpleWallet {
    return SimpleWallet.createFromPrivateKey(nameWallet, password, privateKey, network);
  }

     /**
  * Decrypt and return private key
  * @param password
  * @param encryptedKey
  * @param iv
  */
 static decryptPrivateKey(password: Password, encryptedKey: string, iv: string): string {
   const common: commonInterface = {
     password: password.value,
     privateKey: ''
   };

   const wallet: walletInterface = {
     encrypted: encryptedKey,
     iv: iv,
   };

   crypto.passwordToPrivatekey(common, wallet, 'pass:bip32');
   return common.privateKey;
 }
}
