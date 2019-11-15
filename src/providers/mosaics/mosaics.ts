import { AppConfig } from './../../app/app.config';
import { Injectable } from "@angular/core";
import { Mosaic, MosaicId, UInt64, MosaicInfo, Address, MosaicAmountView } from "tsjs-xpx-chain-sdk";
import { CoingeckoProvider } from "../coingecko/coingecko";
import { Observable, from, forkJoin } from "rxjs";
import { DefaultMosaic } from "../../models/default-mosaic";
import { MosaicNames } from "tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNames";
import { ProximaxProvider } from "../proximax/proximax";
import { mergeMap, map, filter, toArray, flatMap, scan, last } from "rxjs/operators";

/*
  Generated class for the MosaicsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MosaicsProvider {
  
  mosacisAnt: any;
  mosaicsInNamespace: any[]=[];
  mosaics: any[]=[];
  mosaicInfo: { mosaicId: string; namespaceId: string; hex: string; amount: any; disivitity: any; };
  hex: string;
  amount: any;
  mosaicName: string[];
  disivitity: MosaicInfo;
  defaultMosaics = Array<DefaultMosaic>();


  constructor(private coingeckoProvider: CoingeckoProvider, private proximaxProvider: ProximaxProvider, ) {
    // console.log("Hello MosaicsProvider Provider");
    this.defaultMosaics = this.getDefaultMosaics();
  }

  

  getDefaultMosaics(): Array<DefaultMosaic> {
    const XPX = new DefaultMosaic({ namespaceId: "prx", mosaicId: "xpx", hex: AppConfig.xpxHexId, amount: 0, amountCompact: 0, divisibility:0 });
    // const NPXS = new DefaultMosaic({ namespaceId: "pundix", mosaicId: "npxs", hex: "1e29b3356f3e24e5", amount: 0, divisibility:0 });
    // const SFT = new DefaultMosaic({ namespaceId: "sportsfix", mosaicId: "sft", hex: "33b0efbf4a600cc9", amount: 0, divisibility:0 });
    // const XAR = new DefaultMosaic({ namespaceId: "xarcade", mosaicId: "xar", hex: "59096674da68a7e5", amount: 0, divisibility:0 });
    return [
      XPX
    ];
  }

  async getMosaicNames(mosaicsId: MosaicId[]): Promise<MosaicNames[]> {
    return await this.proximaxProvider.mosaicHttp.getMosaicsNames(mosaicsId).toPromise();
  }

  public loadDefaultMosaics(): Observable<Array<DefaultMosaic>> {
    return new Observable(observer => {
      let myMosaics = new Array<DefaultMosaic>();
      myMosaics = this.defaultMosaics;
      observer.next(myMosaics);
    });
  }

  mosaicsAmountViewFromAddress(address: Address) : Observable<MosaicAmountView[]> {
    return this.proximaxProvider.mosaicsAmountViewFromAddress(address);
  }

  getMosaics(address: Address) : Observable<DefaultMosaic[]> {
    return new Observable(observer=>{
    this.mosaicsAmountViewFromAddress(address)
    .pipe(
      flatMap(_ => from(_)),
      scan((acc, v) => acc.concat(v), []),
      last()
    )
    .subscribe(async mosaicAmountViewArray =>{     

      // Filter out expired mosaics (5760)
      const activeMosaics = await mosaicAmountViewArray.filter((_:MosaicAmountView)=> _.mosaicInfo.duration.compact() != 5760 && _.mosaicInfo.duration.compact() != 11520)

      activeMosaics.forEach((_:MosaicAmountView)=>{
        // console.log("TCL: MosaicsProvider -> _.mosaicInfo.duration.compact();", _.mosaicInfo.mosaicId.toHex(),_.mosaicInfo.duration.compact(), _.mosaicInfo );
      })

      observer.next(this.getMosaicMetaData(activeMosaics));
    })
  })
  }

  getMosaicMetaData(mosaicAmountView:MosaicAmountView[]){

    let _mosaicAmountViewArray = mosaicAmountView.map(mosaicAmountView=>{
      const _mosaicAmountView =  new DefaultMosaic({
        namespaceId: '', // namespaceId
        mosaicId: '', // mosaicId
        hex: mosaicAmountView.fullName(), // mosaic hex id
        amount: mosaicAmountView.relativeAmount(),
        amountCompact: mosaicAmountView.amount.compact(),
        divisibility: mosaicAmountView.mosaicInfo.divisibility,
      });
      let XPX = this.getDefaultMosaics().filter(m => m.hex === _mosaicAmountView.hex);

      if(XPX.length==0 || XPX === undefined) {
        return _mosaicAmountView;
      } else {
        _mosaicAmountView.namespaceId = XPX[0].namespaceId; // namespaceId
        _mosaicAmountView.mosaicId =  XPX[0].mosaicId; // mosaicId
        _mosaicAmountView.hex = XPX[0].hex; // mosaic hex id
        _mosaicAmountView.amount = _mosaicAmountView.amount;
        _mosaicAmountView.divisibility = _mosaicAmountView.divisibility;
        return _mosaicAmountView;
      }

      
    })

    // console.log("TCL: MosaicsProvider -> getMosaicMetaData -> _mosaicAmountViewArray", _mosaicAmountViewArray)
    return _mosaicAmountViewArray;
  }

  /**
   * @deprecated
   * @param ownedMosaics 
   */
  public getMosaicInfo(ownedMosaics: Mosaic[]): Observable<Array<DefaultMosaic>> {
  // console.log('LOG: MosaicsProvider -> mergeMosaics -> ownedMosaics', JSON.stringify(ownedMosaics,null, 3));    


    return new Observable(observer => {
      
      // Merge mosaic names and mosaic info
      const mosaicIds = ownedMosaics.map(mosaic => mosaic.id);
      const mosaicNames$ = from(this.getMosaicNames(mosaicIds));
      const mosaicInfo$ = from(this.proximaxProvider.getMosaics(mosaicIds));
  
  
      const mosaicList$ = mosaicNames$.pipe(
        mergeMap(mosaicNames => {
          return mosaicInfo$.pipe(
            map(mosaicInfo=> {
  
              const _mosaicNames = mosaicNames.map(names=> {
                return {
                  name: names.names[0].name,
                  namespaceId: names.names[0].namespaceId,
                  id: names.mosaicId
                }
              })
  
              const _mosaicInfo =  mosaicInfo.map(info => {
                  return {
                    divisibility: info.divisibility,
                    duration: info.duration,
                    id: info.mosaicId
                  }
              })
  
              const _ownedMosaics:Mosaic[] = ownedMosaics;
              return from(_ownedMosaics).pipe(
                mergeMap(mosaic => {
                  let _mosaicNames$ = from(_mosaicNames).pipe(
                    filter(names => names.id.equals(mosaic.id))
                  )
                  
                  let _mosaicInfo$ = from(_mosaicInfo).pipe(
                    filter(info => info.id.equals(mosaic.id))
                  )
  
                  return forkJoin(_mosaicNames$, _mosaicInfo$, (mName: any, mInfo: any) => {
                    return new DefaultMosaic({
                      namespaceId: mName.name.toString().split('.')[0], // namespaceId
                      mosaicId: mName.name.toString().split('.')[1], // mosaicId
                      hex: mName.id.toHex(), // mosaic hex id
                      amount: mosaic.amount.compact(),
                      amountCompact: this.getRelativeAmount(mosaic.amount.compact(), mInfo.divisibility),
                      divisibility: mInfo.divisibility,
                      // 'duration': mInfo.duration
                    });
                  });
                }),
                toArray()
              )
                .subscribe(mosaicsInfo=> {
                  // console.log("TCL: mosaicsInfo", JSON.stringify(mosaicsInfo,null,3));
                  const mergedMosaics = this.filterUniqueMosaic(mosaicsInfo.concat(this.getDefaultMosaics()));
                  observer.next(mergedMosaics);
              })

            })
          )
        }),
        toArray(),
      )
  
  
      mosaicList$.subscribe(mosaicList=>{
      // console.log('LOG: MosaicsProvider -> mergeMosaics -> mosaicList', mosaicList);
      })
    })

  }

  filterUniqueMosaic(array) {
    let a = array.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i].hex === a[j].hex)
          a.splice(j--, 1);
      }
    }

    return a;
  }

  // TODO: Refactor
  public getRelativeAmount(amount: number, divisibility: number): number {
    return amount / Math.pow(10, divisibility);
  }

  public amountFormatter(amountParam: UInt64 | number, mosaic: MosaicInfo, manualDivisibility = '') {
    // console.log('.............................', mosaic['properties'].divisibility )
    const divisibility = (manualDivisibility === '') ? mosaic['properties'].divisibility : manualDivisibility;
    const amount = (typeof (amountParam) === 'number') ? amountParam : amountParam.compact();
    const amountDivisibility = Number(
      amount / Math.pow(10, divisibility)
    );

    const amountFormatter = amountDivisibility.toLocaleString("en-us", {
      minimumFractionDigits: divisibility
    });
    return amountFormatter;
  }

  computeTotalBalance(mosaics: Array<DefaultMosaic>) {
    const MOSAICS = mosaics;
    return new Promise((resolve) => {

      function getSum(total, num) {
        return total + num;
      }

      const mosaicsAmountInUSD = MOSAICS.map(async (mosaic) => {
        const price = await this.getCoinPrice(mosaic.mosaicId);
        return price * mosaic.amount;
      })

      Promise.all(mosaicsAmountInUSD).then(function (pricesArray) {
        // console.log("SIRIUS CHAIN WALLET: HomePage -> getWalletBalanceInUSD -> results", pricesArray)
        const sum = pricesArray.reduce(getSum);
        // console.log("SIRIUS CHAIN WALLET: HomePage -> getWalletBalanceInUSD -> sum", sum)
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
      return this.coingeckoProvider
        .getDetails(coinId)
        .toPromise()
        .then(details => {
          return details.market_data.current_price.usd;
        })
        .catch((err) => {
          // console.log("LOG: MosaicsProvider -> getCoinPrice -> err", err);
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

