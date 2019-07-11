import { NemProvider } from './../nem/nem';
import { Injectable } from '@angular/core';

import {
  Address,
  MosaicTransferable,
  MosaicId,
  MosaicProperties,
  SimpleWallet,
} from 'nem-library';
import { Observable } from 'rxjs/Observable';

import findIndex from 'lodash/findIndex';
import { CoingeckoProvider } from '../coingecko/coingecko';
import { Mosaic } from 'tsjs-xpx-chain-sdk';

/*
  Generated class for the MosaicsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MosaicsProvider {
  defaultMosaics = Array<DefaultMosaic>();

  constructor(private nemProvider: NemProvider, private coingeckoProvider: CoingeckoProvider,) {
    console.log('Hello MosaicsProvider Provider');
    this.defaultMosaics = this.generateInitialMosaics();
  }

  private generateInitialMosaics(): Array<DefaultMosaic> {
    const initialMosaics = [
      {
        namespaceId: 'prx',
        mosaicId: 'xpx',
        hex: '0dc67fbe1cad29e3', // need to be manually configured
        amount: 0
      },
      {
        namespaceId: 'pundix',
        mosaicId: 'npxs',
        hex: '',
        amount: 0
      },
      {
        namespaceId: 'sportsfix',
        mosaicId: 'sft',
        hex: '',
        amount: 0
      },
      {
        namespaceId: 'xarcade',
        mosaicId: 'xar',
        hex: '',
        amount: 0
      }
    ]
    return initialMosaics;
  }

  public mosaics(): Observable<Array<DefaultMosaic>> {
    return new Observable(observer => {
      observer.next(this.defaultMosaics);
    });
  }

  public setMosaicInfo(mosaic: Mosaic): DefaultMosaic {
    let modifiedMosaic = this.defaultMosaics.find(defaultMosaic=>{
      return defaultMosaic.hex == mosaic.id.toHex();
    })
    
    if(modifiedMosaic) {
      modifiedMosaic.amount = this.getRelativeAmount(mosaic.amount.compact());
    }
    return modifiedMosaic;
  }

  public getRelativeAmount(amount: number): number {
    return amount / Math.pow(10, 6)
  }

  private swap(arr, indexA, indexB) {
    // console.info("Before", arr);
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
    // console.info("After", arr);
    return arr;
  };
  

  totalBalance(wallet: SimpleWallet): Promise<number> {
    return new Promise((resolve) => {
      // this.mosaics(wallet.address)
      //   .subscribe(mosaics => {
      //     const MOSAICS = mosaics;
      //     let total = 0;

      //     let promises = MOSAICS.map(async (mosaic, index, array)=>{
      //       // console.clear();
      //       const price = await this.getCoinPrice(mosaic.mosaicId.name);
      //       return price * mosaic.amount;
      //     })

      //     function getSum(total, num) {
      //       return total + num;
      //     }

      //     Promise.all(promises).then(function(results) {
      //       // console.log("Mosaics", results);
      //       let temp = results.reduce(getSum);
      //       // console.info("tempTotal", temp);
      //       resolve(temp);
      //   })
      //   });
    });
  }

   getCoinPrice(value: string, ...args) {
    let coinId:string;

    if (value === 'xem') {
      coinId = 'nem';
    } else if (value === 'xpx') {
      coinId = 'proximax';
    } else if (value === 'npxs') {
      coinId = 'pundi-x';
    } 
    // Add more coins here
    
    if(coinId != undefined) {
      // console.log("CoinId",coinId)
      return this.coingeckoProvider
      .getDetails(coinId)
      .toPromise()
      .then(details => {
        return details.market_data.current_price.usd;
      }).catch(err => {
        return returnZero();
      })
    } else {
      return returnZero();
    }

    async function returnZero() {
      // Wait one second
      await new Promise(r => setTimeout(r, 1000));
      // Toss a coin
      return 0;
    }

  }


}
