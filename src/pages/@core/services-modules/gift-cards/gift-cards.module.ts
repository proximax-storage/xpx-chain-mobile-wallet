import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftCardsPage } from './gift-cards';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  declarations: [
    GiftCardsPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftCardsPage),
    TranslateModule.forChild(),
    CurrencyMaskModule,
  ],
})
export class GiftCardsPageModule {}
