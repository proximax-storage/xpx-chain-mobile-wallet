import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';
import { LocalCacheProvider } from '../local-cache/local-cache';

/*
  Generated class for the CoingeckoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CoingeckoProvider {

  url = 'https://api.coingecko.com/api/v3';

  constructor(public http: HttpClient, private cache: LocalCacheProvider) {
    console.log('Hello CoingeckoProvider Provider');
  }

  getAll(): Observable<any> {

    //Cache an observable
    let url = `${this.url}/coins`;
    let requestObservable = this.http.get(url);
    this.cache.observable('getAllPrice', requestObservable, 60*30).subscribe(result => {
      console.log("getAllPrice",result)
  });

    return this.http.get(`${this.url}/coins`);
  }

  getDetails(coin_id: string): Observable<any> {
    // let url = `${this.url}/coins/${coin_id}`;
    // let requestObservable = this.http.get(url);
    // console.log(requestObservable);
    
    // this.cache.observable(coin_id, requestObservable, 60*30).subscribe(result => {
    //   console.log("getDetailsPrice",result)
    // });
    // return this.cache.observable(coin_id, requestObservable, 60*30)
    return this.http.get(`${this.url}/coins/${coin_id}`);
  }

  getPrices(coin_id: string, currency: string, days: number): Observable<any> {
    // let url = `${this.url}/coins/${coin_id}/market_chart?vs_currency=${currency}&days=${days}`;
    // let requestObservable = this.http.get(url);
    // return this.cache.observable('getPrices', requestObservable, 60*30).map((data: any) => {
    //   data.prices = data.prices.map(price => {
    //     price[0] = moment(price[0]).format('MMM DD, YYYY hh:mm:a');
    //     price[1] = parseFloat(price[1].toFixed(4));
    //     return price;
    //   });
    //   console.log("getPrices", data) ;
    //   return data;
    // });

    return this.http.get(`${this.url}/coins/${coin_id}/market_chart?vs_currency=${currency}&days=${days}`)
      .map((data: any) => {
        data.prices = data.prices.map(price => {
          price[0] = moment(price[0]).format('MMM DD, YYYY hh:mm:a');
          price[1] = parseFloat(price[1].toFixed(4));
          return price;
        });
        return data;
      });
  }

}
