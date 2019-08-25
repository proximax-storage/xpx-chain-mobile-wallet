import { Pipe, PipeTransform } from '@angular/core';
import { CoingeckoProvider } from '../../providers/coingecko/coingecko';

/**
 * Generated class for the GetMarketPricePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'getMarketPrice'
})
export class GetMarketPricePipe implements PipeTransform {
  constructor(private coingeckoProvider: CoingeckoProvider) {}

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    let coinId:string;

    if (value === 'xem') {
      coinId = 'nem';
    } else if (value === 'xpx') {
      coinId = 'proximax';
    } else if (value === 'npxs') {
      coinId = 'pundi-x';
    } else if (value === 'sft') {
      coinId = 'sportsfix';
    }else {
      coinId = '';
    } 
    console.log('coinId en get market', coinId)
    // Add more coins here
    
    if(coinId != undefined && coinId != '') {
      console.log("CoinId",coinId)
      return this.coingeckoProvider
      .getDetails(coinId)
      .toPromise()
      .then(details => {
        console.log("detailsdetailsdetailsdetails",details.market_data.current_price.usd)
        return details.market_data.current_price.usd;
      }).catch(err => {
      console.log("LOG: GetMarketPricePipe -> transform -> err", err);
        return returnZero();
      })
    } else {
      return returnZero();
    }

  }
}

async function returnZero() {
  // Wait one second
  await new Promise(r => setTimeout(r, 1000));
  // Toss a coin
  return 0;
}
