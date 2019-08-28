import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletDeletePage } from './wallet-delete';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletDeletePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletDeletePage),
    TranslateModule.forChild() 
  ],
})
export class WalletDeletePageModule {}
