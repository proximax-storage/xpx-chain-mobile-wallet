import {Injectable} from "@angular/core";
import {Mosaic, SimpleWallet, MosaicId, UInt64, MosaicInfo} from "tsjs-xpx-chain-sdk";
import {CoingeckoProvider} from "../coingecko/coingecko";
import {Observable} from "rxjs";
import { DefaultMosaic } from "../../models/default-mosaic";
import { MosaicNames } from "tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNames";
import { ProximaxProvider } from "../proximax/proximax";

/*
  Generated class for the MosaicsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MosaicsProvider {
  defaultMosaics = Array<DefaultMosaic>();
  

  constructor(private coingeckoProvider: CoingeckoProvider, private proximaxProvider: ProximaxProvider,) {
    console.log("Hello MosaicsProvider Provider");
    this.defaultMosaics = this.getDefaultMosaics();
  }

  getDefaultMosaics(): Array<DefaultMosaic> {
    const XPX = new DefaultMosaic({ namespaceId: "prx", mosaicId: "xpx", hex: "0dc67fbe1cad29e3", amount: 0 });
    const NPXS = new DefaultMosaic({ namespaceId: "pundix", mosaicId: "npxs", hex: "06a9f32c9d3d6246", amount: 0 });
    const SFT = new DefaultMosaic({ namespaceId: "sportsfix", mosaicId: "sft", hex: "1292a9ed863e7aa9", amount: 0 });
    const XAR = new DefaultMosaic({ namespaceId: "xarcade", mosaicId: "xar", hex: "2dba42ea2b169829", amount: 0 });

    return [
      XPX, NPXS, SFT, XAR
    ];
  }

  async getMosaicNames(mosaicsId: MosaicId[]): Promise<MosaicNames[]> {
    return await this.proximaxProvider.mosaicHttp.getMosaicNames(mosaicsId).toPromise();
  }
  
  public getMosaics(): Observable<Array<DefaultMosaic>> {
    return new Observable(observer => {
      let myMosaics = new Array<DefaultMosaic>();
      myMosaics = this.defaultMosaics;
      observer.next(myMosaics);
    });
  }

  public setMosaicInfoWithDisivitity(mosaic: Mosaic, disivitity: MosaicInfo): DefaultMosaic {

    let modifiedMosaic: DefaultMosaic;
    let myMosaics = new Array<DefaultMosaic>();
    myMosaics = this.defaultMosaics;


    modifiedMosaic = myMosaics.find(defaultMosaic => {
      return defaultMosaic.hex == mosaic.id.toHex();
    });

    if (!modifiedMosaic) {
      return {
        amount: this.amountFormatter(mosaic.amount, disivitity),
        hex: mosaic.id.toHex(),
        mosaicId: mosaic.id.toHex(),
        namespaceId: mosaic.id.toHex()
      };
    } else {
      modifiedMosaic.amount = this.amountFormatter(mosaic.amount, disivitity);
    }

    return modifiedMosaic;
  }

  public setMosaicInfo(mosaic: Mosaic): DefaultMosaic {

    let modifiedMosaic: DefaultMosaic;
    let myMosaics = new Array<DefaultMosaic>();
    myMosaics = this.defaultMosaics;


    modifiedMosaic = myMosaics.find(defaultMosaic => {
      return defaultMosaic.hex == mosaic.id.toHex();
    });

    if (!modifiedMosaic) {
      return {
        amount: this.getRelativeAmount(mosaic.amount.compact()),
        hex: mosaic.id.toHex(),
        mosaicId: mosaic.id.toHex(),
        namespaceId: mosaic.id.toHex()
      };
    } else {
      modifiedMosaic.amount = this.getRelativeAmount(mosaic.amount.compact());
    }

    return modifiedMosaic;
  }

  public getRelativeAmount(amount: number): number {
    return amount / Math.pow(10, 6);
  }

  public amountFormatter(amountParam: UInt64 | number, mosaic: MosaicInfo, manualDivisibility = '') : number {
    // console.log('.............................', mosaic['properties'].divisibility )
    const divisibility = (manualDivisibility === '') ? mosaic['properties'].divisibility : manualDivisibility;
    const amount = (typeof (amountParam) === 'number') ? amountParam : amountParam.compact();
    const amountDivisibility = Number(
      amount / Math.pow(10, divisibility)
    );

    const amountFormatter = amountDivisibility.toLocaleString("en-us", {
      minimumFractionDigits: divisibility
    });
    return parseInt(amountFormatter);
  }

  public getMosaicInfo(mosaic: Mosaic) {
    let modifiedMosaic: any;
    let myMosaics = new Array<DefaultMosaic>();

    myMosaics = this.getDefaultMosaics();
    modifiedMosaic = myMosaics.find(defaultMosaic => {
      return defaultMosaic.hex == mosaic.id.toHex();
    });
    
    if (!modifiedMosaic) {
      return {
        amount: this.getRelativeAmount(mosaic.amount.compact()),
        hex: mosaic.id.toHex(),
        mosaicId: mosaic.id.toHex(),
        namespaceId: mosaic.id.toHex()
      };
    } else {
      modifiedMosaic.amount = this.getRelativeAmount(mosaic.amount.compact());
    }

    return modifiedMosaic;
  }

  totalBalance(wallet: SimpleWallet): Promise<number> {
    return new Promise(resolve => {
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

  computeTotalBalance(mosaics: Array<any>) {
    return new Promise((resolve) => {

      function getSum(total, num) {
        return total + num;
      }

      const mosaicsAmountInUSD = mosaics.map(async (mosaic) => {
        const price = await this.getCoinPrice(mosaic.mosaicId);
        return price * mosaic.amount;
      })
      
      Promise.all(mosaicsAmountInUSD).then(function(pricesArray) {
      console.log("SIRIUS CHAIN WALLET: HomePage -> getWalletBalanceInUSD -> results", pricesArray)
        const sum = pricesArray.reduce(getSum);
        console.log("SIRIUS CHAIN WALLET: HomePage -> getWalletBalanceInUSD -> sum", sum)
        resolve(sum);
      })
    })
  }

  public getCoinPrice(mosaicId: string) {
    let coinId: string;

    if (mosaicId === "xem") {
      coinId = "nem";
    } else if (mosaicId === "xpx") {
      coinId = "proximax";
    } else if (mosaicId === "npxs") {
      coinId = "pundi-x";
    }
    // Add more coins here

    if (coinId != undefined) {
      // console.log("CoinId",coinId)
      return this.coingeckoProvider
        .getDetails(coinId)
        .toPromise()
        .then(details => {
          return details.market_data.current_price.usd;
        })
        .catch((err) => {
        console.log("LOG: MosaicsProvider -> getCoinPrice -> err", err);
          return returnZero();
        });
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


