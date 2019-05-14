import { Component, OnDestroy } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';
// import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AuthService } from './pages/auth/service/auth.service';
import { NodeService } from '../shared/service/node.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {
  user: string;
  isLoggedIn = false;
  subscriptions: any = [
    'isLogged'
  ];

  // isLoggedIn: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    // private storage: Storage,
    private router: Router,
    private nav: NavController,
    public authService: AuthService,
    private nodeService: NodeService
  ) {
    this.initializeApp();
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.nodeService.initNode();
      // this.initGetRoot();
      this.loguer();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      if (this.subscriptions[element] !== undefined) {
        this.subscriptions[element].unsubscribe();
      }
    });
  }

  
  loguer() {
    this.subscriptions.isLogged = this.authService.getIsLogged();
    this.subscriptions.isLogged.subscribe(
      response => {
        console.log('logueado', response);
        this.isLoggedIn = response;
        this.user = this.authService.user;
        console.log('this.user', this.user);
      });
  }

  initGetRoot() {
      if (this.isLoggedIn) {
        return this.router.navigate(['/wallets']);
      } else {
        return this.router.navigate(['/login']);
      }
  }

  logout() {
    this.authService.logout();
    this.menu.enable(true, 'custom');
    this.menu.close('custom');
    return this.nav.navigateRoot(`/login`);
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  closeCustom() {
    // this.menu.enable(true, 'custom');
    this.menu.close('custom');
  }
}
