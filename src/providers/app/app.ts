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
    HINT: `${App.ASSETS}/stickers/idea.png`,
    INVALID: `${App.ASSETS}/stickers/invalid.png`
  };
  public static SLIDES = {
    SLIDE1: `${App.ASSETS}/slides/xpx-slide-1.png`,
    SLIDE2: `${App.ASSETS}/slides/xpx-slide-2.png`,
    SLIDE3: `${App.ASSETS}/slides/xpx-slide-3.png`,
    SLIDE4: `${App.ASSETS}/slides/xpx-slide-4.png`,
    SLIDE5: `${App.ASSETS}/slides/xpx-slide-5.png`,
    SLIDE6: `${App.ASSETS}/slides/xpx-slide-5.png`
  };
  public static LOGO = {
    XPX: `assets/imgs/mosaics/xpx.png`,
    NEM: `assets/imgs/mosaics/xem.png`,
    NPXS: `assets/imgs/mosaics/npxs.png`,
    SFT: `assets/imgs/mosaics/sft.png`,
    XAR: `assets/imgs/mosaics/xar.png`,
    DEFAULT: `assets/imgs/mosaics/default.png`,
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
  };

  constructor(public http: HttpClient) {
    console.log("Hello AppProvider Provider");
  }
}
