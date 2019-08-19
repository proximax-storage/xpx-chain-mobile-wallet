import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletDetailsPage } from './wallet-details';
import { PipesModule } from '../../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletDetailsPage), PipesModule,
    TranslateModule.forChild() 
  ],
})
export class WalletDetailsPageModule {}
