
import { LocalStorageProvider } from '../local-storage/local-storage';

import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {isEmpty, isString, isNumber, isDate} from 'lodash';
import { of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';


/*
  Generated class for the LocalCacheProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalCacheProvider {

/**
   * Default expiry in seconds
   *
   * @type {number}
   */
  defaultExpires: number = 60*60; // 86400 = 24Hrs or 60*60 = 1hr

  constructor(private localstorage: LocalStorageProvider) {}

  /**
   * Cache or use result from observable
   *
   * If cache key does not exist or is expired, observable supplied in argument is returned and result cached
   *
   * @param key
   * @param observable
   * @param expires
   * @returns {Observable<T>}
   */
  public observable(key: string, observable: Observable<any>, expires:number = this.defaultExpires): Observable<any> {
    //First fetch the item from localstorage (even though it may not exist)
    return this.localstorage.getItem(key)

      //If the cached value has expired, nullify it, otherwise pass it through
      .pipe(
        map((val: CacheStorageRecord) => {
          if(val){
            return (new Date(val.expires)).getTime() > Date.now() ? val : null;
          }
          return null;
        }),

        //At this point, if we encounter a null value, either it doesnt exist in the cache or it has expired.
        //If it doesnt exist, simply return the observable that has been passed in, caching its value as it passes through
        flatMap((val: CacheStorageRecord | null) => {
          if (!isEmpty(val)) {
            return of(val.value);
          } else {
            return flatMap((val:any) => this.value(key, val, expires)); //The result may have 'expires' explicitly set
          }
        })
      )
     
  }

  /**
   * Cache supplied value until expiry
   *
   * @param key
   * @param value
   * @param expires
   * @returns {Observable<T>}
   */
  value<T>(key:string, value:T, expires:number|string|Date = this.defaultExpires):Observable<T>{
    let _expires:Date = this.sanitizeAndGenerateDateExpiry(expires);

    return this.localstorage.setItem(key, {
      expires: _expires,
      value: value
    }).pipe(
      map(val => val.value)
    )
  }

  /**
   *
   * @param key
   * @returns {Observable<void>}
   */
  expire(key:string):Observable<void>{
    return this.localstorage.removeItem(key);
  }

  /**
   *
   * @param expires
   * @returns {Date}
   */
  private sanitizeAndGenerateDateExpiry(expires:string|number|Date):Date{
    let expiryDate:Date = this.expiryToDate(expires);

    //Dont allow expiry dates in the past
    if(expiryDate.getTime() <= Date.now()){
      return new Date(Date.now() + this.defaultExpires);
    }

    return expiryDate;
  }

  /**
   *
   * @param expires
   * @returns {Date}
   */
  private expiryToDate(expires:number|string|Date):Date{
    if(isNumber(expires)){
      console.log("isNumber", expires);
      return new Date(Date.now() + Math.abs(Number(expires))*1000);
    }
    if(isString(expires)){
      console.log("isString", expires);
      return new Date(expires.toString());
    }
    if(isDate(expires)){
      console.log("isDate", expires);
      return new Date(expires.toString());
    }

    return new Date();
  }
}

/**
 * Cache storage record interface
 */
interface CacheStorageRecord {
  expires: Date,
  value: any
}
