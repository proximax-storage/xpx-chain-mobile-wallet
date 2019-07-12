import { NemProvider } from './../nem/nem';
import { Injectable } from '@angular/core';

import {
  Address,
  MosaicId,
  MosaicProperties,
  SimpleWallet,
  MosaicAmountView,
  Mosaic,
} from 'tsjs-xpx-chain-sdk';
import { Observable } from 'rxjs';

import findIndex from 'lodash/findIndex';
import { CoingeckoProvider } from '../coingecko/coingecko';

/*
  Generated class for the GetBalanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetBalanceProvider {
  constructor(private nemProvider: NemProvider, private coingeckoProvider: CoingeckoProvider,) {
    console.log('Hello GetBalanceProvider Provider');
  }

  private generateInitialMosaics(): Array<Mosaic> {
    return [];

    // ProximaX
    // const XPX_MOSAIC_ID = new MosaicId('prx', 'xpx');
    // const XPX_MOSAIC_PROPERTIES = new MosaicProperties(
    //   6, //TODO
    //   9000000000,
    //   true,
    //   false
    // );
    // const XPX = new MosaicAmountView(XPX_MOSAIC_ID, XPX_MOSAIC_PROPERTIES, 0);

    // // PUNDIX
    // const NPXS_MOSAIC_ID = new MosaicId('pundix', 'npxs');
    // const NPXS_MOSAIC_PROPERTIES = new MosaicProperties(
    //   6, //TODO
    //   9000000000,
    //   true,
    //   false
    // );
    // const NPXS = new MosaicTransferable(NPXS_MOSAIC_ID, NPXS_MOSAIC_PROPERTIES, 0);

    // // SPORTSFIX
    // const SFT_MOSAIC_ID = new MosaicId('sportsfix', 'sft');
    // const SFT_MOSAIC_PROPERTIES = new MosaicProperties(
    //   6, //TODO
    //   9000000000,
    //   true,
    //   false
    // );
    // const SFT = new MosaicTransferable(SFT_MOSAIC_ID, SFT_MOSAIC_PROPERTIES, 0);

    // // XARCADE
    // const XAR_MOSAIC_ID = new MosaicId('xarcade', 'xar');
    // const XAR_MOSAIC_PROPERTIES = new MosaicProperties(
    //   6, //TODO
    //   9000000000,
    //   true,
    //   false
    // );
    // const XAR = new MosaicTransferable(XAR_MOSAIC_ID, XAR_MOSAIC_PROPERTIES, 0);

    // return [XPX, NPXS, SFT, XAR];
  }

  mosaics(address: Address): Observable<Array<Mosaic>> {
    const XPX = this.generateInitialMosaics()[0];
    const NPXS = this.generateInitialMosaics()[1];
    const SFT = this.generateInitialMosaics()[2];
    const XAR = this.generateInitialMosaics()[3];


    return new Observable(observer => {
      // this.nemProvider
      //   .getBalance(address)
      //   .then((mosaics: Array<MosaicTransferable>) => {

      //     const XPX_INDEX = findIndex(mosaics, {
      //       mosaicId: { namespaceId: 'prx', name: 'xpx' }
      //     });

      //     const NPXS_INDEX = findIndex(mosaics, {
      //       mosaicId: { namespaceId: 'pundix', name: 'npxs' }
      //     });

      //     const SFT_INDEX = findIndex(mosaics, {
      //       mosaicId: { namespaceId: 'sportsfix', name: 'sft' }
      //     });

      //     const XAR_INDEX = findIndex(mosaics, {
      //       mosaicId: { namespaceId: 'xarcade', name: 'xar' }
      //     });


            
      //       if (XPX_INDEX < 0) {
      //         mosaics.splice(0, 0, XPX);
      //       } else {
      //         mosaics = this.swap(mosaics, XPX_INDEX, 0);

      //         // const XEM_INDEX = findIndex(mosaics, {
      //         //   mosaicId: { namespaceId: 'prx', name: 'xpx' }
      //         // });
  
      //         // if (XEM_INDEX > 0) {
      //           mosaics = this.swap(mosaics, mosaics.length-1, 1);
      //         // }
      //       }

      //       if (NPXS_INDEX < 0) {
      //         mosaics.splice(2, 0, NPXS);
      //       } else {
      //         mosaics = this.swap(mosaics, NPXS_INDEX, 0);
      //       }

      //       if (SFT_INDEX < 0) {
      //         mosaics.splice(3, 0, SFT);
      //       } else {
      //         mosaics = this.swap(mosaics, SFT_INDEX, 0);
      //       }

      //       if (XAR_INDEX < 0) {
      //         mosaics.splice(4, 0, XAR);
      //       } else {
      //         mosaics = this.swap(mosaics, XAR_INDEX, 0);
      //       }

           

      //     // return only 5 mosaics
      //     observer.next(mosaics.slice(0, 5));
      //     // observer.next(mosaics);



          




    //     })
    //     .catch(observer.error);
    });
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
      this.mosaics(wallet.address)
        .subscribe(mosaics => {
          const MOSAICS = mosaics;
          let total = 0;

          let promises = MOSAICS.map(async (mosaic, index, array)=>{
            // console.clear();
            const price = await this.getCoinPrice(mosaic.id.toHex());
            return price * mosaic.amount.compact();
          })

          function getSum(total, num) {
            return total + num;
          }

          Promise.all(promises).then(function(results) {
            // console.log("Mosaics", results);
            let temp = results.reduce(getSum);
            // console.info("tempTotal", temp);
            resolve(temp);
        })
        });
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
