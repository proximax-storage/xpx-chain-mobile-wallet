import { Component } from "@angular/core";
import { Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Storage } from "@ionic/storage";
import { UtilitiesProvider } from "../providers/utilities/utilities";
import { OneSignal } from "@ionic-native/onesignal";
import { Keyboard } from "@ionic-native/keyboard";
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../app/app.config';

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: string;

  constructor(
    statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private platform: Platform,
    private storage: Storage,
    private utils: UtilitiesProvider,
    private oneSignal: OneSignal,
    private keyboard: Keyboard,
    private translateService: TranslateService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      this.initTranslate();
      
      this.getNode();

      this.initGetRoot().then(rootPage => {
        this.rootPage = rootPage;

        setTimeout(() => {
          this.splashScreen.hide();
        }, 1000);
      });
      this.initOnPauseResume();
      this.showPin();
    });
  }

  /**
   * Sets the root page base on the following conditions:
   *  1. App is first time opened -  OnboardingPage.
   *  2. App has an account logged in -  OnboardingPage.
   *  3. Anything else -  WelcomePage.
   */
  initGetRoot() {
    return Promise.all([
      this.storage.get("isFirstAppOpen"),
      this.storage.get("isLoggedIn"),
      this.storage.get("isAccountCreated"),
      
    ]).then(results => {
      const isFirstAppOpen = results[0] === null ? true : !!results[0];
      const isLoggedIn = results[1];
      const isAccountCreated = results[2];

      if (isFirstAppOpen) {
        return "OnboardingPage";
      } else if (isLoggedIn) {
        return "TabsPage";
      } else if (isAccountCreated){
        return "LoginPage";
      } else {
        return "RegisterPage";
      }
    });
  }

  getNode(){
    this.storage.get("node").then(nodeStorage => {
      if(nodeStorage === null || nodeStorage === undefined){
        this.storage.set("node", AppConfig.sirius.httpNodeUrl);
      }
    })

  }

  initOnPauseResume() {
    this.platform.pause.subscribe(() => {
      
      Promise.all([
        this.storage.get("pin"),
        this.storage.get("isAppPaused"),
        this.storage.set('isModalShown', false)
      ]).then(results => {
        const pin = !!results[0];
        // const isAppPaused = !!results[1];
        // const isModalShown = results[2];
        // alert("0App paused:" + isAppPaused + ", PIN:" + pin)

        if (pin) this.storage.set("isAppPaused", true);
        // if (isModalShown) this.storage.set("isModalShown", false);
        
        // encrypt plainPassword using currentPIN
        // this.pinProvider.encryptPasswordUsingCurrentPin();
        // Clear Current PIN

      });
    });

    this.platform.resume.subscribe(() => {
      this.showPin();
    });
  }

  private showPin() {
    Promise.all([
      this.storage.get("pin"),
      this.storage.get("isLoggedIn"),
      this.storage.get("isAppPaused"),
      this.storage.get("isModalShown"),
      this.storage.get("isQrActive")
    ]).then(results => {
      const pin = results[0];
      const isLoggedIn = results[1];
      const isAppPaused = results[2];
      const isModalShown = results[3];
      const isQrActive = !!results[4];
      console.log(
        "rootPage:", this.rootPage ,
        this.rootPage !== "OnboardingPage" && this.rootPage !== "WelcomePage"
      );
      console.log("isModalShown:", !isModalShown);
      console.log("isAppPaused:", !isAppPaused);
      console.log("isLoggedIn:", isLoggedIn);
      console.log("pin:", pin);

      console.log(
        "showModal:",
        this.rootPage !== "OnboardingPage" &&
          this.rootPage !== "WelcomePage" &&
          !isModalShown &&
          !isAppPaused &&
          !!pin &&
          isLoggedIn
      );

      // alert(
      //     "OnboardingPage:" + this.rootPage + 
      //     ",isModalShown:" + !isModalShown +
      //     ",isAppPaused:" + isAppPaused +
      //     ",pin:" + !!pin +
      //     ",isLoggedIn:" + isLoggedIn);++

      // alert(
      //   "1OnboardingPage:" + this.rootPage + 
      //   ",isModalShown:" + !isModalShown +
      //   ",isAppPaused:" + isAppPaused +
      //   ",pin:" + !!pin +
      //   ",isLoggedIn:" + isLoggedIn +
      //   ",isQrActive:" + !isQrActive);

      if (!pin && isLoggedIn) {
        // alert("showModal: VerificationCodePage");
        return this.utils.showModal("VerificationCodePage", {
          status: "setup",
          destination: "TabsPage"
        });
      }

          // if (isAppPaused) {
      //   return this.storage.set("isAppPaused", false);
      // } else 

      if(isQrActive) {
         return this.storage.set('isQrActive', false);

      } else if (
        this.rootPage !== "OnboardingPage" &&
        this.rootPage !== "WelcomePage" &&
        !isModalShown &&
        isAppPaused &&
        !!pin &&
        isLoggedIn &&
        !isQrActive
      ) {
        // alert(
        //   "2OnboardingPage:" + this.rootPage + 
        //   ",isModalShown:" + !isModalShown +
        //   ",isAppPaused:" + isAppPaused +
        //   ",pin:" + !!pin +
        //   ",isLoggedIn:" + isLoggedIn +
        //   ",isQrActive:" + !isQrActive);
        this.translateService.get('APP.PIN.CONFIRM.TITLE').subscribe(title=> {
          const confirmPinTitle = title;
          this.translateService.get('APP.PIN.CONFIRM').subscribe(subtitle=> {
            const confirmPinSubtitle = subtitle;
            return this.utils.showModal("VerificationCodePage", {
              status: "confirm",
              title: confirmPinTitle,
              subtitle: confirmPinSubtitle,
              invalidPinMessage: "Incorrect pin. Please try again",
              pin: pin
            });
          })
        })       
      }
    });
  }

  initOneSignal() {
    if (this.platform.is('cordova')) {
      console.log("You're on a mobile device");
      this.oneSignal.startInit(
        "a443505d-da4a-405e-91dd-c655923cbcf6",
        "678106224342"
      );

      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.InAppAlert
      );

      this.oneSignal.handleNotificationReceived().subscribe(data => {
        // do something when notification is received
        alert(data);
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.endInit();
    }
  }

  private initTranslate()
  {
     // Set the default language for translation strings, and the current language.
     this.storage.get("lang").then(lang => {
       if(lang) {
        this.translateService.setDefaultLang(lang);
       }
       else {
        if (this.translateService.getBrowserLang() !== undefined) {
        
          const languageCode = this.translateService.getBrowserLang();

          switch(languageCode) {
            case "zh": {
              this.translateService.use('cn');
              break;
            }
            case "zh-Hans": {
              this.translateService.use('cn');
              break;
            }
            case "es": {
              this.translateService.use('es');
              break;
            }
            case "fr": {
              this.translateService.use('fr');
              break;
            }
            case "ja": {
              this.translateService.use('jp');
              break;
            }
            case "ko": {
              this.translateService.use('kr');
              break;
            }
            case "nl": {
              this.translateService.use('nl');
              break;
            }
            case "ru": {
              this.translateService.use('ru');
              break;
            }
            case "vt": {
              this.translateService.use('vt');
              break;
            }
            default: { 
              this.translateService.use('en');
            }
          }

            this.translateService.use(this.translateService.getBrowserLang());
        }
        else {
            this.translateService.use('en'); // Set your language here
        }
       }
     });
  }
}
