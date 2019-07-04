import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletBackupQrcodePage } from './wallet-backup-qrcode';
import { NgxKjuaModule } from 'ngx-kjua';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletBackupQrcodePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletBackupQrcodePage),
    NgxKjuaModule,
    TranslateModule.forChild() 
  ],
})
export class WalletBackupQrcodePageModule {}
