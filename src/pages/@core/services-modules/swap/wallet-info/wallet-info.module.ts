import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletInfoPage } from './wallet-info';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DirectivesModule } from '../../../../../directives/directives.module';
import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    WalletInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletInfoPage),
    TranslateModule.forChild(),
    CurrencyMaskModule,
    DirectivesModule,
    PipesModule,
  ],
})
export class WalletInfoPageModule {}
