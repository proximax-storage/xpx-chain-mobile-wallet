import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the LanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-language',
  templateUrl: 'language.html',
})
export class LanguagePage {

  languages: Array<any> = null;

  selectedLanguage: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public utils: UtilitiesProvider,
    private translateService: TranslateService

    ) {
      const ENGLISH = this.translateService.instant("SETTINGS.LANGUAGE.ENGLISH");
      const CHINESE = this.translateService.instant("SETTINGS.LANGUAGE.CHINESE");
      const SPANISH = this.translateService.instant("SETTINGS.LANGUAGE.SPANISH");
      const FRENCH = this.translateService.instant("SETTINGS.LANGUAGE.FRENCH");
      const JAPANESE = this.translateService.instant("SETTINGS.LANGUAGE.JAPANESE");
      const KOREAN = this.translateService.instant("SETTINGS.LANGUAGE.KOREAN");
      const DUTCH = this.translateService.instant("SETTINGS.LANGUAGE.DUTCH");
      const RUSSIAN = this.translateService.instant("SETTINGS.LANGUAGE.RUSSIAN");
      const VIETNAMESE = this.translateService.instant("SETTINGS.LANGUAGE.VIETNAMESE");

      this.languages = [
        {value: 'cn', name: CHINESE, icon:'cn'},
        {value: 'nl', name: DUTCH, icon:'nl'},
        {value: 'en', name: ENGLISH, icon:'en'},
        {value: 'fr', name: FRENCH, icon:'fr'},
        {value: 'jp', name: JAPANESE, icon:'jp'},
        {value: 'kr', name: KOREAN, icon:'kr'},
        {value: 'ru', name: RUSSIAN, icon:'ru'},
        {value: 'es', name: SPANISH, icon:'es'},
        {value: 'vt', name: VIETNAMESE, icon:'vt'},
      ]
			console.log("LOG: LanguagePage -> this.navParams.data", this.navParams.data);
      this.selectedLanguage = this.navParams.data.selectedLanguage

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LanguagePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onSelect(lang) {
  this.selectedLanguage = lang.value
  this.viewCtrl.dismiss(lang);
  }
  

}
