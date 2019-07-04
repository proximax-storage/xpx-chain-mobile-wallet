import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TapticEngine } from '@ionic-native/taptic-engine';
import { Platform } from 'ionic-angular';

/*
  Generated class for the HapticProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HapticProvider {

  constructor(public http: HttpClient, private tapticEngine: TapticEngine, private platform: Platform) {
    console.log('Hello HapticProvider Provider');
  }

  selection(){
    if(this.platform.is("ios")) {
      this.tapticEngine.selection();
    }
  }

  notification(type){
    if(this.platform.is("ios")) {
    this.tapticEngine.notification(type)
    }
  }

  impact(style) {
    if(this.platform.is("ios")) {
    this.tapticEngine.impact(style)
    }
  }

  

}
