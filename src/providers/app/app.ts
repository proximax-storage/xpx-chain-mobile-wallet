import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the AppProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class App {
  private static ASSETS = "assets/imgs";
  public static STICKERS = {
    SORRY: `${App.ASSETS}/stickers/sorry.png`,
    HINT: `${App.ASSETS}/slides/icon-private-key-full-color-80h.svg`,
    INVALID: `${App.ASSETS}/stickers/invalid.png`
  };
  public static SLIDES = {
    SLIDE1: `${App.ASSETS}/slides/logo-two4one-mobile-wallet.svg`,
    SLIDE2: `${App.ASSETS}/slides/icon-private-key-full-color-80h.svg`,
    SLIDE3: `${App.ASSETS}/slides/icon-storage-full-color-80h.svg`,
    SLIDE4: `${App.ASSETS}/slides/icon-blockchain-full-color-80h.svg`,
    SLIDE5: `${App.ASSETS}/slides/icon-full-control-assets-full-color-80h.svg`
  };
  public static LOGO = {
    XPX: `assets/imgs/mosaics/xpx.png`,
    NEM: `assets/imgs/mosaics/xem.png`,
    NPXS: `assets/imgs/mosaics/npxs.png`,
    SFT: `assets/imgs/mosaics/sft.png`,
    XAR: `assets/imgs/mosaics/xar.png`,
    DEFAULT: `assets/imgs/mosaics/default.png`,
    SWAP: `assets/imgs/xpx-swap.png`,
    OTHERGIFTCARD: `assets/imgs/icon-centum-mosaic.svg`,
    SIRIUSGIFTCARD: `assets/imgs/icon-sirius-mosaics-sirius-gift.svg`,
    
    BONDED: `assets/imgs/icon-aggregate-bonded.svg`,
    SIRIUS: `assets/imgs/icon-sirius-mosaics.svg`,
    OTHER: `assets/imgs/icon-other-transactions.svg`,
  };
  public static USER = `${App.ASSETS}/user.svg`;
  public static INFO = `${App.ASSETS}/info.svg`;

  public static FLAGS = {
    CN: `assets/imgs/flags/cn.png`,
    EN: `assets/imgs/flags/en.png`,
    ES: `assets/imgs/flags/es.png`,
    FR: `assets/imgs/flags/fr.png`,
    JP: `assets/imgs/flags/jp.png`,
    KR: `assets/imgs/flags/kr.png`,
    NL: `assets/imgs/flags/nl.png`,
    RU: `assets/imgs/flags/ru.png`,
    VT: `assets/imgs/flags/vt.png`,
  };

  constructor(public http: HttpClient) {
  }
}
