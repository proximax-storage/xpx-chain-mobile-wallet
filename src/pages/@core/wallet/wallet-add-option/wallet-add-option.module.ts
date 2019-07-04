import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletAddOptionPage } from './wallet-add-option';

@NgModule({
  declarations: [
    WalletAddOptionPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletAddOptionPage),
  ],
})
export class WalletAddOptionPageModule {}
