import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletListPage } from './wallet-list';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    WalletListPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletListPage),
    PipesModule
  ],
})
export class WalletListPageModule {}
