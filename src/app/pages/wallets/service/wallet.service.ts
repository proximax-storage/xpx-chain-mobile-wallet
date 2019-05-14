import { Injectable } from '@angular/core';
import { ProximaxProvider } from '../../../providers/proximax.provider'

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private proximaxProvider: ProximaxProvider
  ) { }

  getAccountInfo(address) {
    
    const addres = this.proximaxProvider.createFromRawAddress(address);
    console.log('llegando al service', addres);
    return this.proximaxProvider.getAccountInfo(addres);
  }

  // getBalance(address) {
  //   console.log('llegando al service');
  //   return this.proximaxProvider.getAccountInfo(address);
  // }
}
