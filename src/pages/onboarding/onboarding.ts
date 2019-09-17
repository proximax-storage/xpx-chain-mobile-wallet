import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { App } from '../../providers/app/app';
import { MockDataProvider } from '../../providers/mock-data/mock-data';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the OnboardingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html'
})
export class OnboardingPage {
  App = App;
  isPreview: boolean = false;

  @ViewChild(Slides) ionSlide: Slides;

  slides: Array<{
    title: string;
    description: string;
    image: string;
    isSmall?: boolean;
  }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private mockData: MockDataProvider,
    private translateService: TranslateService
  ) {

    this.isPreview = this.navParams.get('preview');
    this.init();
    this.mockData.init(); // Uncomment to load mock data
  }

  init() {
    const page1title = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE1.TITLE");
    const page1Content1 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE1.CONTENT1");
    const page1Content2 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE1.CONTENT2");
    const page2title = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE2.TITLE");
    const page2Content1 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE2.CONTENT1");
    const page2Content2 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE2.CONTENT2");
    const page2Content3 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE2.CONTENT3");
    const page2Content4 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE2.CONTENT4");
    const page3title = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE3.TITLE");
    const page3Content1 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE3.CONTENT1");
    const page3Content2 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE3.CONTENT2");
    const page3Content3 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE3.CONTENT3");
    const page3Content4 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE3.CONTENT4");
    const page3Content5 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE3.CONTENT5");
    const page3Content6 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE3.CONTENT6");
    const page4title = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE4.TITLE");
    const page4Content1 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE4.CONTENT1");
    const page4Content2 = this.translateService.instant("SETTINGS.WALLET_GUIDE.PAGE4.CONTENT2");
    // const content1 = this.translateService.instant("");
    // const content2 = this.translateService.instant("");
    // const content3 = this.translateService.instant("");
    // const content4 = this.translateService.instant("");
    // const content5 = this.translateService.instant("");
    // const content6 = this.translateService.instant("");
    // const content7 = this.translateService.instant("");
    // const content8 = this.translateService.instant("");
    // const content9 = this.translateService.instant("");
    // const content10 = this.translateService.instant("");
    // const content11 = this.translateService.instant("");


    this.slides = [
      {
        title: page1title,
        description:
          `<br>${page1Content1}<br><br>
          ${page1Content2}`,
        isSmall: true,
        image: App.SLIDES.SLIDE1
      },
      {
        title: page2title,
        description:
          `${page2Content1} <br><br><strong>${page2Content2}</strong>
          <br>
          
          <ul>
            <li>${page2Content3}</li><br>
            <li>${page2Content4}</li>
          </ul>
          `,
        isSmall: true,
        image: App.SLIDES.SLIDE3
      },
      {
        title: page3title,
        description:
          `${page3Content1}
          <br><br>
          <strong "padding-left: 10px;">${page3Content2}</strong>
          <br>
          <ul>
            <li>${page3Content3}</li><br>
            <li>${page3Content4}
            </li><br>
            <li>${page3Content5}</li><br>
            <li>${page3Content6}</li>
          </ul>`,
        isSmall: true,
        image: App.SLIDES.SLIDE2
      },
      {
        title: page4title,
        description:
          `${page4Content1}
          <br><br>
          ${page4Content2} 
          `,
        isSmall: true,
        image: App.SLIDES.SLIDE4
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
  }

  gotoWelcome() {

    if(this.isPreview) {
      this.navCtrl.pop();
    } else {
      this.storage.set('isFirstAppOpen', false).then(_ => {
        this.navCtrl.setRoot(
          'RegisterPage',
          {},
          {
            animate: true,
            direction: 'forward'
          }
        );
      })
    }
   

  }

}
