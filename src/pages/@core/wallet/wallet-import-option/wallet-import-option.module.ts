import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportOptionPage } from './wallet-import-option';

@NgModule({
  declarations: [
    WalletImportOptionPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportOptionPage),
  ],
})
export class WalletImportOptionPageModule {}
