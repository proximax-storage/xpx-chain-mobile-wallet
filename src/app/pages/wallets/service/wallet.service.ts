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
    return this.proximaxProvider.getAccountInfo(addres)
  }


  formatterAmount(amount: number, divisibility: number) {
    const amountDivisibility = Number(amount / Math.pow(10, divisibility));
    return (amountDivisibility).toLocaleString('en-us', { minimumFractionDigits: divisibility });
  }

  amountFormatterSimple(amount: Number) {
    const amountDivisibility = Number(amount) / Math.pow(10, 6);
    return (amountDivisibility).toLocaleString('en-us', { minimumFractionDigits: 6 });
    }
  // getBalance(address) {
  //   console.log('llegando al service');
  //   return this.proximaxProvider.getAccountInfo(address);
  // }
}
