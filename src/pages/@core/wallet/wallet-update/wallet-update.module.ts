import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletUpdatePage } from './wallet-update';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletUpdatePage),
    TranslateModule.forChild() 
  ],
})
export class WalletUpdatePageModule {}
