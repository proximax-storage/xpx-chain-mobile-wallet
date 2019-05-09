import { Injectable } from '@angular/core';
import { Password, SimpleWallet } from 'proximax-nem2-sdk'

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() { }


/**
 * 
 * @param value this is password the usermane
 */
  static CreatePassword(value){
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
  static CreateSimpleWallet(name:string, password:Password, network:number){
    return SimpleWallet.create(name, password, network);

  }
}
