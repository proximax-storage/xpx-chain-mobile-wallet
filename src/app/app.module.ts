import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IonicApp, IonicModule, IonicErrorHandler, FabContainer } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SecureStorage } from '@ionic-native/secure-storage';
import { Device } from '@ionic-native/device';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Clipboard } from '@ionic-native/clipboard';

import { App } from '../providers/app/app';
import { ComponentsModule } from '../components/components.module';
import { AuthProvider } from '../providers/auth/auth';
import { NemProvider } from '../providers/nem/nem';
import { WalletProvider } from '../providers/wallet/wallet';
import { AlertProvider } from '../providers/alert/alert';
import { GetBalanceProvider } from '../providers/get-balance/get-balance';
import { UtilitiesProvider } from '../providers/utilities/utilities';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { ToastProvider } from '../providers/toast/toast';
import { ContactsProvider } from '../providers/contacts/contacts';
import { BarcodeScannerProvider } from '../providers/barcode-scanner/barcode-scanner';
import { ListStorageProvider } from '../providers/list-storage/list-storage';
import { FilePickerProvider } from '../providers/file-picker/file-picker';
import { WalletBackupProvider } from '../providers/wallet-backup/wallet-backup';
import { CoingeckoProvider } from '../providers/coingecko/coingecko';
import { PipesModule } from '../pipes/pipes.module';
import { CoinPriceChartProvider } from '../providers/coin-price-chart/coin-price-chart';
import { DecimalPipe } from '../../node_modules/@angular/common';
import { AppState } from '../providers/app-state/app-state';
import { MockDataProvider } from '../providers/mock-data/mock-data';
import { SharedModule } from './shared.module';
import { NgXtruncateModule } from 'ngx-truncate';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { LocalCacheProvider } from '../providers/local-cache/local-cache';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { PostsProvider } from '../providers/posts/posts';
import { MarkdownModule } from '@ngx-markdown/core';
import { TapticEngine } from '@ionic-native/taptic-engine';
import { AppVersion } from '@ionic-native/app-version';
import { HapticProvider } from '../providers/haptic/haptic';
import { PinProvider } from '../providers/pin/pin';
import { ForgeProvider } from '../providers/forge/forge';
import { BrowserTab } from '@ionic-native/browser-tab';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { Keyboard } from "@ionic-native/keyboard";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MosaicsProvider } from '../providers/mosaics/mosaics';
import { ProximaxProvider } from '../providers/proximax/proximax';
import { TransactionsProvider } from '../providers/transactions/transactions';
import { HelperProvider } from '../providers/helper/helper';
import { Vibration } from '@ionic-native/vibration';
import { TransferTransactionProvider } from '../providers/transfer-transaction/transfer-transaction';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Screenshot } from '@ionic-native/screenshot';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SharedService } from '../providers/shared-service/shared-service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [MyApp, AboutPage, HomePage],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot({
      name: 'proximax-sirius-wallet',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    ComponentsModule,
    PipesModule,
    SharedModule,
    NgXtruncateModule,
    MarkdownModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, AboutPage, HomePage],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },

    StatusBar,
    SplashScreen,
    SecureStorage,
    Device,
    Clipboard,
    SocialSharing,
    FabContainer,
    BarcodeScanner,
    FileChooser,
    FilePath,
    File,
    Clipboard,
    DecimalPipe,
    App,
    AuthProvider,
    SharedService,
    NemProvider,
    WalletProvider,
    AlertProvider,
    GetBalanceProvider,
    UtilitiesProvider,
    ToastProvider,
    ContactsProvider,
    BarcodeScannerProvider,
    ListStorageProvider,
    FilePickerProvider,
    WalletBackupProvider,
    CoingeckoProvider,
    CoinPriceChartProvider,
    AppState,
    MockDataProvider,
    BarcodeScanner,
    LocalCacheProvider,
    LocalStorageProvider,
    PostsProvider,
    TapticEngine,
    AppVersion,
    HapticProvider,
    PinProvider,
    ForgeProvider,
    BrowserTab,
    SafariViewController,
    Keyboard,
    MosaicsProvider,
    MosaicsProvider,
    ProximaxProvider,
    TransactionsProvider,
    HelperProvider,
    Vibration,
    TransferTransactionProvider,
    FileTransfer,
    Screenshot,
    PhotoLibrary,
    Base64ToGallery,
    Deeplinks,
    ScreenOrientation
  ]
})
export class AppModule {}
