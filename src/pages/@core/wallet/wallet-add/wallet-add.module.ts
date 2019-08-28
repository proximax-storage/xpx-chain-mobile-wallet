import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletAddPage } from './wallet-add';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletAddPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletAddPage),
    TranslateModule.forChild() 
  ],
})
export class WalletAddPageModule {}
