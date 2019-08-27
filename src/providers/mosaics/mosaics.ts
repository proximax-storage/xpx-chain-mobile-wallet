import { Injectable } from "@angular/core";
import { Mosaic, SimpleWallet, MosaicId, UInt64, MosaicInfo } from "tsjs-xpx-chain-sdk";
import { CoingeckoProvider } from "../coingecko/coingecko";
import { Observable, from, of, forkJoin, combineLatest } from "rxjs";
import { DefaultMosaic, DefaultMosaic2 } from "../../models/default-mosaic";
import { MosaicNames } from "tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicNames";
import { ProximaxProvider } from "../proximax/proximax";
import { mergeMap, map, filter, toArray } from "rxjs/operators";

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
  defaultMosaics2 = Array<DefaultMosaic2>();


  constructor(private coingeckoProvider: CoingeckoProvider, private proximaxProvider: ProximaxProvider, ) {
    console.log("Hello MosaicsProvider Provider");
    this.defaultMosaics = this.getDefaultMosaics();
  }

  getDefaultMosaics(): Array<DefaultMosaic> {
    const XPX = new DefaultMosaic({ namespaceId: "prx", mosaicId: "xpx", hex: "3c0f3de5298ced2d", amount: 0, divisibility:0 });
    const NPXS = new DefaultMosaic({ namespaceId: "pundix", mosaicId: "npxs", hex: "1e29b3356f3e24e5", amount: 0, divisibility:0 });
    const SFT = new DefaultMosaic({ namespaceId: "sportsfix", mosaicId: "sft", hex: "33b0efbf4a600cc9", amount: 0, divisibility:0 });
    const XAR = new DefaultMosaic({ namespaceId: "xarcade", mosaicId: "xar", hex: "59096674da68a7e5", amount: 0, divisibility:0 });

    return [
      XPX
    ];
  }

  getDefaultMosaics2(): Array<DefaultMosaic2> {
    const XPX = new DefaultMosaic2({ namespaceId: "prx", mosaicId: "xpx", hex: "3c0f3de5298ced2d", amount: "0.000000" });
    const NPXS = new DefaultMosaic2({ namespaceId: "pundix", mosaicId: "npxs", hex: "1e29b3356f3e24e5", amount: "0.000000" });
    const SFT = new DefaultMosaic2({ namespaceId: "sportsfix", mosaicId: "sft", hex: "33b0efbf4a600cc9", amount: "0.000000" });
    const XAR = new DefaultMosaic2({ namespaceId: "xarcade", mosaicId: "xar", hex: "59096674da68a7e5", amount: "0.000000" });

    return [
      XPX, NPXS, SFT, XAR
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

  public mergeMosaics(ownedMosaics: Mosaic[]): Observable<Array<DefaultMosaic>> {
  console.log('LOG: MosaicsProvider -> mergeMosaics -> ownedMosaics', ownedMosaics);    


    return new Observable(observer => {
      
      // Merge mosaic names and mosaic info
      const mosaicIds = ownedMosaics.map(mosaic => mosaic.id);
      const mosaicNames$ = from(this.getMosaicNames(mosaicIds));
      const mosaicInfo$ = from(this.proximaxProvider.getMosaics(mosaicIds));
  
  
      const mosaicList$ = mosaicNames$.pipe(
        mergeMap(mosaicNames=> {
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
                mergeMap((mosaic:Mosaic) => {
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
                      amount: this.getRelativeAmount1(mosaic.amount.compact(), mInfo.divisibility),
                      divisibility: mInfo.divisibility,
                      // 'duration': mInfo.duration
                    });
                  });
                }),
                toArray()
              )
                .subscribe(myMosaicsOwned=> {
                  console.log('LOG: MosaicsProvider -> myMosaicsOwned -> myMosaicsOwned', myMosaicsOwned);
                  console.log('LOG: MosaicsProvider -> this.defaultMosaics', this.defaultMosaics);

                  
                  const mergedMosaics = this.filterUniqueMosaic(myMosaicsOwned.concat(this.defaultMosaics));
                  console.log('LOG: MosaicsProvider -> mergeMosaics -> mergedMosaics', mergedMosaics);

                  this.defaultMosaics = mergedMosaics;

                  observer.next(mergedMosaics);
              })

            })
          )
        }),
        toArray(),
      )
  
  
      mosaicList$.subscribe(mosaicList=>{
      console.log('LOG: MosaicsProvider -> mergeMosaics -> mosaicList', mosaicList);
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

  public setMosaicInfoWithDisivitity(mosaic: Mosaic, disivitity: MosaicInfo): DefaultMosaic2 {

    let modifiedMosaic: DefaultMosaic2;
    let myMosaics = new Array<DefaultMosaic2>();
    myMosaics = this.defaultMosaics2;


    modifiedMosaic = myMosaics.find(defaultMosaic2 => {
      return defaultMosaic2.hex == mosaic.id.toHex();
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

  public getRelativeAmount1(amount: number, divisibility: number): number {
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

  public getMosaicInfo(mosaic: Mosaic) {
    let modifiedMosaic: any;
    let myMosaics = new Array<DefaultMosaic>();

    myMosaics = this.getDefaultMosaics();
    console.log('LOG: MosaicsProvider -> getMosaicInfo -> this.getDefaultMosaics();', this.getDefaultMosaics());
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

  computeTotalBalance(mosaics: Array<DefaultMosaic>) {
    return new Promise((resolve) => {

      function getSum(total, num) {
        return total + num;
      }

      const mosaicsAmountInUSD = mosaics.map(async (mosaic) => {
        const price = await this.getCoinPrice(mosaic.mosaicId);
        return price * mosaic.amount;
      })

      Promise.all(mosaicsAmountInUSD).then(function (pricesArray) {
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


   async getOwnedMosaic(mosacis) {
    this.mosaics = [];
    const mosaicsIds = mosacis.map(data => data.id);
    let mosaicsInfo = await this.proximaxProvider.getMosaics(mosaicsIds).toPromise();
    if(mosaicsInfo.length === 0) {
      // let filter = mosaicsIds.filter(mosaics => mosaics.id)
      for (let index = 0; index < mosaicsIds.length; index++) {
        const element = mosaicsIds[index];
        // console.log('element', element)
        let getLinked = await this.proximaxProvider.getLinkedMosaicId(element).toPromise();
        this.mosaicsInNamespace.push(getLinked)
      }
      let mosaicsInfo2 = await this.proximaxProvider.getMosaics(this.mosaicsInNamespace).toPromise();
      const value = await this.continue(this.mosacisAnt, mosaicsInfo2, this.mosaicsInNamespace)
      return value;
    } else {
      const value = await this.continue(mosacis, mosaicsInfo, mosaicsIds)
        return value;
    }
  }




  async continue(mosacis, mosaicsInfo, mosaicsIds){
    // console.log('--------------------------info', mosaicsInfo)
    this.mosacisAnt = mosacis
    await this.getMosaicNames(mosaicsIds).then(mosaicsNames => {
      mosacis.forEach(async mosacis => {
        mosaicsInfo.forEach(mosaicsI => {
          if (mosacis.id.toHex() === mosaicsI.mosaicId.id.toHex()) {
            this.disivitity = mosaicsI
          }
        })

        mosaicsNames.forEach(mosaicName => {

          if (mosacis.id.toHex() === mosaicName.mosaicId.id.toHex()) {
              let _mosaicNames = mosaicName.names[0].name
           
              if (_mosaicNames.length > 0) {
              // _mosaicNames.map(val => {
              let valu = _mosaicNames + '';
              this.mosaicName = valu.split(".")
              // })
              } else {
              this.mosaicName = [" ", mosaicName.mosaicId.id.toHex()]
              }
 
            this.amount = this.amountFormatter(mosacis.amount, this.disivitity).toString();
            this.hex = mosaicName.mosaicId.id.toHex()
          }

          this.mosaicInfo = {
            mosaicId: this.mosaicName[1],
            namespaceId: this.mosaicName[0],
            hex: this.hex,
            amount: this.amount,
            disivitity: this.disivitity['properties'].divisibility
          }
        })
        this.mosaics.push(this.mosaicInfo)
      })
    })
    return this.mosaics;
  }
}


