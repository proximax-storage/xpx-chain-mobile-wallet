import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletListPage } from './wallet-list';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletListPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletListPage),
    PipesModule,
    TranslateModule.forChild()
  ],
})
export class WalletListPageModule {}
