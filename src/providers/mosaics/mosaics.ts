import {Injectable} from '@angular/core';
import {Mosaic, SimpleWallet} from 'tsjs-xpx-chain-sdk';
import {CoingeckoProvider} from "../coingecko/coingecko";
import { Observable } from 'rxjs';

/*
  Generated class for the MosaicsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MosaicsProvider {
  defaultMosaics = Array<DefaultMosaic>();

  constructor(private coingeckoProvider: CoingeckoProvider) {
    console.log('Hello MosaicsProvider Provider');
    this.defaultMosaics = [
      {
        namespaceId: 'prx',
        mosaicId: 'xpx',
        hex: '0dc67fbe1cad29e3', // need to be manually configured
        amount: 0
      },
      {
        namespaceId: 'pundix',
        mosaicId: 'npxs',
        hex: '06a9f32c9d3d6246',
        amount: 0
      },
      {
        namespaceId: 'sportsfix',
        mosaicId: 'sft',
        hex: '1292a9ed863e7aa9',
        amount: 0
      },
      {
        namespaceId: 'xarcade',
        mosaicId: 'xar',
        hex: '2dba42ea2b169829',
        amount: 0
      }
    ];
  }

  public mosaics(): Observable<Array<DefaultMosaic>> {
    return new Observable(observer => {
      observer.next(this.defaultMosaics);
    });
  }

  public setMosaicInfo(mosaic: Mosaic): DefaultMosaic {
    let modifiedMosaic: DefaultMosaic = null;
    const obj:any;
    
    modifiedMosaic= this.defaultMosaics.find(defaultMosaic=>{
      return defaultMosaic.hex == mosaic.id.toHex();
    });
    
    if(modifiedMosaic) {
      modifiedMosaic.amount = this.getRelativeAmount(mosaic.amount.compact());
      return modifiedMosaic;
    } else {
      console.log("LOG: MosaicsProvider -> mosaic", mosaic);
     
      obj.amount = 0;
      obj.hex = mosaic.id.toHex();
      obj.mosaicId = mosaic.id.toHex();
      obj.namespaceId = mosaic.id.toHex();
      return obj as DefaultMosaic;
    }

  }

  private getRelativeAmount(amount: number): number {
    return amount / Math.pow(10, 6)
  }

  public getMosaicInfo(mosaic: Mosaic) {
    return this.defaultMosaics.find(defaultMosaic => {
      return defaultMosaic.hex == mosaic.id.toHex();
    });
  }
  
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
      }).catch(() => {
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
