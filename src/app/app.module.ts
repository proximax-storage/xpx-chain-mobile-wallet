import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastProvider } from './providers/toast/toast.provider';
import { AlertProvider } from './providers/alert/alert.provider';
import { StorageProvider } from 'src/app/providers/storage/storage.provider';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__movile_wallet'
      // driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SocialSharing,
    BarcodeScanner,
    ToastProvider,
    AlertProvider,
    StorageProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
