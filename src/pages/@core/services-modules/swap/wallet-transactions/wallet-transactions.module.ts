import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletTransactionsPage } from './wallet-transactions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletTransactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletTransactionsPage),
    TranslateModule.forChild() 
  ],
})
export class WalletTransactionsPageModule {}
