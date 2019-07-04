import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletBackupPage } from './wallet-backup';
import { NgxKjuaModule } from 'ngx-kjua';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletBackupPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletBackupPage),
    NgxKjuaModule,
    TranslateModule.forChild() 
    
  ],
})
export class WalletBackupPageModule {}
