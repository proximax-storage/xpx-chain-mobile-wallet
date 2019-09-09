import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Nis1WalletListPage } from './nis1-wallet-list';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Nis1WalletListPage,
  ],
  imports: [
    IonicPageModule.forChild(Nis1WalletListPage),
    TranslateModule.forChild() 
  ],
})
export class Nis1WalletListPageModule {}
